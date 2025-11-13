"use client";

import { Question, UserAnswer } from '../types/quiz';

interface Props {
  question: Question;
  userAnswer?: UserAnswer | null;
  index: number;
  showCorrect?: boolean; // whether to show correct answer when wrong
  showEdit?: boolean; // whether to show Edit button
  onEdit?: () => void;
}

export default function QuestionSummaryItem({ question, userAnswer, index, showCorrect = false, showEdit = false, onEdit }: Props) {
  const isCorrect = Boolean(userAnswer && userAnswer.isCorrect);

  return (
    <div
      className={`p-3 rounded-lg ${showCorrect ? (isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50') : 'border border-gray-200 bg-white'}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800 mb-1">Q{index + 1}: {question.text}</p>
          <p className="text-xs text-gray-600">{userAnswer ? `Your answer: ${question.options[userAnswer.selectedOption]}` : 'No answer'}</p>
          {showCorrect && !isCorrect && (
            <p className="text-xs text-green-700 mt-1">Correct: {question.options[question.correctAnswer]}</p>
          )}
        </div>

        {showEdit ? (
          <div className="flex flex-col gap-2 ml-4">
            <button onClick={onEdit} className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded-md text-sm">Edit</button>
          </div>
        ) : (
          <div className={`flex-shrink-0 ml-3 ${showCorrect ? (isCorrect ? 'text-green-600' : 'text-red-600') : ''}`}>{showCorrect ? (isCorrect ? '✓' : '✗') : null}</div>
        )}
      </div>
    </div>
  );
}
