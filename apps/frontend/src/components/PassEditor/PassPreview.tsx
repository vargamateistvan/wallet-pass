import React, { useState, useEffect } from 'react';
import { usePassStore } from '../../store/passStore';
import { BarcodeFormat } from '@wallet-pass/shared';

export const PassPreview: React.FC = () => {
  const { passData, passType, images } = usePassStore();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    // Generate QR code preview when barcode data changes
    const barcode = passData.barcodes?.[0];
    if (barcode && barcode.format === BarcodeFormat.QR && barcode.message) {
      generateQRPreview(barcode.message);
    } else {
      if (qrCodeUrl) {
        URL.revokeObjectURL(qrCodeUrl);
      }
      setQrCodeUrl(null);
    }
  }, [passData.barcodes]);

  const generateQRPreview = async (message: string) => {
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
    }
  };

  useEffect(() => {
    // Cleanup on unmount and when images change
    return () => {
      if (qrCodeUrl) {
        URL.revokeObjectURL(qrCodeUrl);
      }
      // Cleanup image blob URLs
      Object.values(images).forEach(file => {
        if (file) {
          URL.revokeObjectURL(URL.createObjectURL(file));
        }
      });
    };
  }, [qrCodeUrl, images]);

  if (!passType) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">👆</div>
          <p>Select a pass type to see preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Preview</h2>
      
      {/* iPhone-style pass preview */}
      <div className="max-w-sm mx-auto">
        <div
          className="rounded-xl overflow-hidden shadow-lg"
          style={{
            backgroundColor: passData.backgroundColor || '#ffffff',
            color: passData.foregroundColor || '#000000',
            backgroundImage: images.background ? `url(${URL.createObjectURL(images.background)})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 border-opacity-20">
            {/* Strip Image (for event tickets, coupons) */}
            {(passType === 'eventTicket' || passType === 'coupon') && images.strip && (
              <div className="mb-3 -mx-4 -mt-4">
                <img 
                  src={URL.createObjectURL(images.strip)} 
                  alt="Strip" 
                  className="w-full object-cover"
                  style={{ maxHeight: '123px' }}
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {images.logo ? (
                  <img 
                    src={URL.createObjectURL(images.logo)} 
                    alt="Logo" 
                    className="h-8 object-contain"
                  />
                ) : (
                  <div className="text-xs opacity-70">
                    {passData.logoText || 'LOGO TEXT'}
                  </div>
                )}
              </div>
              {images.icon ? (
                <img 
                  src={URL.createObjectURL(images.icon)} 
                  alt="Icon" 
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <div className="text-2xl">🏢</div>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Thumbnail for generic pass */}
            {passType === 'generic' && images.thumbnail && (
              <div className="mb-4">
                <img 
                  src={URL.createObjectURL(images.thumbnail)} 
                  alt="Thumbnail" 
                  className="w-20 h-20 rounded object-cover"
                />
              </div>
            )}
            
            <div className="mb-4">
              <div
                className="text-sm opacity-70 mb-1"
                style={{ color: passData.labelColor || '#666666' }}
              >
                {passType.toUpperCase()}
              </div>
              <div className="text-2xl font-bold">
                {passData.organizationName || 'Organization Name'}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-lg">
                {passData.description || 'Description'}
              </div>
            </div>

            {/* Barcode */}
            {passData.barcodes && passData.barcodes.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200 border-opacity-20">
                <div className="bg-white p-3 rounded">
                  <div className="text-center">
                    {passData.barcodes[0].format === BarcodeFormat.QR && qrCodeUrl ? (
                      <div className="flex flex-col items-center">
                        <img 
                          src={qrCodeUrl} 
                          alt="QR Code" 
                          className="w-32 h-32 mb-2"
                        />
                        {passData.barcodes[0].altText && (
                          <div className="text-xs text-gray-600 mt-1">
                            {passData.barcodes[0].altText}
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="text-xs text-gray-500 mb-2">
                          {passData.barcodes[0].format.replace('PKBarcodeFormat', '')}
                        </div>
                        <div className="font-mono text-sm text-gray-800">
                          {passData.barcodes[0].message}
                        </div>
                        {passData.barcodes[0].altText && (
                          <div className="text-xs text-gray-600 mt-1">
                            {passData.barcodes[0].altText}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-black bg-opacity-5 text-xs text-center opacity-70">
            Serial: {passData.serialNumber || 'Not set'}
          </div>
        </div>
      </div>

      {/* Pass info */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded text-sm text-gray-900 dark:text-gray-100">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-medium">Type:</span> {passType}
          </div>
          <div>
            <span className="font-medium">Version:</span> {passData.formatVersion || 1}
          </div>
        </div>
      </div>
    </div>
  );
};
