import { Application, Request, Response } from "express";

export function config(app:Application) {
    app.use(function(err:any, req:Request, res:Response, next:(args?:any)=>any) {
      const verboseStackTrace = req.app.get('env') === 'development';
      if ((req as any).headersSent) return next(err);
      var type = req && req.headers && (req.headers.accept || req.headers["content-type"] || '').split(/\s*;\s*/).pop();
      res.status(err.status || 500);
      switch (type) {
        case 'application/json':
          applicationJson(res, err, verboseStackTrace);
          break;
        default: 
          // set locals, only providing error in development
          res.locals.message = err.message;
          res.locals.error = verboseStackTrace ? err : {};
          res.locals.title = `${err.message} (${err.status})`;
        // render the error page
          res.render('error');
      }
    });
}
function applicationJson(res:Response, err:any, verboseStackTrace:boolean){
  var stackArray = err.stack.split(/\n\s*/g);
  res.json(
    Object.assign(
      {
        status:err.status,
        message:err.message
      },
      verboseStackTrace
        ? {
          message: stackArray[0],
          stack: stackArray.slice(1)
        }
        :{}
      )
    );
}