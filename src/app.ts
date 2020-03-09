import createError, { HttpError } from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "morgan";

import customerRouter from "./routes/customer";
import transactionRouter from "./routes/transactions";
import authRouter from "./routes/auth";
const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//Define Routes
app.use("/api", customerRouter);
app.use("/api", authRouter);
app.use("/api", transactionRouter);

// catch 404 and forward to error handler
app.use(function(_req, _res, next: NextFunction) {
	next(createError(404));
});

// error handler
app.use(function(
	err: HttpError,
	req: Request,
	res: Response,
	_next: NextFunction
) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.json("error");
});

export default app;
