export function config(app) {
    app.use(function(err, req, res, next) {
      const verboseStackTrace = req.app.get('env') === 'development';
      if (req.headersSent) return next(err);

      // render the error page
      res.status(err.status || 500);
      switch (req.headers.accept) {
        case 'application/json':
          applicationJson(res, err, verboseStackTrace);
          break;
        default: 
          // set locals, only providing error in development
          res.locals.message = err.message;
          res.locals.error = verboseStackTrace ? err : {};
          res.locals.title = `${err.message} (${err.status})`
          res.render('error');
      }
    });
}
function applicationJson(res, err, verboseStackTrace){
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