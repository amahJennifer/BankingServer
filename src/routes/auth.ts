import express from "express";

const router = express.Router();

//@route  Get /api/auth
//@desc   Register a Customer
//access Private

router.get("/", (_req, res) => {
	res.json({ message: "Get Logged in User" });
});


//@route  Get /api/auth
//@desc   Auth User and get token
//access Public

router.post("/", (_req, res) => {
	res.json({ message: "Login User " });
});

export default router;
