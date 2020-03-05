import { Router, Response, Request } from "express";
import { check, validationResult } from "express-validator/check";
import Customer from "../models/customer";
import Transaction from "../models/transaction"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const authRouter = Router();
import auth, { IReq } from "../middlewares/auth";
import User from "../models/customer";
//@route  post /api/auth
//@desc   Authenticate User and get Token
//access Private

authRouter.post(
	"/login",
	[
		check("email", "Email is required ").isEmail(),
		check("password", "Password is required").exists()
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
			return;
		}

		const { email, password } = req.body;
		try {
			let user = await Customer.findOne({ email });
			if (!user) {
				return res.status(400).json({ message: "invalid Credentials " });
			}
			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ message: "invalid Password " });
			}
			console.log(user);
			const payload = {
				user: {
					id: user._id
				}
			};

			jwt.sign(payload, "ghhfgveftvstvsu",async (err, token) => {
				if (err) throw err;
				let userTransactions = await Transaction.find({customer:user?._id});
			//	console.log(userTransactions)
				res
					.header("Authorization", "Bearer " + token)
					.status(200)
					.json({ user, token,userTransactions});
				return;
			});
			return;
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
			return;
		}
	}
);

//@route  Get /api/auth
//@desc   Auth User and get token
//access Public

authRouter.get("/auth", auth, async (req: IReq, res: Response) => {
	try {
		console.log("userId: ", req.user);
		const user = await User.findById(req.user).select("-password -_id -__v");
		console.log(user);
		const userTransactions=await Transaction.find({customer:req.user})
		return res.status(200).json({user,userTransactions});
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
		return;
	}
});

export default authRouter;
