import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route';
import authRouter from './routes/auth.route';
dotenv.config();
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Connected successfully to MongoDB");
}).catch((error) => {
  console.log(error);
});

const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log("Server is running");
})

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);