import mongoose from "mongoose";

interface ITransaction extends mongoose.Document {
	customer: string;
	amount: string;
	balance: string;
	transactionType: string;
	date: Date;
}

const TransactionSchema = new mongoose.Schema({
	customer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "customer"
	},
	amount: {
		type: Number,
		default: 0
	},
	
	balance: {
		type: Number,
		default: 0
	},

	transactionType: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

const Transaction = mongoose.model<ITransaction>(
	"Transaction",
	TransactionSchema
);

export default Transaction;
