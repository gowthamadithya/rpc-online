const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
require('dotenv').config();

// New express instance
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection
const sequelize = new Sequelize(process.env.PG_DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  }
});

// Game Model
const Game = sequelize.define('Game', {
  player1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  player2: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  score1: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  score2: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  winner: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'Games' // specify the table name explicitly
});


// Sync database
sequelize.sync()
  .then(() => console.log('PostgreSQL connected successfully'))
  .catch(err => console.error('PostgreSQL connection error:', err));

// Routes
app.post('/api/games', async (req, res) => {
  try {
    const game = await Game.create(req.body);
    res.status(201).json(game);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/games', async (req, res) => {
  console.log('GET /api/games called');
  try {
    const games = await Game.findAll({ order: [['date', 'DESC']] });
    res.json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
