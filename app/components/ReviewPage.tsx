'use client';

import { Question, UserAnswer } from '../types/quiz';
import QuestionSummaryItem from './QuestionSummaryItem';

interface ReviewPageProps {
  questions: Question[];
  userAnswers: UserAnswer[];
  onEditQuestion: (index: number) => void;
  onSubmitFinal: () => void;
  onRestart: () => void;
}

export default function ReviewPage({ questions, userAnswers, onEditQuestion, onSubmitFinal, onRestart }: ReviewPageProps) {
  const getUserAnswer = (qId: number) => userAnswers.find(a => a.questionId === qId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Review Your Answers</h1>
          <p className="text-gray-600">You can submit final answers or edit any question before submitting.</p>
        </div>

        <div className="space-y-3 mb-6 max-h-[48vh] overflow-y-auto">
          {questions.map((q, idx) => {
            const ua = getUserAnswer(q.id);
            return (
              <QuestionSummaryItem
                key={q.id}
                question={q}
                userAnswer={ua}
                index={idx}
                showEdit
                onEdit={() => onEditQuestion(idx)}
              />
            );
          })}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onSubmitFinal}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
          >
            Submit Final
          </button>

          <button
            onClick={onRestart}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold shadow-lg hover:bg-gray-200 transition-all duration-200"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
