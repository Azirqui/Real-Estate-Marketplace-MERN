import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route';
dotenv.config();
mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("Connected successfully to MongoDB");
}).catch((error) => {
  console.log(error);
});

const app = express();

app.listen(3000, () => {
  console.log("Server is running");
})

app.use('/api/user', userRouter);