import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [wordCount, setWordCount] = useState(130);

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError('Please provide text to summarize');
      return;
    }
    setError('');
    setSummary('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, word_count: wordCount }),
      });
      const data = await response.json();
      if (response.ok) {
        setSummary(data.summary);
      } else {
        setError(data.detail || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  const clearInput = () => {
    setText('');
    setSummary('');
    setError('');
    setWordCount(130);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Text Summarization App</h1>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="mb-4">
            <input
              type="number"
              className="w-32 p-2 border rounded"
              value={wordCount}
              onChange={(e) => setWordCount(parseInt(e.target.value) || 130)}
              placeholder="Word count"
            />
          </div>
          <div className="flex items-center mb-4">
            <textarea
              className="flex-1 p-3 border rounded-l-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="5"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter an article to summarize..."
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
            />
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-r-lg disabled:bg-blue-300"
              onClick={handleSubmit}
              disabled={isLoading || !text.trim()}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            onClick={clearInput}
          >
            Clear
          </button>
          {isLoading && (
            <div className="mt-4 text-gray-600">
              Generating summary...
            </div>
          )}
          {error && (
            <div className="mt-4 text-red-600">
              Error: {error}
            </div>
          )}
          {summary && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold text-gray-800">Summary:</h2>
              <p className="p-3 bg-gray-100 rounded-lg">{summary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;