/**
 * ENV
 */
export default () => ({
  mongodbUrl:
    process.env.NODE_ENV !== 'test'
      ? decodeURIComponent(process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost:27017/handbook')
      : undefined,
  mail: {
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: Number(process.env.SMTP_PORT || 465),
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
    SMTP_SECURE: process.env.SMTP_SECURE !== 'false',
    SMTP_FROM_NAME: process.env.SMTP_FROM_NAME || 'SMTP_FROM_NAME'
  },
  payment: {
    momo: {
      partnerCode: process.env.MOMO_PARTNER_CODE,
      accessKey: process.env.MOMO_ACCESS_KEY,
      secretKey: process.env.MOMO_SECRET_KEY,
      endpoint: process.env.MOMO_ENDPOINT
    },
    zalopay: {
      app_id: process.env.ZALOPAY_APP_ID,
      key1: process.env.ZALOPAY_KEY1,
      key2: process.env.ZALOPAY_KEY2,
      endpoint: process.env.ZALOPAY_ENDPOINT
    },
    payos: {
      clientId: process.env.PAYOS_CLIENT_ID,
      apiKey: process.env.PAYOS_API_KEY,
      checksumKey: process.env.PAYOS_CHECKSUM_KEY
    },
    stripe: {
      apiKey: process.env.STRIPE_API_KEY || 'apiKey',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || 'webhookSecret'
    }
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  },
  discord: {
    webhookId: process.env.DISCORD_WEBHOOK_ID,
    webhookToken: process.env.DISCORD_WEBHOOK_TOKEN
  },
  firebase: {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
  },
  redis:
    process.env.NODE_ENV === 'test'
      ? {
          host: process.env.TEST_REDIS_HOST || 'localhost',
          port: Number(process.env.TEST_REDIS_PORT || 6379),
          username: process.env.TEST_REDIS_USERNAME,
          password: process.env.TEST_REDIS_PASSWORD,
          db: Number(process.env.TEST_REDIS_DB || 0)
        }
      : {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT || 6379),
          username: process.env.REDIS_USERNAME,
          password: process.env.REDIS_PASSWORD,
          db: Number(process.env.REDIS_DB || 0)
        },
  NODE_ENV: process.env.NODE_ENV,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'accessSecret',
  JWT_ACCESS_EXPIRATION: Number(process.env.JWT_ACCESS_EXPIRATION) || 864000, // seconds
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refreshSecret',
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || '90d', // 90 days
  WEB_URL: process.env.WEB_URL || 'https://www.handbook.tech',
  SERVER_URL: process.env.SERVER_URL || 'https://api.handbook.tech'
})

/**
 * REGEX
 */
export const EMAIL_REGEX = /^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i
export const PHONE_REGEX = /^(?:$|^[+]?\d{10,12}$)/
export const URL_REGEX =
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi

export const VN_TIMEZONE = 'Asia/Ho_Chi_Minh'
export const MIN_PRICE = 100_000
export const MAX_PRICE = 10_000_000
