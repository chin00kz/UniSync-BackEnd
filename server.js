const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 1. MIDDLEWARE: දත්ත වල ප්‍රමාණය පාලනය කිරීමට (Base64 images සඳහා 2MB limit එක)
app.use(express.json({ limit: '2mb' })); 
app.use(express.urlencoded({ limit: '2mb', extended: true }));
app.use(cors());

// 2. DATABASE CONNECTION: ඔයාගේ වැඩ කරපු Password එකම මෙතන තියෙනවා
const mongoURI = 'mongodb+srv://udula:udula123456@unisync.ya6qtgg.mongodb.net/tutoring_marketplace?retryWrites=true&w=majority&appName=UniSync';

mongoose.connect(mongoURI)
  .then(() => console.log("✅ UniSync Backend Connected to ATLAS!"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err.message));

// 3. DATA MODEL: දත්ත ගබඩා වන ආකාරය (Schema)
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

// 4. API ROUTES: Frontend එකට දත්ත ලබාදෙන සහ ලබාගන්නා ක්‍රම
// GET: සියලුම Sessions ලබා ගැනීමට
app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

// POST: අලුත් ප්‍රශ්නයක් ඇතුළත් කිරීමට
app.post('/api/sessions', async (req, res) => {
  try {
    const newSession = new Session(req.body);
    await newSession.save();
    res.status(201).json(newSession);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH: ප්‍රශ්නයකට පිළිතුරක් හෝ Status එකක් අලුත් කිරීමට
app.patch('/api/sessions/:id', async (req, res) => {
  try {
    const updated = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// 5. SERVER START
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));