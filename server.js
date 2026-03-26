require('dotenv').config(); // 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 2. MIDDLEWARE
// Base64 images  2MB limit and CORS setup 
app.use(express.json({ limit: '2mb' })); 
app.use(express.urlencoded({ limit: '2mb', extended: true }));
app.use(cors());

// 3. DATABASE CONNECTION
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ Error: MONGO_URI is not defined in .env file");
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => console.log("✅ UniSync Backend Connected to ATLAS via ENV!"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err.message));

// 4. DATA MODEL
const sessionSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  questionText: { type: String, required: true },
  questionImage: { type: String, default: "" }, 
  replyText: { type: String, default: "" },
  replyImage: { type: String, default: "" },
  status: { type: String, default: 'Not Started' },
  createdAt: { type: Date, default: Date.now }
});

const Session = mongoose.model('Session', sessionSchema);

// 5. API ROUTES

// GET
app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

// POST
app.post('/api/sessions', async (req, res) => {
  try {
    const newSession = new Session(req.body);
    await newSession.save();
    res.status(201).json(newSession);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH
app.patch('/api/sessions/:id', async (req, res) => {
  try {
    const updated = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Session not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// 6. SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));