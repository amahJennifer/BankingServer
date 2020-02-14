import express from "express";

const router = express.Router();

//@route  Post api/customers
//@desc   Register a Customer
//access public


router.post('/', (_req, res) => {
    res.json({message:"Register Customer "})
});


//@route  get api/allcustomers
//@desc   
//access private

router.get("/", (_req, res) => {
	res.json({ message: "Get all Customers " });
});

 //@route  get api/customers/:accountNo
//@desc   
//access private

router.get("/", (_req, res) => {
	res.json({ message: "Get Customers by Account number  " });
});


export default router;

 