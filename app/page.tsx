'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import QuizQuestion from './components/QuizQuestion';
import ScorePage from './components/ScorePage';
import ReviewPage from './components/ReviewPage';
import { generateQuiz, calculateScore } from './utils/quizGenerator';
import { AppState, Quiz, UserAnswer } from './types/quiz';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditingMode, setIsEditingMode] = useState(false);

  const handleStartQuiz = async (topic: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });

      if (!res.ok) {
        throw new Error('Generation API failed');
      }

      const data = await res.json();

      // Basic validation
      if (!data || !Array.isArray(data.questions)) {
        throw new Error('Invalid response from generation API');
      }

      setQuiz(data as Quiz);
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setSelectedOption(null);
      // push a history entry so the browser Back button returns to the landing page
      try {
        // push a clean path so Back button works (`/quiz`)
        window.history.pushState({ quiz: true }, '', '/quiz');
      } catch (e) {
        // ignore (server-side or older browsers)
      }
      setAppState('quiz');
      setIsEditingMode(false);
    } catch (err) {
      console.error('OpenAI generation failed', err);
      // Only use local fallback for dog(s) topics. For other topics surface an error.
      const normalized = topic.toLowerCase().trim();
      const isDogTopic = normalized === 'dog' || normalized === 'dogs' || normalized.includes(' dog') || normalized.includes('dogs');
      if (isDogTopic) {
        const newQuiz = generateQuiz(topic);
        setQuiz(newQuiz);
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
        setSelectedOption(null);
        try {
          window.history.pushState({ quiz: true }, '', '/quiz');
        } catch (e) {}
        setAppState('quiz');
        setIsEditingMode(false);
      } else {
        setError('Quiz generation failed. Please set OPENAI_API_KEY or try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (!quiz) return;
    
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isCorrect = optionIndex === currentQuestion.correctAnswer;
    
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOption: optionIndex,
      isCorrect
    };
    
    setSelectedOption(optionIndex);
    // Update existing answer for the question if present, otherwise append
    setUserAnswers((prev) => {
      const existingIndex = prev.findIndex(a => a.questionId === currentQuestion.id);
      if (existingIndex >= 0) {
        const copy = [...prev];
        copy[existingIndex] = newAnswer;
        return copy;
      }
      return [...prev, newAnswer];
    });

    // Auto-advance after a short delay unless we're editing a single question
    if (!isEditingMode) {
      setTimeout(() => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedOption(null);
        } else {
          // After the last question, go to review screen to allow edits before final submit
          setAppState('review');
        }
      }, 1500);
    }
  };

  const handleEditQuestion = (index: number) => {
    if (!quiz) return;
    const q = quiz.questions[index];
    const existing = userAnswers.find(a => a.questionId === q.id);
    setCurrentQuestionIndex(index);
    setSelectedOption(existing ? existing.selectedOption : null);
    setIsEditingMode(true);
    setAppState('quiz');
  };

  const handleRestart = () => {
    if (quiz) {
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setSelectedOption(null);
      setAppState('quiz');
      setIsEditingMode(false);
    }
  };

  const handleNewQuiz = () => {
    setQuiz(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedOption(null);
    setAppState('landing');
    setIsEditingMode(false);
    try {
      // navigate back to root path
      window.history.pushState({}, '', '/');
    } catch (e) {}
  };

  // Keep UI state in sync with browser navigation (back/forward)
  useEffect(() => {
    const onPop = () => {
      const path = window.location.pathname;
      if (path === '/quiz') {
        // if the URL indicates a quiz, stay in quiz state (don't auto-generate)
        setAppState((prev) => (prev === 'results' ? 'results' : 'quiz'));
      } else {
        // otherwise go back to landing
        setAppState('landing');
      }
    };

    window.addEventListener('popstate', onPop);
    // on mount, check current URL
    onPop();
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  if (appState === 'landing') {
    return <LandingPage onStartQuiz={handleStartQuiz} isLoading={isLoading} error={error} />;
  }

  if (appState === 'quiz' && quiz) {
    return (
      <AnimatePresence mode="wait">
        <QuizQuestion
          key={currentQuestionIndex}
          question={quiz.questions[currentQuestionIndex]}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={quiz.questions.length}
          onAnswer={handleAnswer}
          selectedOption={selectedOption}
          isEditing={isEditingMode}
          onBackToReview={() => {
            setIsEditingMode(false);
            setAppState('review');
          }}
        />
      </AnimatePresence>
    );
  }

  if (appState === 'review' && quiz) {
    return (
      <ReviewPage
        questions={quiz.questions}
        userAnswers={userAnswers}
        onEditQuestion={handleEditQuestion}
        onSubmitFinal={() => {
          const score = calculateScore(quiz.questions, userAnswers.map(a => a.selectedOption));
          // set results state with existing userAnswers
          setAppState('results');
        }}
        onRestart={handleNewQuiz}
      />
    );
  }

  if (appState === 'results' && quiz) {
    const score = calculateScore(quiz.questions, userAnswers.map(a => a.selectedOption));
    
    return (
      <ScorePage
        score={score}
        totalQuestions={quiz.questions.length}
        topic={quiz.topic}
        questions={quiz.questions}
        userAnswers={userAnswers}
        onRestart={handleNewQuiz}
      />
    );
  }

}
