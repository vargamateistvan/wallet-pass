import { Request, Response } from 'express';
import { PassValidator } from '@wallet-pass/shared';
import type {
  CreatePassRequest,
  CreatePassResponse,
} from '@wallet-pass/shared';
import QRCode from 'qrcode';
import { PKPass } from 'passkit-generator';
import fs from 'fs';
import path from 'path';

// In-memory storage for demo purposes
const passStorage = new Map<
  string,
  { passData: any; images: any; passType: string }
>();

export class PassController {
  // Create a new pass
  static async createPass(req: Request, res: Response): Promise<void> {
    try {
      const { passType, passData, images }: CreatePassRequest = req.body;

      // Validate pass data
      const validation = PassValidator.validatePassData(passData);
      if (!validation.valid) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          message: validation.errors.join(', '),
        });
        return;
      }

      // Generate serial number if not provided
      if (!passData.serialNumber) {
        passData.serialNumber = PassValidator.generateSerialNumber();
      }

      // Store pass data for download
      passStorage.set(passData.serialNumber, { passData, images, passType });

      const response: CreatePassResponse = {
        success: true,
        passId: `pass-${Date.now()}`,
        serialNumber: passData.serialNumber,
        downloadUrl: `/api/passes/download/${passData.serialNumber}`,
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Error creating pass:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Get pass by serial number
  static async getPass(req: Request, res: Response): Promise<void> {
    try {
      const { serialNumber } = req.params;
      const storedPass = passStorage.get(serialNumber);

      if (storedPass) {
        res.json({
          success: true,
          data: {
            serialNumber,
            status: 'active',
            passData: storedPass.passData,
          },
        });
      } else {
        // TODO: Fetch from database
        res.json({
          success: true,
          data: {
            serialNumber,
            status: 'active',
          },
        });
      }
    } catch (error) {
      console.error('Error getting pass:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // List all passes
  static async listPasses(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query;

      // Convert map to array for demo
      const passes = Array.from(passStorage.values()).map((p) => ({
        serialNumber: p.passData.serialNumber,
        description: p.passData.description,
        passType: p.passType,
      }));

      res.json({
        success: true,
        data: {
          passes: passes,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total: passes.length,
          },
        },
      });
    } catch (error) {
      console.error('Error listing passes:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // Download pass
  static async downloadPass(req: Request, res: Response): Promise<void> {
    try {
      const { serialNumber } = req.params;
      const storedPass = passStorage.get(serialNumber);

      if (!storedPass) {
        res.status(404).json({ success: false, error: 'Pass not found' });
        return;
      }

      const { passData, images, passType } = storedPass;

      // Check for certificates
      const wwdrPath = process.env.APPLE_WWDR_CERTIFICATE_PATH;
      const signerCertPath = process.env.APPLE_SIGNER_CERTIFICATE_PATH;
      const signerKeyPath = process.env.APPLE_SIGNER_KEY_PATH;
      const signerKeyPassphrase = process.env.APPLE_SIGNER_KEY_PASSPHRASE;

      if (!wwdrPath || !signerCertPath || !signerKeyPath) {
        console.warn(
          'Certificates not configured. Returning JSON instead of .pkpass'
        );
        // Fallback to JSON if certs are missing
        res.json(passData);
        return;
      }

      try {
        // Read certificates
        // Ensure paths are absolute or relative to CWD
        const resolvePath = (p: string) =>
          path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);

        const wwdr = fs.readFileSync(resolvePath(wwdrPath));
        const signerCert = fs.readFileSync(resolvePath(signerCertPath));
        const signerKey = fs.readFileSync(resolvePath(signerKeyPath));

        // Create pass
        const pass = new PKPass(
          {}, // Model
          {
            wwdr,
            signerCert,
            signerKey,
            signerKeyPassphrase,
          },
          {}
        );

        // Set pass fields
        pass.type = passType as any;
        pass.primaryFields.push(...(passData.primaryFields || []));
        pass.secondaryFields.push(...(passData.secondaryFields || []));
        pass.auxiliaryFields.push(...(passData.auxiliaryFields || []));
        pass.backFields.push(...(passData.backFields || []));

        // Set standard keys
        if (passData.description) pass.description = passData.description;
        if (passData.organizationName)
          pass.organizationName = passData.organizationName;
        if (passData.passTypeIdentifier)
          pass.passTypeIdentifier = passData.passTypeIdentifier;
        if (passData.teamIdentifier)
          pass.teamIdentifier = passData.teamIdentifier;
        if (passData.serialNumber) pass.serialNumber = passData.serialNumber;

        // Colors
        if (passData.backgroundColor)
          pass.backgroundColor = passData.backgroundColor;
        if (passData.foregroundColor)
          pass.foregroundColor = passData.foregroundColor;
        if (passData.labelColor) pass.labelColor = passData.labelColor;

        // Barcode
        if (passData.barcode) {
          pass.barcodes = [
            {
              format: passData.barcode.format,
              message: passData.barcode.message,
              messageEncoding: passData.barcode.messageEncoding || 'iso-8859-1',
              altText: passData.barcode.altText,
            },
          ];
        }

        // Images
        if (images) {
          const addImage = (name: string, base64: string) => {
            if (!base64) return;
            const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            pass.addBuffer(name, buffer);
          };

          if (images.icon) addImage('icon.png', images.icon);
          if (images.logo) addImage('logo.png', images.logo);
          if (images.strip) addImage('strip.png', images.strip);
          if (images.thumbnail) addImage('thumbnail.png', images.thumbnail);
          if (images.background) addImage('background.png', images.background);
          if (images.footer) addImage('footer.png', images.footer);
        }

        // Generate .pkpass
        const buffer = await pass.getAsBuffer();

        res.setHeader('Content-Type', 'application/vnd.apple.pkpass');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="${serialNumber}.pkpass"`
        );
        res.send(buffer);
      } catch (err) {
        console.error('Error generating PKPass:', err);
        res
          .status(500)
          .json({
            success: false,
            error: 'Failed to generate pass bundle',
            details: (err as Error).message,
          });
      }
    } catch (error) {
      console.error('Error downloading pass:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // Delete pass
  static async deletePass(req: Request, res: Response): Promise<void> {
    try {
      const { serialNumber: _serialNumber } = req.params;

      // TODO: Delete from database and S3
      res.json({
        success: true,
        message: 'Pass deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting pass:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // Generate QR code image
  static async generateQRCode(req: Request, res: Response): Promise<void> {
    try {
      const { data, format = 'png', size = 300 } = req.body;

      if (!data) {
        res.status(400).json({
          success: false,
          error: 'Data is required',
        });
        return;
      }

      const qrSize = Math.min(Math.max(100, Number(size)), 1000);

      if (format === 'svg') {
        // Generate SVG
        const svgString = await QRCode.toString(data, {
          type: 'svg',
          width: qrSize,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });

        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(svgString);
      } else {
        // Generate PNG
        const buffer = await QRCode.toBuffer(data, {
          width: qrSize,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'M',
        });

        res.setHeader('Content-Type', 'image/png');
        res.send(buffer);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate QR code',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
