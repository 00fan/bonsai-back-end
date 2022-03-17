const mongoose = require('mongoose');
var seedlingSchema = new mongoose.Schema({
  seedling: {
    type: String,
    required: [true, 'seedling  required'],
    minlength: 1,
    unique: true,
    dropDups: true
  },
  quantity: {
    type: Number,
    required: [true, 'quantity  required'],
    minlength: 1,
    default: 0
  },
  unit: {
    type: String,
    required: [true, 'unit  required'],
    minlength: 1,
    default: '棵'
  }
});
var seedlingconstruct = mongoose.model('seedling', seedlingSchema);


const addSeedling = function (seedling, quantity, unit) {//添加，返回promise
  return new Promise(function (resolve, reject) {
    let newUser = new seedlingconstruct({ seedling, quantity, unit });
    newUser.save(function (err, product) {
      if (err) {
        reject(err)
      }
      resolve(product);
    })
  })
}

const updateSeedling = function (seedling, quantity, unit) {//添加，返回
  return new Promise((reslove, reject) => {
    seedlingconstruct.updateOne({ seedling }, { $set: { quantity, unit } }, (err, data) => {
      if (!err) {
        reslove("修改成功")
      }
      reject('修改失败')
    })
  })
}

const findOneSeedling = function (seedling) {
  return new Promise((reslove, reject) => {
    seedlingconstruct.findOne({ seedling }, function (err, res) {
      if (err) reject(err); 
      if(!res) reject(res);
      reslove(res)
    })
  })

}

const addSeedlingQuantity = function (seedling, num) {//输入seedling,增加的质量
  findOneSeedling(seedling).then(res => {
    return updateSeedling(seedling, Number(res.quantity) + Number(num))
  })

}
const reduceSeedlingQuantity =  function (seedling, num) {//输入seedling,减去的质量
  return findOneSeedling(seedling).then(res => {
    if(res.quantity>=Number(num)){
      return updateSeedling(seedling, Number(res.quantity) - Number(num))
    }else{
      return Promise.reject('under quantity')
    }
    
  })

}


const findSeedling=function(seedling,limit=10){//查询种子
  return new Promise((reslove, reject) => {
    seedlingconstruct.find({"seedling":{$regex:new RegExp(seedling)}}, {},{limit:parseInt(limit)},function (err, res) {
      if (err) return reject(err);
      if (res) {
        reslove(res)
      }
    })
  })
}

module.exports = {
  addSeedling,
  addSeedlingQuantity,
  findSeedling,
  findOneSeedling,
  reduceSeedlingQuantity
}