const mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'username  required'],
    minlength: 1,
    unique: true,
    dropDups: true
  },
  password: {
    type: String,
    required: [true, 'password  required'],
    minlength: 1,
    default: 0
  },
});
var userconstruct = mongoose.model('user', userSchema);


const addUser = function (username,password) {//添加，返回promise
  return new Promise(function (resolve, reject) {
    let newUser = new userconstruct({ username, password });
    newUser.save(function (err, product) {
      if (err) {
        reject(err)
      }
      resolve(product);
    })
  })
}

const updateUser = function (user, quantity, unit) {//添加，返回
  return new Promise((reslove, reject) => {
    userconstruct.updateOne({ user }, { $set: { quantity, unit } }, (err, data) => {
      if (!err) {
        reslove("修改成功")
      }
      reject('修改失败')
    })
  })
}

const findOneUser = function (username) {
  return new Promise((reslove, reject) => {
    userconstruct.findOne({ username }, function (err, res) {
      if (err) reject(err); 
      if(!res) reject(res);
      reslove(res)
    })
  })

}


const findUser=function(user,limit=10){//查询种子
  return new Promise((reslove, reject) => {
    userconstruct.find({"user":{$regex:new RegExp(user)}}, {},{limit:parseInt(limit)},function (err, res) {
      if (err) return reject(err);
      if (res) {
        reslove(res)
      }
    })
  })
}

module.exports = {
  addUser,
  findUser,
  findOneUser,
}