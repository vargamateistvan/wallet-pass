// Pass Constants
export const PASS_CONSTANTS = {
  // Image Dimensions (in pixels @1x)
  IMAGES: {
    ICON: { width: 29, height: 29 },
    ICON_2X: { width: 58, height: 58 },
    ICON_3X: { width: 87, height: 87 },
    LOGO: { width: 160, height: 50 },
    LOGO_2X: { width: 320, height: 100 },
    LOGO_3X: { width: 480, height: 150 },
    BACKGROUND: { width: 180, height: 220 },
    BACKGROUND_2X: { width: 360, height: 440 },
    BACKGROUND_3X: { width: 540, height: 660 },
    FOOTER: { width: 286, height: 15 },
    FOOTER_2X: { width: 572, height: 30 },
    FOOTER_3X: { width: 858, height: 45 },
    STRIP: { width: 375, height: 123 },
    STRIP_2X: { width: 750, height: 246 },
    STRIP_3X: { width: 1125, height: 369 },
    THUMBNAIL: { width: 90, height: 90 },
    THUMBNAIL_2X: { width: 180, height: 180 },
    THUMBNAIL_3X: { width: 270, height: 270 },
  },

  // Format Version
  FORMAT_VERSION: 1,

  // File Size Limits
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_PASS_SIZE: 512 * 1024, // 512KB

  // Barcode Message Encoding
  DEFAULT_ENCODING: 'iso-8859-1',

  // Default Colors (in hex)
  DEFAULT_COLORS: {
    background: '#ffffff',
    foreground: '#000000',
    label: '#666666',
  },
};

// Pass Type Display Names
export const PASS_TYPE_NAMES: Record<string, string> = {
  boardingPass: 'Boarding Pass',
  coupon: 'Coupon',
  eventTicket: 'Event Ticket',
  generic: 'Generic',
  storeCard: 'Store Card',
};

// Barcode Format Display Names
export const BARCODE_FORMAT_NAMES: Record<string, string> = {
  PKBarcodeFormatQR: 'QR Code',
  PKBarcodeFormatPDF417: 'PDF417',
  PKBarcodeFormatAztec: 'Aztec',
  PKBarcodeFormatCode128: 'Code 128',
};

// Field Validation Rules
export const FIELD_VALIDATION = {
  SERIAL_NUMBER: {
    minLength: 1,
    maxLength: 128,
  },
  ORGANIZATION_NAME: {
    minLength: 1,
    maxLength: 256,
  },
  DESCRIPTION: {
    minLength: 1,
    maxLength: 256,
  },
  LOGO_TEXT: {
    maxLength: 256,
  },
  BARCODE_MESSAGE: {
    maxLength: 1024,
  },
};
