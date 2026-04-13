import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';



// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import houseRoutes from './routes/houses';
import questRoutes from './routes/quests';
import spellRoutes from './routes/spells';
import statsRoutes from './routes/stats';
import leaderboardRoutes from './routes/leaderboard';
import owlRoutes from './routes/owl';

// Import middleware
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL ,
  credentials: true
}));
app.use(express.json());

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/houses', houseRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/spells', spellRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/owl', owlRoutes);

const frontendPath = path.resolve(__dirname, "../../frontend/dist");
console.log("Serving frontend from:", frontendPath);
app.use(express.static(frontendPath));


mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// app.get('/', (req: Request, res: Response) => res.send('Hello from backend'));

// Error handling middleware


console.log("Frontend Path:", frontendPath);

app.all("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.use(errorHandler);
const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));