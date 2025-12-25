import { Request, Response } from 'express';
import type { PassTemplate } from '@wallet-pass/shared';

export class TemplateController {
  // Get all templates
  static async listTemplates(req: Request, res: Response): Promise<void> {
    try {
      const { isPublic } = req.query;

      // TODO: Fetch from database
      const templates: PassTemplate[] = [
        {
          id: '1',
          name: 'Coffee Shop Loyalty Card',
          description: 'A simple loyalty card template for coffee shops',
          passType: 'storeCard' as any,
          configuration: {
            organizationName: 'Coffee Shop',
            description: 'Loyalty Card',
            backgroundColor: '#6B4423',
            foregroundColor: '#FFFFFF',
            labelColor: '#D9C8B8',
          },
          isPublic: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Event Ticket',
          description: 'General event ticket template',
          passType: 'eventTicket' as any,
          configuration: {
            organizationName: 'Event Organizer',
            description: 'Event Ticket',
            backgroundColor: '#1E88E5',
            foregroundColor: '#FFFFFF',
            labelColor: '#BBDEFB',
          },
          isPublic: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const filteredTemplates = isPublic === 'true'
        ? templates.filter(t => t.isPublic)
        : templates;

      res.json({
        success: true,
        data: filteredTemplates,
      });
    } catch (error) {
      console.error('Error listing templates:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // Get template by ID
  static async getTemplate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // TODO: Fetch from database
      res.json({
        success: true,
        data: {
          id,
          name: 'Sample Template',
          passType: 'generic',
        },
      });
    } catch (error) {
      console.error('Error getting template:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  // Create new template
  static async createTemplate(req: Request, res: Response): Promise<void> {
    try {
      const templateData = req.body;

      // TODO: Save to database
      res.status(201).json({
        success: true,
        data: {
          id: `template-${Date.now()}`,
          ...templateData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Error creating template:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}
