import React, { useState } from 'react';
import { usePassStore } from '../../store/passStore';

export const ColorPicker: React.FC = () => {
  const { passData, updatePassData } = usePassStore();
  const [showPicker, setShowPicker] = useState<string | null>(null);

  const colors = [
    { key: 'backgroundColor', label: 'Background Color' },
    { key: 'foregroundColor', label: 'Text Color' },
    { key: 'labelColor', label: 'Label Color' },
  ];

  const handleColorChange = (key: string, value: string) => {
    updatePassData({ [key]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Colors</h2>
      <div className="space-y-4">
        {colors.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={passData[key as keyof typeof passData] as string || '#000000'}
                onChange={(e) => handleColorChange(key, e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm w-28"
                placeholder="#000000"
              />
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPicker(showPicker === key ? null : key)}
                  className="w-10 h-10 rounded border-2 border-gray-300 dark:border-gray-600 cursor-pointer"
                  style={{
                    backgroundColor: (passData[key as keyof typeof passData] as string) || '#000000',
                  }}
                />
                {showPicker === key && (
                  <div className="absolute right-0 mt-2 z-10">
                    <input
                      type="color"
                      value={passData[key as keyof typeof passData] as string || '#000000'}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="w-48 h-48 cursor-pointer"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
