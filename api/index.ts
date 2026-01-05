import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../apps/backend/src/server';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
