const express = require('express'), router = express.Router();
const createError = require('http-errors');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({message:'respond with a resource'});
});
router.get('/login', (req, res, next)=>{
  try {
    next(createError('x'))
  }
  catch (e) {
    next(createError(e))
  }
})
export { router };