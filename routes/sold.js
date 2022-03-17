var express = require('express');
var router = express.Router();
const {findSold}=require('./../db/models/sold')
//查询已售出
router.post('/find', function(req, res, next) {
  //判断req.body
  // ......


  const { seedling, limit }=req.body;
  findSold( seedling, limit).then(reso=>{
      res.send(reso)
  }).catch(err=>{
      res.send(err)
  })

});

module.exports = router;
