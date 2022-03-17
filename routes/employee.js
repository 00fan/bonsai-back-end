var express = require('express');
var router = express.Router();

const { addEmployee, findEmployee, updateEmployeeById, employeePay, delEmployeePayById, findAllEmployee } = require('./../db/models/employee ')


router.post('/add', function (req, res, next) {
  // ......
  const { name, gender, phone, pay, address, entryTime } = req.body;
  addEmployee(name, gender, phone, pay, address, entryTime).then(reso => {
    res.send(reso)
  }).catch(err => {
    return res.json({
      'status': -1,
      err
    })
  })

});


router.post('/find', function (req, res, next) {
  let { Info, limit } = req.body
  if (!limit) {
    limit = 10
  }
  findEmployee(Info, limit).then(reso => {
    res.send(reso)
  }).catch(err => {
    return res.json({
      'status': -1,
      err
    })
  })

})

router.post('/del', function (req, res, next) {
  let { id } = req.body
  delEmployeePayById(id).then(reso => {
    res.send(reso)
  }).catch(err => {
    return res.json({
      'status': -1,
      err
    })
  })

})

router.post('/update', function (req, res, next) {
  let { id, newData } = req.body;
  updateEmployeeById(id, newData).then(reso => {
    res.send(reso)
  }).catch(err => {
    return res.json({
      'status': -1,
      err
    })
  })

})


router.post('/paydel', function (req, res, next) {
  let { id } = req.body;
  delEmployeePayById(id).then(reso => {
    res.send(reso)
  }).catch(err => {
    return res.json({
      'status': -1,
      err
    })
  })

})


router.post('/pay', function (req, res, next) {
  let { name, count, time } = req.body;
  employeePay(name, count, time).then(reso => {
    res.send(reso)
  }).catch(err => {
    return res.json({
      'status': -1,
      err
    })
  })

})



router.post('/findAllEmployee', function (req, res, next) {
  //判断req.body
  // ......
  findAllEmployee().then(reso => {
    res.send(reso)
  }).catch(err => {
    return res.json({
      'status': -1,
      err
    })
  })

});


module.exports = router;
