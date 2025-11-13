'use client';

import { useState, useEffect } from 'react';

interface LandingPageProps {
  onStartQuiz: (topic: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function LandingPage(props: LandingPageProps) {
  const { onStartQuiz, isLoading = false, error = null } = props;
  const [topic, setTopic] = useState('');
  const messages = [
    'Your quiz is being generated',
    'Get ready to be amazed',
    "Let's test your IQ",
  ];
  const [loaderIndex, setLoaderIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setLoaderIndex(0);
      return;
    }

    const id = setInterval(() => {
      setLoaderIndex((i) => (i + 1) % messages.length);
    }, 2000);

    return () => clearInterval(id);
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
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
            disabled={!topic.trim() || isLoading}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span className="whitespace-nowrap">{messages[loaderIndex]}{'.'}</span>
              </>
            ) : (
              'Start Quiz'
            )}
          </button>
        </form>

          {error && (
            <div className="mt-4 text-sm text-red-600 text-center">
              {error}
            </div>
          )}

        <div className="mt-8 text-center text-sm text-gray-500">
          You'll get 10 multiple choice questions
        </div>
      </div>
    </div>
  );
}