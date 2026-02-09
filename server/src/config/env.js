const { cleanEnv, str, port } = require('envalid');
const dotenv = require('dotenv');

dotenv.config();

module.exports = cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
    PORT: port({ default: 5000 }),
    MONGO_URI: str(),
    JWT_SECRET: str(),
    JWT_EXPIRES_IN: str({ default: '15m' }),
    FRONTEND_URL: str({ default: 'http://localhost:5173' }),
});
