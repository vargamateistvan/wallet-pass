import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { PassData, PassType, BarcodeFormat, PassField } from '@wallet-pass/shared';
import { PassValidator } from '@wallet-pass/shared';

interface PassStore {
  // State
  passData: Partial<PassData>;
  passType: PassType | null;
  images: Record<string, File | null>;
  isDirty: boolean;
  
  // Actions
  setPassType: (type: PassType) => void;
  updatePassData: (data: Partial<PassData>) => void;
  setImage: (key: string, file: File | null) => void;
  addField: (section: string, field: PassField) => void;
  removeField: (section: string, index: number) => void;
  updateField: (section: string, index: number, field: Partial<PassField>) => void;
  setBarcode: (format: BarcodeFormat, message: string, altText?: string) => void;
  resetPass: () => void;
  validatePass: () => { valid: boolean; errors: string[] };
  generateSerialNumber: () => void;
}

const initialPassData: Partial<PassData> = {
  formatVersion: 1,
  description: '',
  organizationName: '',
  serialNumber: '',
  passTypeIdentifier: import.meta.env.VITE_PASS_TYPE_IDENTIFIER || '',
  teamIdentifier: import.meta.env.VITE_TEAM_IDENTIFIER || '',
  backgroundColor: '#ffffff',
  foregroundColor: '#000000',
  labelColor: '#666666',
};

export const usePassStore = create<PassStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      passData: initialPassData,
      passType: null,
      images: {},
      isDirty: false,

      // Set pass type
      setPassType: (type: PassType) => {
        set((state) => ({
          passType: type,
          passData: {
            ...state.passData,
            [type]: {
              headerFields: [],
              primaryFields: [],
              secondaryFields: [],
              auxiliaryFields: [],
              backFields: [],
            },
          },
          isDirty: true,
        }));
      },

      // Update pass data
      updatePassData: (data: Partial<PassData>) => {
        set((state) => ({
          passData: { ...state.passData, ...data },
          isDirty: true,
        }));
      },

      // Set image
      setImage: (key: string, file: File | null) => {
        set((state) => ({
          images: { ...state.images, [key]: file },
          isDirty: true,
        }));
      },

      // Add field to a section
      addField: (section: string, field: PassField) => {
        set((state) => {
          const { passType, passData } = state;
          if (!passType) return state;

          const currentStructure = passData[passType] || {};
          const currentFields = currentStructure[section as keyof typeof currentStructure] || [];

          return {
            passData: {
              ...passData,
              [passType]: {
                ...currentStructure,
                [section]: [...currentFields, field],
              },
            },
            isDirty: true,
          };
        });
      },

      // Remove field from a section
      removeField: (section: string, index: number) => {
        set((state) => {
          const { passType, passData } = state;
          if (!passType) return state;

          const currentStructure = passData[passType] || {};
          const currentFields = currentStructure[section as keyof typeof currentStructure] || [];

          return {
            passData: {
              ...passData,
              [passType]: {
                ...currentStructure,
                [section]: currentFields.filter((_, i) => i !== index),
              },
            },
            isDirty: true,
          };
        });
      },

      // Update field in a section
      updateField: (section: string, index: number, field: Partial<PassField>) => {
        set((state) => {
          const { passType, passData } = state;
          if (!passType) return state;

          const currentStructure = passData[passType] || {};
          const currentFields = currentStructure[section as keyof typeof currentStructure] || [];

          return {
            passData: {
              ...passData,
              [passType]: {
                ...currentStructure,
                [section]: currentFields.map((f, i) => (i === index ? { ...f, ...field } : f)),
              },
            },
            isDirty: true,
          };
        });
      },

      // Set barcode
      setBarcode: (format: BarcodeFormat, message: string, altText?: string) => {
        set((state) => ({
          passData: {
            ...state.passData,
            barcodes: [
              {
                format,
                message,
                messageEncoding: 'iso-8859-1',
                altText,
              },
            ],
          },
          isDirty: true,
        }));
      },

      // Reset pass
      resetPass: () => {
        set({
          passData: initialPassData,
          passType: null,
          images: {},
          isDirty: false,
        });
      },

      // Validate pass
      validatePass: () => {
        const { passData } = get();
        return PassValidator.validatePassData(passData);
      },

      // Generate serial number
      generateSerialNumber: () => {
        set((state) => ({
          passData: {
            ...state.passData,
            serialNumber: PassValidator.generateSerialNumber(),
          },
          isDirty: true,
        }));
      },
    }),
    { name: 'pass-store' }
  )
);
