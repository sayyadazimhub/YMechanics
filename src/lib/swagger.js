import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My Next.js API",
      version: "1.0.0",
      description: "API documentation for Next.js App Router",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/app/api/**/*.js"], // API routes
};

export const swaggerSpec = swaggerJSDoc(options);
