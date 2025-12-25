import { Router } from 'express';
import { TemplateController } from '../controllers/templateController';

const router = Router();

// List all templates
router.get('/', TemplateController.listTemplates);

// Get template by ID
router.get('/:id', TemplateController.getTemplate);

// Create new template
router.post('/', TemplateController.createTemplate);

export default router;
