import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PassTypeSelector } from '../components/PassEditor/PassTypeSelector';
import { BasicInfoEditor } from '../components/PassEditor/BasicInfoEditor';
import { ColorPicker } from '../components/PassEditor/ColorPicker';
import { BarcodeEditor } from '../components/PassEditor/BarcodeEditor';
import { ImageUploader } from '../components/PassEditor/ImageUploader';
import { PassPreview } from '../components/PassEditor/PassPreview';
import { usePassStore } from '../store/passStore';
import { passApi } from '../services/passService';
import AddToAppleWalletButton from '../assets/US-UK_Add_to_Apple_Wallet_RGB_101421.svg';

export const Editor: React.FC = () => {
  const navigate = useNavigate();
  const { passData, passType, validatePass, resetPass } = usePassStore();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdPassId, setCreatedPassId] = useState<string | null>(null);

  const handleCreate = async () => {
    setError(null);
    
    // Validate
    const validation = validatePass();
    if (!validation.valid) {
      setError(validation.errors.join(', '));
      return;
    }

    if (!passType) {
      setError('Please select a pass type');
      return;
    }

    setIsCreating(true);
    try {
      const response = await passApi.createPass({
        passType,
        passData,
      });

      if (response.success) {
        setCreatedPassId(response.passId || '');
        setError(null);
      } else {
        setError(response.error || 'Failed to create pass');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create pass');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDownload = async () => {
    if (!createdPassId) return;
    
    try {
      const blob = await passApi.downloadPass(createdPassId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pass-${createdPassId}.pkpass`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download pass');
    }
  };

  const handleCreateAnother = () => {
    setCreatedPassId(null);
    resetPass();
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset? All changes will be lost.')) {
      resetPass();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pass Editor</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Create your custom wallet pass</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleCreate}
                disabled={isCreating || !passType || !!createdPassId}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {isCreating ? 'Creating...' : 'Create Pass'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
              ✕
            </button>
          </div>
        </div>
      )}

      {createdPassId && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 text-green-500 dark:text-green-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">Pass Created Successfully!</h3>
            <p className="text-green-700 dark:text-green-300 mb-6">Your wallet pass is ready to download</p>
            <div className="flex gap-3 justify-center items-center flex-wrap">
              <button
                onClick={handleDownload}
                className="inline-block hover:opacity-80 transition-opacity"
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  background: 'transparent'
                }}
              >
                <img 
                  src={AddToAppleWalletButton} 
                  alt="Add to Apple Wallet" 
                  style={{ 
                    display: 'block',
                    height: '40px',
                    width: 'auto'
                  }}
                />
              </button>
              <button
                onClick={handleCreateAnother}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
              >
                Create Another
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Editors */}
          <div className="space-y-6">
            <PassTypeSelector />
            {passType && (
              <>
                <BasicInfoEditor />
                <ColorPicker />
                <BarcodeEditor />
                <ImageUploader />
              </>
            )}
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-4 lg:self-start">
            <PassPreview />
          </div>
        </div>
      </div>
    </div>
  );
};
