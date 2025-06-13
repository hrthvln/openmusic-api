const config = {
      app: {
        host: process.env.HOST,
        port: process.env.PORT,
      },
      rabbitMq: {
        server: process.env.RABBITMQ_SERVER,
      },
      jwt: {
        accessTokenKey: process.env.ACCESS_TOKEN_KEY,
        refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
      },
      redis: {
        host: process.env.REDIS_SERVER,
      },
      aws: {
        bucketName: process.env.AWS_BUCKET_NAME,
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      smtp: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
      },
    };

    module.exports = config;