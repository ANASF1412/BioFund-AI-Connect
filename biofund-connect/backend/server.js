const app = require('./app');
const connectDB = require('./config/db');
const { PORT } = require('./config/env');

// Connect Database
connectDB();

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
