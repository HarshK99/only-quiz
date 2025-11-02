'use client';

import { useState } from 'react';

interface LandingPageProps {
  onStartQuiz: (topic: string) => void;
}

export default function LandingPage({ onStartQuiz }: LandingPageProps) {
  const [topic, setTopic] = useState('dogs');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onStartQuiz(topic.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Only Quiz
          </h1>
          <p className="text-gray-600">
            Test your knowledge on any topic with our intelligent quiz generator
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="topic" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Enter a topic you'd like to be quizzed on:
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., JavaScript, World History, Science..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!topic.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
          >
            Start Quiz
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          You'll get 10 multiple choice questions
        </div>
      </div>
    </div>
  );
}