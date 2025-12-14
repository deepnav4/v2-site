import { useState } from 'react';
import { ExternalLink } from 'lucide-react';

export default function Ladder() {
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert(`Generating ladder for: ${handle}`);
    }, 1000);
  };

  return (
    <div className="container py-12 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4">Codeforces Ladder</h1>
        <p className="text-lg text-gray-600">
          If you are curious, read{' '}
          <a href="/blog/cf-ladder" className="text-blue-600 hover:text-blue-700">
            how it works
          </a>
        </p>
      </div>

      {/* Hero Section */}
      <div className="card mb-12 bg-gradient-to-br from-blue-50 to-purple-50">
        <h2 className="text-3xl font-bold mb-4">Ready to climb the ladder?</h2>
        <p className="text-gray-700 mb-8">
          Enter your Codeforces handle to generate a personalized practice ladder tailored 
          to your contest history and skill level.
        </p>

        <form onSubmit={handleSubmit} className="max-w-xl">
          <div className="flex gap-3">
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="Codeforces handle"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Loading...' : 'Generate Ladder'}
            </button>
          </div>
        </form>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="font-bold mb-2">Statistical Analysis</h3>
          <p className="text-sm text-gray-600">Volatility & success rate</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="font-bold mb-2">Adaptive Difficulty</h3>
          <p className="text-sm text-gray-600">Dynamic range calibration</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⏱️</span>
          </div>
          <h3 className="font-bold mb-2">Adaptive Timer</h3>
          <p className="text-sm text-gray-600">Time recommendations</p>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="card mb-12">
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        <div className="space-y-4 text-gray-700">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="font-bold mb-1">Contest Analysis</h3>
              <p className="text-sm">
                We analyze your past contest performances to understand your current skill level 
                and problem-solving patterns.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="font-bold mb-1">Smart Problem Selection</h3>
              <p className="text-sm">
                Based on your rating and solve history, we curate problems that challenge you 
                at the right difficulty level.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="font-bold mb-1">Progressive Difficulty</h3>
              <p className="text-sm">
                Problems are ordered in increasing difficulty, allowing you to build confidence 
                and skills systematically.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="card bg-gray-50">
        <h3 className="font-bold mb-4">Feedback & Discussion</h3>
        <p className="text-sm text-gray-600 mb-4">
          Share your thoughts, suggestions, or report issues with the Codeforces Ladder tool
        </p>
        <a
          href="https://github.com/tejas242/screenager/discussions"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          Join the discussion <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}
