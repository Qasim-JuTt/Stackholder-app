import express from "express"
import connectDB from "./config/dbConnect.js"
import cors from "cors"

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

const PORT = process.env.PORT || 6000;

app.listen(PORT,() => console.log(` Server running on port ${PORT}`));