import jwt from "jsonwebtoken";
import { Request, Response} from "express";
import User from "../models/customer";

export interface IReq extends Request {
	user?: {
		id: string;
	};
}
export default function async(req: IReq, res: Response) {
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
    req.user = decoded.id;
  
      async (req: IReq, res: Response) => {
        const user = await User.findById(req.user).select("-password -_id -__v");
        
	    return res.json(user);
      }
    
      	
				//res.status(500).send("Server Error");
			//return;
		
	} catch{
		res.status(401).json({
			Message: "Token is not Valid"
		});
	}
}
