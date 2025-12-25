import { PassData, PassField } from '../types/pass.types.js';
import { FIELD_VALIDATION } from '../constants/passConstants.js';

export class PassValidator {
  static validatePassData(passData: Partial<PassData>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields
    if (!passData.description || passData.description.trim().length === 0) {
      errors.push('Description is required');
    } else if (passData.description.length > FIELD_VALIDATION.DESCRIPTION.maxLength) {
      errors.push(`Description must not exceed ${FIELD_VALIDATION.DESCRIPTION.maxLength} characters`);
    }

    if (!passData.organizationName || passData.organizationName.trim().length === 0) {
      errors.push('Organization name is required');
    } else if (passData.organizationName.length > FIELD_VALIDATION.ORGANIZATION_NAME.maxLength) {
      errors.push(`Organization name must not exceed ${FIELD_VALIDATION.ORGANIZATION_NAME.maxLength} characters`);
    }

    if (!passData.serialNumber || passData.serialNumber.trim().length === 0) {
      errors.push('Serial number is required');
    } else if (passData.serialNumber.length > FIELD_VALIDATION.SERIAL_NUMBER.maxLength) {
      errors.push(`Serial number must not exceed ${FIELD_VALIDATION.SERIAL_NUMBER.maxLength} characters`);
    }

    if (!passData.passTypeIdentifier || passData.passTypeIdentifier.trim().length === 0) {
      errors.push('Pass type identifier is required');
    }

    if (!passData.teamIdentifier || passData.teamIdentifier.trim().length === 0) {
      errors.push('Team identifier is required');
    }

    // Color validation
    if (passData.backgroundColor && !this.isValidColor(passData.backgroundColor)) {
      errors.push('Invalid background color format');
    }

    if (passData.foregroundColor && !this.isValidColor(passData.foregroundColor)) {
      errors.push('Invalid foreground color format');
    }

    if (passData.labelColor && !this.isValidColor(passData.labelColor)) {
      errors.push('Invalid label color format');
    }

    // Barcode validation
    if (passData.barcodes && passData.barcodes.length > 0) {
      passData.barcodes.forEach((barcode, index) => {
        if (!barcode.message || barcode.message.trim().length === 0) {
          errors.push(`Barcode ${index + 1}: Message is required`);
        }
        if (barcode.message && barcode.message.length > FIELD_VALIDATION.BARCODE_MESSAGE.maxLength) {
          errors.push(`Barcode ${index + 1}: Message too long`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  static isValidColor(color: string): boolean {
    // Validate hex color format (#RRGGBB or rgb(r,g,b))
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const rgbRegex = /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/;
    return hexRegex.test(color) || rgbRegex.test(color);
  }

  static validateField(field: PassField): { valid: boolean; error?: string } {
    if (!field.key || field.key.trim().length === 0) {
      return { valid: false, error: 'Field key is required' };
    }

    if (field.value === undefined || field.value === null) {
      return { valid: false, error: 'Field value is required' };
    }

    return { valid: true };
  }

  static generateSerialNumber(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `PASS-${timestamp}-${random}`.toUpperCase();
  }
}
