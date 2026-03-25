const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// STRICT 2MB LIMIT for Images
app.use(express.json({ limit: '2mb' })); 
app.use(express.urlencoded({ limit: '2mb', extended: true }));
app.use(cors());

// --- DATABASE CONNECTION ---
const mongoURI = 'mongodb+srv://udula_admin:udula@unisync.ya6qtgg.mongodb.net/tutoring_marketplace?retryWrites=true&w=majority&appName=UniSync';

mongoose.connect(mongoURI)
  .then(() => console.log("✅ UniSync Backend Connected to ATLAS!"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err.message));

// ... (මම කලින් දීපු schemas සහ routes මෙතනට copy කරන්න)
app.listen(5000, () => console.log(`🚀 Server running on http://localhost:5000`));