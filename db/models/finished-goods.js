const mongoose = require('mongoose');
var goodsSchema = new mongoose.Schema({
  goods: {
    type: String,
    required: [true, 'goods  required'],
    minlength: 1,
    unique: true,
    dropDups: true
  },
  quantity: {//质量
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
var goodsconstruct = mongoose.model('goods', goodsSchema);

async function addGoods(goods, quantity) {//添加，返回promise
  let newGoods = new goodsconstruct({ goods, quantity });
    return new Promise(function (resolve, reject) {
      newGoods.save(function (err, product) {
        if (err) {
          reject(err)
        }
        resolve(product);
      })
    })
}

const uPDateGoods = function (goods, quantity, unit) {//添加，返回
  return new Promise((reslove, reject) => {
    goodsconstruct.updateOne({ goods }, { $set: { quantity, unit } }, (err, data) => {
      if (!err) {
        reslove("修改成功")
      }
      reject('修改失败')
    })
  })
}

const findOneGoods = function (goods) {
  return new Promise((reslove, reject) => {
    goodsconstruct.findOne({ goods }, function (err, res) {
      if (err) reject(err);
      if (!res) reject(res);
      reslove(res)
    })
  })

}

const addFGQuantity = function (goods, num) {//
  findOneGoods(goods).then(res => {
    return uPDateGoods(goods, Number(res.quantity) + Number(num))
  })

}
const reduceFGQuantity =  function (seedling, num) {//输入finsihed-goods,减去的质量
  return findOneGoods(seedling).then(res => {
    if(res.quantity>=Number(num)){
      return uPDateGoods(seedling, Number(res.quantity) - Number(num))
    }else{
      return Promise.reject('finsihed-goods under quantity')
    }
    
  })

}

const findGoods = function (goods, limit = 10) {//查询
  return new Promise((reslove, reject) => {
    goodsconstruct.find({ "goods": { $regex: new RegExp(goods) } }, {}, { limit: parseInt(limit) }, function (err, res) {
      if (err) return reject(err);
      if (res) {
        reslove(res)
      }
    })
  })
}

module.exports = {
  addGoods,
  findOneGoods,
  addFGQuantity,
  reduceFGQuantity,
  findGoods
}