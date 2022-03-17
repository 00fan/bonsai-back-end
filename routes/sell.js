var express = require('express');
var router = express.Router();
const { sell, findSell,delSell } = require('./../db/models/sell')
//售出
router.post('/add', function (req, res, next) {
  //判断req.body
  // ......
  const { seedling, quantity, price, totalPrices, unit, time } = req.body;
  sell(seedling, quantity, price, totalPrices, unit, time).then(reso => {
    res.send(reso)
  }).catch(err => {

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
  findSell(seedling, limit).then(reso => {
    res.send(reso)
  }).catch(err => {
    res.send(err)
  })

})

router.post('/del', function (req, res, next) {
  let { id} = req.body
  delSell(id).then(reso => {
    res.send(reso)
  }).catch(err => {
    return res.json({
      'status':-1,
      err
    })  
  })

})

module.exports = router;
