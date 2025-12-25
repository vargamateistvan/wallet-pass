import { Router } from 'express';
import { PassController } from '../controllers/passController';

const router = Router();

// Create a new pass
router.post('/', PassController.createPass);

// List all passes
router.get('/', PassController.listPasses);

// Get pass by serial number
router.get('/:serialNumber', PassController.getPass);

// Download pass
router.get('/download/:serialNumber', PassController.downloadPass);

// Generate QR code
router.post('/qrcode', PassController.generateQRCode);

// Delete pass
router.delete('/:serialNumber', PassController.deletePass);

export default router;
