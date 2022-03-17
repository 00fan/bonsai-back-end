var express = require('express');
var router = express.Router();

const { cultivated, delCultivated,findCultivated } = require('../db/models/cultivated')


router.post('/find', function (req, res, next) {
  //判断req.body
  const { seedling, limit } = req.body;
  if (!limit) {
    limit = 10
  }
 
  findCultivated(seedling, limit).then(reso => {
    res.send(reso)
  }).catch(err => {
    res.send(err)
  })

});

//栽培完成
router.post('/end', function (req, res, next) {
  //判断req.body

  const { seedling, quantity, output, unit, time } = req.body;
  cultivated(seedling, quantity, output, unit, time).then(reso => {
    res.send(reso)
  }).catch(err => {
    return res.json({
      'status':-1,
      err
    })
  })

});

//撤销栽培完成
router.post('/del', function (req, res, next) {
  //判断req.body

  const { id } = req.body;
  delCultivated(id).then(reso => {
    res.send(reso)
  }).catch(err => {
    ressend(err)
  })

});
module.exports = router;
