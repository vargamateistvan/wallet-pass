// Pass Type Identifiers
export enum PassType {
  BOARDING_PASS = 'boardingPass',
  COUPON = 'coupon',
  EVENT_TICKET = 'eventTicket',
  GENERIC = 'generic',
  STORE_CARD = 'storeCard',
}

// Barcode Formats
export enum BarcodeFormat {
  QR = 'PKBarcodeFormatQR',
  PDF417 = 'PKBarcodeFormatPDF417',
  AZTEC = 'PKBarcodeFormatAztec',
  CODE128 = 'PKBarcodeFormatCode128',
}

// Text Alignment
export enum TextAlignment {
  LEFT = 'PKTextAlignmentLeft',
  CENTER = 'PKTextAlignmentCenter',
  RIGHT = 'PKTextAlignmentRight',
  NATURAL = 'PKTextAlignmentNatural',
}

// Date/Time Style
export enum DateStyle {
  NONE = 'PKDateStyleNone',
  SHORT = 'PKDateStyleShort',
  MEDIUM = 'PKDateStyleMedium',
  LONG = 'PKDateStyleLong',
  FULL = 'PKDateStyleFull',
}

// Pass Field Interface
export interface PassField {
  key: string;
  label?: string;
  value: string | number | Date;
  changeMessage?: string;
  textAlignment?: TextAlignment;
  dateStyle?: DateStyle;
  timeStyle?: DateStyle;
  isRelative?: boolean;
  currencyCode?: string;
  attributedValue?: string;
}

// Barcode Interface
export interface Barcode {
  format: BarcodeFormat;
  message: string;
  messageEncoding: string;
  altText?: string;
}

// Location Interface
export interface Location {
  latitude: number;
  longitude: number;
  altitude?: number;
  relevantText?: string;
}

// NFC Interface
export interface NFC {
  message: string;
  encryptionPublicKey?: string;
}

// Pass Structure Interface
export interface PassStructure {
  headerFields?: PassField[];
  primaryFields?: PassField[];
  secondaryFields?: PassField[];
  auxiliaryFields?: PassField[];
  backFields?: PassField[];
}

// Complete Pass Data Interface
export interface PassData {
  // Standard Keys
  description: string;
  formatVersion: number;
  organizationName: string;
  passTypeIdentifier: string;
  serialNumber: string;
  teamIdentifier: string;

  // Associated App Keys
  appLaunchURL?: string;
  associatedStoreIdentifiers?: number[];

  // Companion App Keys
  userInfo?: Record<string, any>;

  // Expiration Keys
  expirationDate?: string;
  voided?: boolean;

  // Relevance Keys
  beacons?: any[];
  locations?: Location[];
  maxDistance?: number;
  relevantDate?: string;

  // Style Keys
  boardingPass?: PassStructure;
  coupon?: PassStructure;
  eventTicket?: PassStructure;
  generic?: PassStructure;
  storeCard?: PassStructure;

  // Visual Appearance Keys
  backgroundColor?: string;
  foregroundColor?: string;
  labelColor?: string;
  logoText?: string;
  suppressStripShine?: boolean;
  groupingIdentifier?: string;

  // Barcode Keys
  barcodes?: Barcode[];
  barcode?: Barcode;

  // NFC Keys
  nfc?: NFC;

  // Web Service Keys
  authenticationToken?: string;
  webServiceURL?: string;
}

// API Interfaces
export interface CreatePassRequest {
  passType: PassType;
  passData: Partial<PassData>;
  images?: {
    icon?: string;
    logo?: string;
    background?: string;
    footer?: string;
    strip?: string;
    thumbnail?: string;
  };
}

export interface CreatePassResponse {
  success: boolean;
  passId?: string;
  serialNumber?: string;
  downloadUrl?: string;
  error?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Template Interface
export interface PassTemplate {
  id: string;
  name: string;
  description: string;
  passType: PassType;
  previewImage?: string;
  configuration: Partial<PassData>;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}
