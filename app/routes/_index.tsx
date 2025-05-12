import { useState } from 'react';

// (Removed server-side Remix hooks and isSubmitting from navigation)

export default function Waitlist() {
  // State for managing the success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // State for managing the form
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    // Simulate async submission
    setTimeout(() => {
      // Simulate random error (1 in 10 chance)
      if (Math.random() < 0.1) {
        setError('Server error. Please try again.');
        setIsSubmitting(false);

        return;
      }

      setSuccessMessage("You've been added to our waitlist!");
      setShowSuccessModal(true);
      setIsSubmitting(false);
      setEmail('');
    }, 1000);
  };

  // Show success modal when submission is successful
  if (successMessage && !showSuccessModal) {
    setShowSuccessModal(true);
  }

  return (
    <div className="min-h-screen w-full bg-black text-gray-100 flex flex-col">
      {/* Header with gradient background */}
      <header className="bg-gradient-to-r from-gray-900 to-black p-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white">
            AIMPACT <span className="text-purple-400">Waitlist</span>
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-8 flex items-center justify-center">
        <div className="max-w-3xl w-full mx-auto">
          <div className="bg-gray-900 rounded-xl p-10 border border-gray-800 shadow-xl">
            {/* Headline and description */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-4">Be the First to Build the Future of Solana</h2>
              <p className="text-xl text-gray-300 leading-relaxed">Ready to create Web3 apps like never before?</p>
              <p className="text-xl text-gray-300 leading-relaxed">Bring your ideas to life in seconds.</p>
            </div>

            {/* Waitlist Perks Section */}
            <div className="mb-10 max-w-2xl mx-auto bg-gray-800 rounded-lg p-6 border border-purple-700 text-white">
              <h3 className="text-2xl font-semibold mb-3 text-purple-300 text-center">
                By joining our exclusive waitlist, you'll:
              </h3>
              <ul className="list-disc list-inside text-lg text-gray-200 mb-4">
                <li>Get early access to our beta testing program</li>
                <li>Be among the first developers to explore our vibe-coding environment</li>
                <li>Help shape the platform with your feedback</li>
                <li>Unlock early builder perks and community rewards</li>
              </ul>
              <div className="text-center text-pink-400 font-bold mt-4">
                Space is limited.
                <br />
                Claim your spot before public launch.
              </div>
            </div>

            {/* Waitlist form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-lg font-medium text-purple-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white text-lg"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {/* Error message */}
                {error && <div className="mt-2 text-red-400 text-sm">{error}</div>}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300 ${
                  isSubmitting
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Join the Waitlist'}
              </button>
            </form>

            {/* Additional information */}
            <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-400">
              <p>
                We respect your privacy and will never share your information with third parties. You can unsubscribe at
                any time.
              </p>
            </div>
          </div>

          {/* Features section */}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 p-6 text-center text-gray-500">
        <p>© {new Date().getFullYear()} AIMPACT. All information is provided for educational purposes only.</p>
      </footer>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-2xl max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{successMessage || 'Success!'}</h3>
              <p className="text-gray-300 mb-6">We'll notify you about new projects and opportunities. Stay tuned!</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-300"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}