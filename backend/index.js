import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors'; // ✅ Changed from require to import for consistency

dotenv.config();

const app = express(); // ✅ Moved app declaration before using it

// ✅ CORS setup with your Render frontend URL
app.use(cors({
  origin: 'https://multiuser-blog-app.onrender.com',
  credentials: true,
}));

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDb is connected');
  })
  .catch((err) => {
    console.log(err);
  });

// ✅ Serve static frontend files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "/frontend/dist" )));

// ✅ API routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

// ✅ Fallback for SPA routing
app.get('*', (_, res) => {
  res.sendFile(path.resolve(__dirname, "frontend" ,  "dist" , "index.html"));
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
