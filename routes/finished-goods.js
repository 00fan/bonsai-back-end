var express = require('express');
var router = express.Router();

const { findGoods } = require('../db/models/finished-goods')


//查询成品
router.post('/find', function (req, res, next) {
    //判断req.body
    // ......


    const { goods, limit } = req.body;
    findGoods(goods, limit).then(reso => {
        res.send(reso)
    }).catch(err => {
        res.send(err)
    })

});
module.exports = router;