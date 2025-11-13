import { Question, Quiz } from '../types/quiz';

// Mock question database - in a real app, this would come from an API or AI service
const questionTemplates: Record<string, Question[]> = {

  dogs:[
  {
    id: 1,
    text: "What is the most popular dog breed in the world according to the American Kennel Club?",
    options: ["Labrador Retriever", "German Shepherd", "Golden Retriever", "Bulldog"],
    correctAnswer: 0
  },
  {
    id: 2,
    text: "Which sense is most developed in dogs?",
    options: ["Sight", "Taste", "Hearing", "Smell"],
    correctAnswer: 3
  },
  {
    id: 3,
    text: "What is a group of puppies called?",
    options: ["Pack", "Litter", "Herd", "Brood"],
    correctAnswer: 1
  },
  {
    id: 4,
    text: "Which dog breed is known for its blue-black tongue?",
    options: ["Chow Chow", "Pug", "Dalmatian", "Corgi"],
    correctAnswer: 0
  },
  {
    id: 5,
    text: "Which part of a dog’s body is unique like a human fingerprint?",
    options: ["Tail", "Nose print", "Paw pads", "Ears"],
    correctAnswer: 1
  },
  {
    id: 6,
    text: "Which gene mutation is responsible for the short-legged appearance in breeds like Dachshunds and Corgis?",
    options: ["FGF4 retrogene insertion", "MYO5A deletion", "COL1A1 mutation", "MC1R variant"],
    correctAnswer: 0
  },
  {
    id: 7,
    text: "What is the scientific name of the domestic dog?",
    options: ["Canis lupus", "Canis familiaris", "Canis domesticus", "Canis aureus"],
    correctAnswer: 1
  },
  {
    id: 8,
    text: "Which part of a dog’s brain is most associated with its powerful sense of smell?",
    options: ["Olfactory bulb", "Cerebellum", "Amygdala", "Frontal lobe"],
    correctAnswer: 0
  },
  {
    id: 9,
    text: "What is the typical gestation period for dogs?",
    options: ["45–50 days", "58–68 days", "70–80 days", "90–100 days"],
    correctAnswer: 1
  },
  {
    id: 10,
    text: "Which ancient civilization is believed to have first domesticated dogs?",
    options: ["Ancient Egypt", "Mesopotamia", "China", "Hunter-gatherer societies before agriculture"],
    correctAnswer: 3
  }
]


};

// NOTE: generic fallback generator removed. Local questions are provided only
// for known topics (e.g., `dogs`). Non-matching topics should be generated
// by the OpenAI API. If no matching template is found, an empty question set
// is returned so callers can decide how to handle the missing data.

export function generateQuiz(topic: string): Quiz {
  const normalizedTopic = topic.toLowerCase().trim();
  
  // Check if we have specific questions for this topic
  let questions: Question[] = [];
  
  if (questionTemplates[normalizedTopic]) {
    questions = [...questionTemplates[normalizedTopic]];
  } else {
    // Check for partial matches
    const matchingKey = Object.keys(questionTemplates).find(key => 
      normalizedTopic.includes(key) || key.includes(normalizedTopic)
    );
    
    if (matchingKey) {
      questions = [...questionTemplates[matchingKey]];
    } else {
      // No local template available for this topic. Return an empty list so
      // callers (client or server) can decide whether to call an external
      // generator (OpenAI) or surface an error.
      questions = [];
    }
  }

  // Shuffle questions and take 10
  const shuffledQuestions = questions
    .sort(() => Math.random() - 0.5)
    .slice(0, 10)
    .map((q, index) => ({ ...q, id: index + 1 }));

  return {
    topic,
    questions: shuffledQuestions
  };
}

export function calculateScore(questions: Question[], userAnswers: number[]): number {
  return questions.reduce((score, question, index) => {
    const userAnswer = userAnswers[index];
    return userAnswer === question.correctAnswer ? score + 1 : score;
  }, 0);
}