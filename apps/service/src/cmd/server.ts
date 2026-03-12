import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { apiRouter } from "../internal/api";

const app = express();
const port = process.env.PORT || 3000;

// Security and utility middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// Body parser middleware
app.use(express.json());

// Main API routes
app.use("/api", apiRouter);

// Start server
app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
