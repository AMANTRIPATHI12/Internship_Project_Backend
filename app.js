require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const moodRoutes = require('./routes/moodRoutes');
const healCoinRoutes = require('./routes/healCoinRoutes');
const authRoutes = require('./routes/authRoutes');
const journalRoutes = require('./routes/journalRoutes');
const connectionRoutes = require('./routes/connectionRoutes');
const financeMissionRoutes = require('./routes/financeMissionRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/mood', moodRoutes);
app.use('/api/healcoins', healCoinRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/connection', connectionRoutes);
app.use('/api/finance', financeMissionRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0' , () => console.log(`Server running on port ${PORT}`));
