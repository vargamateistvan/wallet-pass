import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { templateApi } from '../services/passService';
import type { PassTemplate } from '@wallet-pass/shared';

export const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<PassTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await templateApi.listTemplates(true);
      if (response.success && response.data) {
        setTemplates(response.data);
      }
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const useTemplate = (_template: PassTemplate) => {
    // TODO: Load template into pass store
    navigate('/editor');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pass Templates</h1>
              <p className="text-sm text-gray-600">Start with a pre-designed template</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading templates...</div>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No templates available
            </h3>
            <p className="text-gray-600 mb-4">Be the first to create one!</p>
            <button
              onClick={() => navigate('/editor')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Create New Pass
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div
                  className="h-40 flex items-center justify-center text-6xl"
                  style={{ backgroundColor: template.configuration.backgroundColor || '#e5e7eb' }}
                >
                  {template.passType === 'storeCard' && '💳'}
                  {template.passType === 'eventTicket' && '🎭'}
                  {template.passType === 'coupon' && '🎫'}
                  {template.passType === 'boardingPass' && '✈️'}
                  {template.passType === 'generic' && '📄'}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {template.description}
                  </p>
                  <button
                    onClick={() => useTemplate(template)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Use This Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
