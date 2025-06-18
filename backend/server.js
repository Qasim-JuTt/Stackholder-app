import express from "express"
import connectDB from "./config/dbConnect.js"
import projectRoutes from './routes/projectRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import stakeholderRoutes from './routes/stakeholderRoutes.js';


import cors from "cors"

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/projectfinance', financeRoutes);
app.use('/api/stakeholders', stakeholderRoutes);



connectDB();

const PORT = process.env.PORT || 6000;

app.listen(PORT,() => console.log(` Server running on port ${PORT}`));