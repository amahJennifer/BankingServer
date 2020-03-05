import mongoose from "mongoose"

interface ICustomer extends mongoose.Document {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	balance: number;
	accountNumber: string;
}

const CustomerSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},

	password: {
		type: String,
		required: true
	},
	accountNumber: {
		type: String,
		unique: true
	},
	balance: {
		type: Number,
		default: 0
	},
	date: {
		type: String,
		default: Date.now
	}
});


const Customer = mongoose.model<ICustomer>("Customer", CustomerSchema);

export default Customer;