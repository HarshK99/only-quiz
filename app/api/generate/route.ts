import { NextResponse } from 'next/server';
import { generateQuiz } from '../../utils/quizGenerator';

type OpenAIChoice = {
  message?: { content?: string };
};

export async function POST(req: Request) {
  try {
    const { topic } = (await req.json()) as { topic?: string };
    const promptTopic = (topic || 'general').toString();

    const OPENAI_KEY = process.env.OPENAI_API_KEY;
    const topicLower = promptTopic.toLowerCase();

    const isDogTopic = topicLower === 'dog'

    // If topic is dog(s), always return local fallback (developer requested)
    if (isDogTopic) {
      const fallback = generateQuiz(promptTopic);
      return NextResponse.json(fallback);
    }

    // For any other topic, OpenAI API must be present
    if (!OPENAI_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY not configured on the server' },
        { status: 500 }
      );
    }

    const system = `You are a helpful assistant that generates educational multiple-choice quizzes. Respond ONLY with a JSON object matching the schema: {"topic":"...","questions":[{"id":1,"text":"...","options":["a","b","c","d"],"correctAnswer":0}, ...]} .
Each question must have exactly 4 options, and "correctAnswer" must be the zero-based index (0-3) of the correct option. Return exactly 10 questions. Do not include extraneous explanation or markdown.`;

    const user = `Generate 10 clear, unambiguous multiple-choice questions about "${promptTopic}". Make them varied in difficulty and keep each option concise.`;

    const payload = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      max_tokens: 1500,
      temperature: 0.2
    };

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      // For non-dog topics we do NOT fallback — return an error
      const text = await res.text().catch(() => '');
      console.error('OpenAI API error response:', res.status, text);
      return NextResponse.json(
        { error: 'OpenAI API request failed', status: res.status, details: text },
        { status: 502 }
      );
    }

    const data = (await res.json()) as { choices?: OpenAIChoice[] };
    const content = data.choices?.[0]?.message?.content || '';

    try {
      // Try to parse JSON directly from LLM response
      const parsed = JSON.parse(content);
      return NextResponse.json(parsed);
    } catch (err) {
      // If parsing fails, return an error for non-dog topics
      console.error('Failed to parse LLM output as JSON.', err);
      return NextResponse.json(
        { error: 'Failed to parse OpenAI response as JSON' },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
