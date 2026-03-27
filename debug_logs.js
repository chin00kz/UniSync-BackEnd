const mongoose = require('mongoose');
require('dotenv').config();
const AuditLog = require('./models/AuditLog');
const User = require('./models/User');

async function debugLogs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(30);
    console.log("Recent Logs (last 30):");
    logs.forEach(l => {
        console.log(`[${l.timestamp.toISOString()}] ${l.action}: "${l.details}" | ActorID: ${l.adminId}`);
    });
    
    const students = await User.find({ role: 'student' });
    console.log("\nStudent Users Found:");
    students.forEach(s => {
        console.log(`- ${s.name} (${s.email}) | ID: ${s._id} | Role: ${s.role}`);
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

debugLogs();
