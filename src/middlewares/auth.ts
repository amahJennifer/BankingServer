import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface IReq extends Request {
	user?: {
		id: string;
	};
}

export default function(req: IReq, res: Response, next: NextFunction) {
	const token = req.header("Authorization")?.split(" ")[1];

	console.log(token);

	if (!token) {
		res.status(401).json({
			Message: "No token"
		});
		return;
	}

	try {
		const decoded: any = jwt.verify(token, "ghhfgveftvstvsu");
		console.log("decoded: ", decoded);
		req.user = decoded.user.id;

		next();
	} catch {
		res.status(401).json({
			Message: "Token is not Valid"
		});
	}
}
