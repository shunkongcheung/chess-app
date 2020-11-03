module.exports = {
  components: {},
  info: {
    title: "Chess App",
    version: "1.0.0",
    description: "Using Brain.js to train a Chess engine",
  },
  host: "localhost:3000",
  basePath: "/api",
  securityDefinitions: {
    apiKeyAuth: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description: "Bearer <JWT-TOKEN>",
    },
  },
  security: [{ apiKeyAuth: [] }],
  apis: ["src/**/*.ts"],
};
