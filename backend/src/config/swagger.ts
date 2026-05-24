import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RetroMuse API',
      version: '1.0.0',
      description: 'API REST para la plataforma artística retro-social RetroMuse',
    },
    servers: [
      { url: 'http://localhost:4000/api', description: 'Desarrollo local' },
      { url: 'https://retromuseapp-api.onrender.com/api', description: 'Producción' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
