var express = require('express');
var router = express.Router();

const {addseedling,findSeedling}=require('../db/models/seedling.js')

//添加新品种
// router.post('/add', function(req, res, next) {
//   //判断req.body
//   // ......


//   const { seedling, quantity,unit }=req.body;
//   addseedling( seedling, quantity,unit ).then(reso=>{
//       res.send(reso)
//   }).catch(err=>{
//       res.send(err)
//   })

// });

//查询种子
router.post('/find', function(req, res, next) {
  //判断req.body
  // ......


  const { seedling, limit }=req.body;
  findSeedling( seedling, limit).then(reso=>{
      res.send(reso)
  }).catch(err=>{
      res.send(err)
  })

});

module.exports = router;
