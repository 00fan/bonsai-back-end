const mongoose = require('mongoose');
var cultivationSchema = new mongoose.Schema({
  cultivation: {
    type: String,
    required: [true, 'cultivation  required'],
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
    default: '盆'
  }
});
var cultivationconstruct = mongoose.model('cultivation', cultivationSchema);


const addCultivation = function (cultivation, quantity, unit) {//添加，返回promise
  return new Promise(function (resolve, reject) {
    let newUser = new cultivationconstruct({ cultivation, quantity, unit });
    newUser.save(function (err, product) {
      if (err) {
        reject(err)
      }
      resolve(product);
    })
  })
}

const updateCultivation = function (cultivation, quantity, unit) {//添加，返回
  return new Promise((reslove, reject) => {
    cultivationconstruct.updateOne({ cultivation }, { $set: { quantity, unit } }, (err, data) => {
      if (!err) {
        reslove("修改成功")
      }
      reject('修改失败')
    })
  })
}

const findOneCultivation = function (cultivation) {
  return new Promise((reslove, reject) => {
    cultivationconstruct.findOne({ cultivation }, function (err, res) {
      if (err) reject(err); 
      if(!res) reject(res);
      reslove(res)
    })
  })

}

const addCultivationQuantity = function (cultivation, num) {//输入cultivation,增加的质量
  findOneCultivation(cultivation).then(res => {
    return updateCultivation(cultivation, Number(res.quantity) + Number(num))
  })

}
const reduceCultivationQuantity =  function (cultivation, num) {//输入cultivation,减去的质量
  return findOneCultivation(cultivation).then(res => {
    if(res.quantity>=Number(num)){
      return updateCultivation(cultivation, Number(res.quantity) - Number(num))
    }else{
      return Promise.reject('under quantity')
    }
    
  })

}


const findCultivation=function(cultivation,limit=10){//查询
  return new Promise((reslove, reject) => {
    cultivationconstruct.find({"cultivation":{$regex:new RegExp(cultivation)}}, {},{limit:parseInt(limit)},function (err, res) {
      if (err) return reject(err);
      if (res) {
        reslove(res)
      }
    })
  })
}

module.exports = {
  addCultivation,
  addCultivationQuantity,
  findCultivation,
  findOneCultivation,
  reduceCultivationQuantity
}