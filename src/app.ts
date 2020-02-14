import createError, {HttpError} from 'http-errors'
import express, {Request, Response, NextFunction} from 'express'
import cookieParser from "cookie-parser";
import logger from "morgan";

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
 
app.get('/', (_req, res :Response) => res.json({message:"Welcome"}));
// catch 404 and forward to error handler
app.use(function(_req, _res, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: HttpError, req: Request, res: Response, _next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
