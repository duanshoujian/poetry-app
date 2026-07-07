export default () => ({
  port: parseInt(process.env.PORT ?? '', 10) || 3000,
  poetryApi: {
    baseUrl: process.env.POETRY_API_URL || 'http://localhost:1279',
  },
});
