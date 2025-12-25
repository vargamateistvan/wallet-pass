import React from 'react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Wallet Pass Creator
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create beautiful Apple Wallet passes in minutes
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/editor"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg"
            >
              Create New Pass
            </Link>
            <Link
              to="/templates"
              className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg border border-gray-200"
            >
              Browse Templates
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">Customizable Design</h3>
            <p className="text-gray-600">
              Choose colors, add images, and customize every aspect of your pass
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">QR Codes & Barcodes</h3>
            <p className="text-gray-600">
              Add QR codes, barcodes, and NFC support for easy scanning
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Instant Download</h3>
            <p className="text-gray-600">
              Download your .pkpass file instantly and add to Apple Wallet
            </p>
          </div>
        </div>

        {/* Pass Types */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Supported Pass Types
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: '✈️', name: 'Boarding Pass' },
              { icon: '🎫', name: 'Coupon' },
              { icon: '🎭', name: 'Event Ticket' },
              { icon: '💳', name: 'Store Card' },
              { icon: '📄', name: 'Generic' },
            ].map((type) => (
              <div key={type.name} className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-4xl mb-2">{type.icon}</div>
                <div className="text-sm font-medium text-gray-700">{type.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
