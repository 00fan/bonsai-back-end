var express = require('express');
var router = express.Router();

const {findCultivation}=require('../db/models/cultivation')

//栽培
router.post('/find', function(req, res, next) {//查找栽培
  // ......

  const { seedling,limit }=req.body;
  console.log(seedling,limit)
  findCultivation(seedling,limit).then(reso=>{
      res.send(reso)
  }).catch(err=>{
      res.send(err)
  })

});

module.exports = router;
