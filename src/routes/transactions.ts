import { Router, Response } from "express";
import { check, validationResult } from "express-validator";
import Customer from "../models/customer";
import Transaction from "../models/transaction";
import auth, { IReq } from "../middlewares/auth";
const transactionRouter = Router();

transactionRouter.patch(
	"/transaction",
	[
		check("amount", "Enter Amount of type Number"),
		check("type", "Enter Transaction Type of String : Credit||Debit")
	],
	auth,
	async (req: IReq, res: Response) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });

			return;
		}

		const { type, amount } = req.body;
		// console.log(balance);

		try {
			const userID = req.user;
			const getUser = await Customer.findOne({ _id: userID });

			if (!getUser) {
				res.status(404).json({ err: "user not found" });

				return;
			}

			if (type === "Credit") {
				let updateAmount = getUser.balance + amount;

				await Customer.updateOne(
					{ _id: userID },
					{
						balance: updateAmount
					}
				);

				let transaction = new Transaction({
					customer: userID,
					amount: amount,
					balance: updateAmount,
					transactionType: type
				});

				await transaction.save();

				res.status(200).json({ TransactionDetail: transaction });

				return;
			}

			if (type === "Debit") {
				if (getUser.balance < amount) {
					res.status(404).json({ message: "InSufficient Funds" });
					
					return;
				}

				let updateAmount = getUser.balance - amount;
				
				await Customer.updateOne(
					{ user: userID },
					{
						balance: updateAmount
					}
				);

				let debitTransaction = new Transaction({
					customer: userID,
					amount: amount,
					balance: updateAmount,
					transactionType: type
				});

				await debitTransaction.save();

				res.status(200).json({message :"Amount Debited :"+amount,TransactionDetail:debitTransaction});
				
				return;
			}

			res.status(400).json({ message: "Invalid type" });
			return;

			// Customer.findOneAndUpdate({})
		} catch (err) {
			console.error(err.message);
			res.status(500).json({ Message: "Server Error" });
		}
	}
);

transactionRouter.get(
	"/transactions",
	auth,
	async (req: IReq, res: Response) => {
		const user_id = req.user!.id;
		try {
			const getUserTransactions = await Transaction.findOne({
				customer: user_id
			});
			res.status(200).json({ Customer_Transactions: getUserTransactions });
		} catch (err) {
			console.error(err.message);
			res.status(400).json({ Message: "Server Error" });
		}
	}
);

transactionRouter.post(
	"/transfer",
	[
		check("amount", "Enter Transfer Amount "),
		check("type", "Enter Transaction Type of String : Credit||Debit"),
		check("accountNo", "Enter Account Number ")
	],
	auth,
	async (req: IReq, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
			return;
		}
		const { accountNo, amount, type } = req.body;

		try {
			const user_id = req.user!.id;
			const getUser = await Customer.findOne({ _id: user_id });
			const getReceiver = await Customer.findOne({ _id: accountNo });
			if (!getReceiver) {
				res.status(404).json({ err: "Receiver Not Found" });
			}
			if (!getUser) {
				res.status(404).json({ err: "user not found" });

				return;
			}
			if (type === "Credit") {
				if (getUser.balance < amount) {
					res.status(404).json({ err: "Insufficient Fund" });
					return;
				}
				let updateAmount = getUser.balance - amount;
				let creditAmount = getReceiver!.balance + amount;

				// console.log(parseFloat(balance));
				await Customer.updateOne(
					{ _id: user_id },
					{
						balance: updateAmount
					}
				);
				await Customer.updateOne(
					{ _id: accountNo },
					{
						balance: creditAmount
					}
				);
				let senderTransaction = new Transaction({
					customer: user_id,
					amount: amount,
					balance: updateAmount,
					transactionType: type
				});
				let receiverTransaction = new Transaction({
					customer: accountNo,
					amount: amount,
					balance: creditAmount,
					transactionType: type
				});

				await senderTransaction.save();
				await receiverTransaction.save();
				res.status(200).json({ TransactionDetail: senderTransaction });
				res.status(200).json({ TransactionDetail: senderTransaction });
				return;
			}
		} catch (err) {
			console.error(err.message);
			res.status(500).json({ Message: "Server Error" });
		}
	}
);

export default transactionRouter;
