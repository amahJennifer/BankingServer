import { Router, Response, Request } from "express";
//import { check, validationResult } from "express-validator/check";
import uuidv4 from "uuid/v4";
import Customer from "../models/customer";
import Transaction from "../models/transaction";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth, { IReq } from "../middlewares/auth";
//import sendMail from "../mailer";
const customerRouter = Router();

//@route  get api/allcustomers
//@desc
//access private

customerRouter.post("/register", async (req: Request, res: Response) => {
	const { firstName, lastName, email, password } = req.body;

	try {
		let user = await Customer.findOne({ email });
		if (user) {
			res.status(400).json({ Message: "Customer Already Exists" });
			return;
		}

		const accountNo = uuidv4().split("-")[4];

		const salt = await bcrypt.genSalt(10);
		user = new Customer({
			firstName,
			lastName,
			email,
			password: await bcrypt.hash(password, salt),
			accountNumber: accountNo
		});
		await user.save();

		// const payload = {
		// 	user: {
		// 		id: user._id
		// 	}
		// };
		const token = jwt.sign({ id: user._id }, "ghhfgveftvstvsu");
		return res.header("Authorization","Bearer "+token).status(200).json({user,token:token});

	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
		return
	}
});

customerRouter.get("/customers", async (_req: Request, res: Response) => {
	try {
		const customers = await Customer.find();
		if (customerRouter.length < 1) {
			res.json({ Message: "No Customers" });
		}
		res.status(200).json({
			status: 200,
			data: customers
		});
	} catch (err) {
		res.status(500).send("Server Error");
	}
});

//@route  get api/customers/:accountNo
//@desc
//access private

customerRouter.get("/customerT", auth, async (req: IReq, res) => {
	try {
		const transactions = await Transaction.find({ user: req.user!.id }).sort({
			date: -1
		});

		res.status(200).json({ status: 200, data: transactions });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

export default customerRouter;
