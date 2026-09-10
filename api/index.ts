import app from "../src/app";
import connectDatabase from "../src/config/database";
import { Request, Response } from "express";

const handler = async (req: Request, res: Response) => {
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