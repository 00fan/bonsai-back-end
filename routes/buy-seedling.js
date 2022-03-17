var express = require('express');
var router = express.Router();

const { buy_seedling,findBuySeedling,delBuySeedling,updateBuySeedlingById } = require('../db/models/buy-seedling')

//购买品种
router.post('/buy', function (req, res, next) {
  //判断req.body
  // ......

  const { seedling, quantity, unit, price, totalPrices, time } = req.body;
  buy_seedling(seedling, quantity, unit, price, totalPrices, time).then(reso => {
    res.send(reso)
  }).catch(err => {
    res.send(err)
  })

});



//查询购买品种详情
router.post('/find', function (req, res, next) {
  let { seedling, limit=10 } = req.body
  if(!limit){
    limit=10
  }
  findBuySeedling(seedling, limit).then(reso => {
    res.send(reso)
  }).catch(err => {
    res.send(err)
  })

})

router.post('/del', function (req, res, next) {
  let { id } = req.body
  delBuySeedling(id).then(reso => {
    res.send(reso)
  }).catch(err => {
    return res.json({
      'status':-1,
      err
    })
  })

})

router.post('/update', function (req, res, next) {
  let { id,newData } = req.body;
  updateBuySeedlingById(id,newData).then(reso => {
    res.send(reso)
  }).catch(err => {
    res.send(err)
  })

})

module.exports = router;
