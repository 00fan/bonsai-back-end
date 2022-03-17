var express = require('express');
var router = express.Router();

const {cultivate,delCultivate,findCultivate}=require('../db/models/cultivate')


//种植
router.post('/start', function(req, res, next) {
  //判断req.body

  const { seedling, quantity, output, unit, time }=req.body;
  console.log(seedling, quantity, output, unit, time )
  cultivate( seedling, quantity, output, unit, time).then(reso=>{
      res.send(reso)
  }).catch(err=>{
      // res.send(err)
      return res.json({
        'status':-1,
        err
      })
  })

});

router.post('/find', function (req, res, next) {
  let { seedling, limit=10 } = req.body
  if(!limit){
    limit=10
  }
  findCultivate(seedling, limit).then(reso => {
    res.send(reso)
  }).catch(err => {
    res.send(err)
  })

})

//撤销种植事件
router.post('/del', function(req, res, next) {


  const { id }=req.body;
  delCultivate( id).then(reso=>{
      res.send(reso)
  }).catch(err=>{
      return res.json({
        'status':-1,
        err
      })
  })

});


module.exports = router;
