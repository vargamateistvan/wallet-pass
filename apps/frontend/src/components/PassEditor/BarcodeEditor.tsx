import React, { useState, useEffect } from 'react';
import { usePassStore } from '../../store/passStore';
import { BarcodeFormat, BARCODE_FORMAT_NAMES } from '@wallet-pass/shared';

export const BarcodeEditor: React.FC = () => {
  const { passData, setBarcode } = usePassStore();
  const [format, setFormat] = useState<BarcodeFormat>(BarcodeFormat.QR);
  const [message, setMessage] = useState('');
  const [altText, setAltText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const currentBarcode = passData.barcodes?.[0];

  useEffect(() => {
    if (currentBarcode) {
      setFormat(currentBarcode.format);
      setMessage(currentBarcode.message);
      setAltText(currentBarcode.altText || '');
    }
  }, [currentBarcode]);

  useEffect(() => {
    // Generate QR code preview when message changes
    if (message && format === BarcodeFormat.QR) {
      generateQRPreview();
    } else {
      setQrCodeUrl(null);
    }
  }, [message, format]);

  const generateQRPreview = async () => {
    if (!message.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/passes/qrcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: message,
          format: 'png',
          size: 200,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        
        // Clean up previous URL
        if (qrCodeUrl) {
          URL.revokeObjectURL(qrCodeUrl);
        }
        
        setQrCodeUrl(url);
      }
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (qrCodeUrl) {
        URL.revokeObjectURL(qrCodeUrl);
      }
    };
  }, [qrCodeUrl]);

  const handleSave = () => {
    if (message.trim()) {
      setBarcode(format, message, altText || undefined);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Barcode/QR Code</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Barcode Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as BarcodeFormat)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {Object.entries(BARCODE_FORMAT_NAMES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Message/Data *
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onBlur={handleSave}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Data to encode in barcode"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            This data will be encoded in the barcode
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Alternative Text
          </label>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            onBlur={handleSave}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Text to display below barcode"
          />
        </div>

        {currentBarcode && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded border border-gray-200 dark:border-gray-600">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</div>
            <div className="flex flex-col items-center space-y-3">
              {format === BarcodeFormat.QR && qrCodeUrl ? (
                <div className="bg-white p-4 rounded border border-gray-300 dark:border-gray-600">
                  {isGenerating ? (
                    <div className="w-[200px] h-[200px] flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                  ) : (
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code Preview" 
                      className="w-[200px] h-[200px]"
                    />
                  )}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 p-4 rounded border border-gray-300 dark:border-gray-600">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{BARCODE_FORMAT_NAMES[format]}</div>
                  <div className="font-mono text-sm text-gray-900 dark:text-white">{message}</div>
                </div>
              )}
              {altText && (
                <div className="text-sm text-gray-600 dark:text-gray-400">{altText}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
