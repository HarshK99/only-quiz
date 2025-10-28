'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import QuizQuestion from './components/QuizQuestion';
import ScorePage from './components/ScorePage';
import { generateQuiz, calculateScore } from './utils/quizGenerator';
import { AppState, Quiz, UserAnswer } from './types/quiz';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleStartQuiz = (topic: string) => {
    const newQuiz = generateQuiz(topic);
    setQuiz(newQuiz);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedOption(null);
    setAppState('quiz');
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
    const updatedAnswers = [...userAnswers, newAnswer];
    setUserAnswers(updatedAnswers);
    
    // Auto-advance after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      } else {
        // Quiz complete
        setAppState('results');
      }
    }, 1500);
  };

  const handleRestart = () => {
    if (quiz) {
      setCurrentQuestionIndex(0);
      setUserAnswers([]);
      setSelectedOption(null);
      setAppState('quiz');
    }
  };

  const handleNewQuiz = () => {
    setQuiz(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedOption(null);
    setAppState('landing');
  };

  if (appState === 'landing') {
    return <LandingPage onStartQuiz={handleStartQuiz} />;
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
        />
      </AnimatePresence>
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
