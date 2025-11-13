'use client';

import { Question, UserAnswer } from '../types/quiz';
import QuestionSummaryItem from './QuestionSummaryItem';

interface ScorePageProps {
  score: number;
  totalQuestions: number;
  topic: string;
  questions: Question[];
  userAnswers: UserAnswer[];
  onRestart: () => void;
}

export default function ScorePage({ 
  score, 
  totalQuestions, 
  topic, 
  questions, 
  userAnswers, 
  onRestart 
}: ScorePageProps) {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = () => {
    if (percentage >= 90) return 'Excellent! 🎉';
    if (percentage >= 80) return 'Great job! 👏';
    if (percentage >= 70) return 'Good work! 👍';
    if (percentage >= 60) return 'Not bad! 📚';
    return 'Keep studying! 💪';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Quiz Complete!
          </h1>
          <p className="text-gray-600">
            Here's how you did on <span className="font-semibold">{topic}</span>
          </p>
        </div>

        {/* Score Display */}
        <div className="text-center mb-8">
          <div className={`text-6xl font-bold mb-2 ${getScoreColor()}`}>
            {score}/{totalQuestions}
          </div>
          <div className={`text-2xl font-semibold mb-4 ${getScoreColor()}`}>
            {percentage}%
          </div>
          <p className="text-xl text-gray-700 font-medium">
            {getScoreMessage()}
          </p>
        </div>

        {/* Score breakdown */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Question Summary
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {questions.map((question, index) => {
              const userAnswer = userAnswers.find(a => a.questionId === question.id);
              return (
                <QuestionSummaryItem
                  key={question.id}
                  question={question}
                  userAnswer={userAnswer}
                  index={index}
                  showCorrect
                />
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onRestart}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
          >
            Take Another Quiz
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold shadow-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
          >
            New Topic
          </button>
        </div>
      </div>
    </div>
  );
}