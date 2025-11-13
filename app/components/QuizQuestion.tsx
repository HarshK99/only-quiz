'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '../types/quiz';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedOption: number) => void;
  selectedOption: number | null;
  isEditing?: boolean;
  onBackToReview?: () => void;
}

export default function QuizQuestion({ 
  question, 
  questionNumber, 
  totalQuestions, 
  onAnswer,
  selectedOption,
  isEditing,
  onBackToReview
}: QuizQuestionProps) {
  const [animatingOption, setAnimatingOption] = useState<number | null>(null);
  const propsIsEditing = Boolean(isEditing);

  const handleOptionClick = (optionIndex: number) => {
    // Allow changing selection when in editing mode
    if (selectedOption !== null && !propsIsEditing) return;

    setAnimatingOption(optionIndex);
    setTimeout(() => {
      onAnswer(optionIndex);
      setAnimatingOption(null);
      // If we're editing a single question, return to review after selecting
      if (propsIsEditing && onBackToReview) {
        onBackToReview();
      }
    }, 200);
  };

  const getOptionClasses = (optionIndex: number) => {
    const baseClasses = "w-full p-4 text-left border-2 rounded-xl transition-all duration-200 cursor-pointer transform";
    
    if (selectedOption === optionIndex) {
      return `${baseClasses} border-blue-500 bg-blue-50 shadow-lg scale-105 ring-2 ring-blue-200`;
    }
    
    if (animatingOption === optionIndex) {
      return `${baseClasses} border-blue-400 bg-blue-25 scale-105`;
    }
    
    if (selectedOption !== null) {
      return `${baseClasses} border-gray-200 bg-gray-50 cursor-not-allowed opacity-60`;
    }
    
    return `${baseClasses} border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-25 hover:scale-102 hover:shadow-md`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div 
        key={question.id}
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
      >
        {propsIsEditing && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => onBackToReview && onBackToReview()}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              ← Back to review
            </button>
          </div>
        )}
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round((questionNumber / totalQuestions) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Question */}
        <motion.div 
          className="mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
            {question.text}
          </h2>
        </motion.div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: selectedOption === null || propsIsEditing ? 1.02 : 1 }}
              whileTap={{ scale: selectedOption === null || propsIsEditing ? 0.98 : 1 }}
              onClick={() => handleOptionClick(index)}
              className={getOptionClasses(index)}
              disabled={selectedOption !== null && !propsIsEditing}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 w-6 h-6 mr-3">
                  <motion.div 
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === index 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}
                    animate={selectedOption === index ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {selectedOption === index && (
                      <motion.div 
                        className="w-2 h-2 bg-white rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                      />
                    )}
                  </motion.div>
                </div>
                <span className="text-gray-800 font-medium">{option}</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Status message */}
        <AnimatePresence>
          {selectedOption !== null && (
            <motion.div 
              className="text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              <p className="text-blue-600 font-medium">Answer selected!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}