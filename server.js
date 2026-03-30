require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize Express
const app = express();

// 1. DATABASE CONNECTION
connectDB();

// 2. MIDDLEWARE
app.use(express.json({ limit: '5mb' })); 
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(cors());

// 3. ROLE-BASED ROUTES (Clean & Organized)
app.use('/api/admin', require('./routes/admin'));
app.use('/api/tutor', require('./routes/tutor'));
app.use('/api/student', require('./routes/student'));

// 4. COMMON ROUTES (Auth, etc.)
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/audit-logs', require('./routes/auditLogRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/settings', require('./routes/systemSettingRoutes'));

// 5. SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 UniSync Backend running on port ${PORT}`));