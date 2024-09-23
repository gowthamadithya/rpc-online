const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

//new express instance
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Game Schema
const GameSchema = new mongoose.Schema({
  players: {
    player1: { type: String, required: true },
    player2: { type: String, required: true },
  },
  scores: {
    player1: { type: Number, default: 0 },
    player2: { type: Number, default: 0 },
  },
  winner: { type: String, default: null },
  date: { type: Date, default: Date.now },
});

// Game Model
const Game = mongoose.model('Game', GameSchema);

// Routes
app.post('/api/games', async (req, res) => {
  try {
    const game = new Game(req.body);
    await game.save();
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/games', async (req, res) => {
  console.log('GET /api/games called');
  try {
    const games = await Game.find().sort({ date: -1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



