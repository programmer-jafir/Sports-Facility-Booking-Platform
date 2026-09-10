import app from "../src/app";
import connectDatabase from "../src/config/database";
import { Request, Response } from "express";

const allowedOrigins = new Set([
	"https://assaginment-5.vercel.app",
	"http://localhost:5173",
]);

const handler = async (req: Request, res: Response) => {
	const origin = req.headers.origin;

	if (origin && allowedOrigins.has(origin)) {
		res.setHeader("Access-Control-Allow-Origin", origin);
		res.setHeader("Access-Control-Allow-Credentials", "true");
		res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
		res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
	}

	if (req.method === "OPTIONS") {
		return res.status(204).end();
	}

	try {
		await connectDatabase();
		return app(req, res);
	} catch (error) {
		console.error("Database connection failed", error);
		return res.status(500).json({
			success: false,
			message: "Database connection failed",
		});
	}
};

export default handler;