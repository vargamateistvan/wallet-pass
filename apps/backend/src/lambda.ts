import serverlessExpress from '@vendia/serverless-express';
import app from './app.js';

// Create serverless Express handler
export const handler = serverlessExpress({ app });
