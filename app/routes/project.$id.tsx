'use client';

import { useParams } from '@remix-run/react';
import { mockProjects } from '~/routes/projects';

export default function Project() {
  const params = useParams();
  const project = mockProjects.find((p) => p.id === params.id);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen w-screen text-center text-red-500 bg-black">
        Project not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-gray-100 flex flex-col">
      {/* Header with project title and hot badge */}
      <header className="bg-gradient-to-r from-gray-900 to-black p-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          {project.token.icon && (
            <img
              src={project.token.icon || '/placeholder.svg'}
              alt={project.token.symbol}
              className="w-20 h-20 rounded-lg object-cover border border-gray-700 shadow-lg"
            />
          )}
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-2 text-white">{project.title}</h1>
            <div className="text-lg text-purple-400 mt-2">
              {project.category} • Risk Level: {project.riskLevel}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Description section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-purple-300 mb-4">Project Overview</h2>
            <p className="text-xl leading-relaxed text-gray-300">{project.description}</p>
          </section>

          {/* Token information */}
          <section className="mb-12 bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-xl">
            <h2 className="text-2xl font-bold text-purple-300 mb-6">Token Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {project.token.name} ({project.token.symbol})
                </h3>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center border-b border-gray-800 pb-3">
                    <span className="text-gray-400">Current Price:</span>
                    <span className="text-xl font-bold text-white">${project.token.currentPrice.toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-gray-800 pb-3">
                    <span className="text-gray-400">Market Cap:</span>
                    <span className="text-xl font-bold text-white">${project.token.marketCap.toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-gray-800 pb-3">
                    <span className="text-gray-400">24h Change:</span>
                    <span
                      className={`text-xl font-bold ${project.token.priceChangePercentage24h >= 0 ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {project.token.priceChangePercentage24h}%
                    </span>
                  </li>
                </ul>
              </div>
              <div className="bg-black rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-semibold text-white mb-4">Additional Details</h3>
                {project.launchDate && (
                  <div className="flex justify-between items-center border-b border-gray-800 pb-3 mb-3">
                    <span className="text-gray-400">Launch Date:</span>
                    <span className="text-white">{new Date(project.launchDate).toLocaleDateString()}</span>
                  </div>
                )}
                {project.website && (
                  <div className="mt-6">
                    <a
                      href={project.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300"
                    >
                      Visit Official Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Risk assessment */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-purple-300 mb-4">Risk Assessment</h2>
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex items-center mb-4">
                <div className="text-lg font-semibold mr-4">Risk Level:</div>
                <div
                  className={`px-4 py-1 rounded-full font-medium ${
                    project.riskLevel === 'Low'
                      ? 'bg-green-900 text-green-300'
                      : project.riskLevel === 'Medium'
                        ? 'bg-yellow-900 text-yellow-300'
                        : 'bg-red-900 text-red-300'
                  }`}
                >
                  {project.riskLevel}
                </div>
              </div>
              <p className="text-gray-400">
                This risk assessment is based on market volatility, project maturity, and team experience. Always do
                your own research before investing.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 p-6 text-center text-gray-500">
        <p>
          © {new Date().getFullYear()} Crypto Projects Explorer. All information is provided for educational purposes
          only.
        </p>
      </footer>
    </div>
  );
}
