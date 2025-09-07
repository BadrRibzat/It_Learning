// /swaggerConfig.ts
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IT-Learning API',
      version: '1.0.0',
      description: 'API for IT-Learning backend',
      contact: {
        name: 'IT-Learning Support',
        email: 'support@itlearning.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://your-production-domain.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      responses: {
        Unauthorized: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string',
                    example: 'Invalid credentials'
                  }
                }
              }
            }
          }
        }
      },
      schemas: {
        UserProgress: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            stacks: { type: 'object' },
            lastActivityAt: { type: 'string', format: 'date-time' }
          }
        },
        StackProgress: {
          type: 'object',
          properties: {
            totalCards: { type: 'number' },
            passed: { type: 'array', items: { type: 'string' } },
            failed: { type: 'array', items: { type: 'string' } },
            lastSubmitted: { type: 'object' },
            reviewQueue: {
              type: 'object',
              properties: {
                failedUntil: { type: 'object' },
                manualRetryAllowed: { type: 'boolean' }
              }
            }
          }
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.ts', './controllers/*.ts'],
};

const specs = swaggerJsdoc(options);
export default specs;
