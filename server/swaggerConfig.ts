// server/swaggerConfig.ts
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
        url: 'http://localhost:8080',
        description: 'Development server',
      },
      // Add production server if needed
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.ts', './controllers/*.ts'], // Update paths if needed
};

const specs = swaggerJsdoc(options);
export default specs;
