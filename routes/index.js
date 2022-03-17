var express = require('express');
var router = express.Router();
const { findOneUser } = require('./../db/models/user')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', function (req, res, next) {
  let {username,password}=req.body;
  findOneUser(username).then(reso=>{
    if(reso.password==password){
      return res.json({
        'status':1,
        data:'登录成功'
      })
    }else{
      return res.json({
        'status':0,
        data:'密码错误'
      })
    }
  }).catch(err=>{

    return res.json({
      'status':-1,
      err:'用户不存在'
    })
  })
});



module.exports = router;
