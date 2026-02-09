const app = require('./src/app');
const env = require('./src/config/env');
const connectDB = require('./src/config/db');
const bootstrapAdmin = require('./src/utils/bootstrap');

// Connect to Database
connectDB().then(() => {
    bootstrapAdmin();
});

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
