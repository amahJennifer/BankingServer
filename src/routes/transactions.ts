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

				const newTransaction = await transaction.save();
				// const userTransactions = await Transaction.find({ customer: req.user });
				res
					.status(200)
					.json({
						// userTransactions: userTransactions,
						user: getUser,
						TransactionDetail: newTransaction
					});

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

				const newDebit = await debitTransaction.save();

				res.status(200).json({
					message: "Amount Debited :" + amount,
					TransactionDetail: newDebit,
					user: getUser
				});

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
		const user_id = req.user;
		try {
		
			const getUserTransactions = await Transaction.find({
				customer: user_id
			});
			if (!getUserTransactions) {
				res.status(404).json({Error:"User not found"})
			}
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
			const user_id = req.user;
			const getUser = await Customer.findOne({ _id: user_id });
			const getReceiver = await Customer.findOne({accountNumber: accountNo });
			if (!getReceiver) {
				res.status(404).json({ err: "Receiver Not Found" });
			}
			if (!getUser) {
				res.status(404).json({ err: "user not found" });

				return;
			}
			if (type === "Transfer") {
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
					{accountNumber: accountNo },
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
					customer:getReceiver?._id,
					amount: amount,
					balance: creditAmount,
					transactionType: type
				});

				await senderTransaction.save();
				await receiverTransaction.save();
				res.status(200).json({userTransactions: senderTransaction,receiverTransaction:receiverTransaction });
				return;
			}
		} catch (err) {
			console.error(err.message);
			res.status(500).json({ Message: "Server Error" });
		}
	}
);

export default transactionRouter;
