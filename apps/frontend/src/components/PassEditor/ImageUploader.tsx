import React, { useRef } from 'react';
import { usePassStore } from '../../store/passStore';

type ImageType = 'icon' | 'logo' | 'background' | 'strip' | 'thumbnail';

const IMAGE_SPECS = {
  icon: { label: 'Icon', size: '29x29 pt (@3x: 87x87 px)', required: true },
  logo: { label: 'Logo', size: '160x50 pt (@3x: 480x150 px)', required: false },
  background: { label: 'Background', size: '180x220 pt (@3x: 540x660 px)', required: false },
  strip: { label: 'Strip Image', size: '375x123 pt (@3x: 1125x369 px)', required: false },
  thumbnail: { label: 'Thumbnail', size: '90x90 pt (@3x: 270x270 px)', required: false },
};

export const ImageUploader: React.FC = () => {
  const { images, setImage } = usePassStore();
  const fileInputRefs = useRef<Record<ImageType, HTMLInputElement | null>>({
    icon: null,
    logo: null,
    background: null,
    strip: null,
    thumbnail: null,
  });

  const handleFileChange = (type: ImageType, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('Image size must be less than 2MB');
        return;
      }

      setImage(type, file);
    }
  };

  const handleRemove = (type: ImageType) => {
    setImage(type, null);
    if (fileInputRefs.current[type]) {
      fileInputRefs.current[type]!.value = '';
    }
  };

  const handleClick = (type: ImageType) => {
    fileInputRefs.current[type]?.click();
  };

  const getPreviewUrl = (type: ImageType): string | null => {
    const file = images[type];
    return file ? URL.createObjectURL(file) : null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Images</h2>
      <div className="space-y-4">
        {(Object.entries(IMAGE_SPECS) as [ImageType, typeof IMAGE_SPECS[ImageType]][]).map(([type, spec]) => {
          const previewUrl = getPreviewUrl(type);
          const hasImage = !!images[type];

          return (
            <div key={type} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {spec.label}
                    </span>
                    {spec.required && (
                      <span className="text-xs text-red-500">*</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Recommended: {spec.size}
                  </p>
                </div>
                {hasImage && (
                  <button
                    onClick={() => handleRemove(type)}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4">
                {previewUrl && (
                  <div className="w-20 h-20 border border-gray-300 dark:border-gray-600 rounded overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt={spec.label}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}

                <input
                  type="file"
                  ref={(el) => (fileInputRefs.current[type] = el)}
                  onChange={(e) => handleFileChange(type, e)}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  onClick={() => handleClick(type)}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {hasImage ? 'Change' : 'Upload'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-xs text-blue-700 dark:text-blue-300">
        <p className="font-medium mb-1">💡 Image Guidelines:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Use PNG format for best quality</li>
          <li>Icon is required for all passes</li>
          <li>Images should be provided at @3x resolution</li>
          <li>Use transparent backgrounds where appropriate</li>
        </ul>
      </div>
    </div>
  );
};
