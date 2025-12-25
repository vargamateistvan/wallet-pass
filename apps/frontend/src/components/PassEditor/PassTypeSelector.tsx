import React from 'react';
import { PassType, PASS_TYPE_NAMES } from '@wallet-pass/shared';
import { usePassStore } from '../../store/passStore';

const PASS_TYPES = Object.entries(PASS_TYPE_NAMES);

export const PassTypeSelector: React.FC = () => {
  const { passType, setPassType } = usePassStore();

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Select Pass Type</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {PASS_TYPES.map(([key, name]) => (
          <button
            key={key}
            onClick={() => setPassType(key as PassType)}
            className={`p-4 rounded-lg border-2 transition-all ${
              passType === key
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-900 dark:text-gray-100'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">
                {key === 'boardingPass' && '✈️'}
                {key === 'coupon' && '🎫'}
                {key === 'eventTicket' && '🎭'}
                {key === 'generic' && '📄'}
                {key === 'storeCard' && '💳'}
              </div>
              <div className="font-medium">{name}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
