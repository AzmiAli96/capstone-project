import express, { Request, Response } from "express";
import dotenv from "dotenv";
import router from "./routes/routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();

// ------------------ Load .env ------------------
dotenv.config(); // membaca file .env

const PORT = process.env.PORT;
// -----------------------------------------------

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
console.log("Static folder:", path.join(__dirname, '../uploads'));


app.use(cors({
  origin: "http://localhost:3000", // sesuaikan dengan URL Next.js Anda
  credentials: true
}));

// ------------------ Middleware ------------------
app.use(express.json());
// -----------------------------------------------
app.use(cookieParser());
app.use(router);



// ----------- Jalankan Server --------------------
app.listen(PORT, () => {
  console.log(`Express API running on port: ${PORT}`);
});
// -----------------------------------------------
