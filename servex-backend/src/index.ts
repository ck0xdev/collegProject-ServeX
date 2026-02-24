import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, auth } from './firebase';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ServeX API is running securely' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});