var express = require('express');
var router = express.Router();
const {findMoney,findAllByType}=require('./../db/models/money')

//查询
router.post('/find', function(req, res, next) {
  //判断req.body
  // ......


  const { count,type,obj, limit }=req.body;
  findMoney( count,type, obj,limit).then(reso=>{
      res.send(reso)
  }).catch(err=>{
      res.send(err)
  })

});


router.post('/findAllByType', function(req, res, next) {
  //判断req.body
  // ......


  const { type }=req.body;
  findAllByType(type).then(reso=>{
      res.send(reso)
  }).catch(err=>{
      res.send(err)
  })

});


module.exports = router;
