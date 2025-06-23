import express from "express"
import connectDB from "./config/dbConnect.js"
import projectRoutes from './routes/projectRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import stakeholderRoutes from './routes/stakeholderRoutes.js';
import authRoutes from './routes/authRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import adminUserRoutes from './routes/adminUserRoutes.js';



import cors from "cors"

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/projectfinance', financeRoutes);
app.use('/api/stakeholders', stakeholderRoutes);
app.use('/api/auth', authRoutes)
app.use('/api/notifications', notificationRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/users', adminUserRoutes);




connectDB();

const PORT = process.env.PORT || 6000;

app.listen(PORT,() => console.log(` Server running on port ${PORT}`));