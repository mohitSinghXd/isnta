// =============================================
// Instagram Login Clone - Backend Server
// =============================================
// SETUP:
//   1. npm init -y
//   2. npm install express mongoose cors bcryptjs dotenv
//   3. node server.js
// =============================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors({origin :"*"}));
app.use(express.json());
app.use(express.static('.')); // serves your HTML file

// --- MongoDB Connection ---
const MONGO_URI = 'mongodb+srv://mohitsinghbuilds_db_user:l1UGfWS4HQhlHNF7@notesproject.rvbxvds.mongodb.net/instagram_clone?retryWrites=true&w=majority';
// ⚠️  Replace YOUR_NEW_PASSWORD with your new password after resetting it

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// --- User Schema ---
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// --- REGISTER Route (Sign Up) ---
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ error: 'Username and password required' });

    const existing = await User.findOne({ username });
    if (existing)
      return res.status(400).json({ error: 'Username already exists' });

 
    const user = new User({ username, password });
    await user.save();

    res.json({ success: true, message: 'Account created!' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- LOGIN Route ---
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user)
      return res.status(401).json({ error: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: 'Invalid username or password' });

    res.json({ success: true, message: 'Login successful!' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Start Server ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
