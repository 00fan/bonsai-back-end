const mongoose = require('mongoose');
var soldSchema = new mongoose.Schema({
  sold: {
    type: String,
    required: [true, 'sold  required'],
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
var soldconstruct = mongoose.model('sold', soldSchema);

async function addSold(sold, quantity) {//添加，返回promise
  let newSold = new soldconstruct({ sold, quantity });

  // //处理时间
  // if (PD) {
  //   newSold = new soldconstruct({ sold, quantity, PD });
  // } else {
  //   newSold = new soldconstruct({ sold, quantity });
  // }

    return new Promise(function (resolve, reject) {
      newSold.save(function (err, product) {
        if (err) {
          reject(err)
        }
        resolve(product);
      })
    })
}

const uPDateSold = function (sold, quantity, unit) {//添加，返回
  return new Promise((reslove, reject) => {
    soldconstruct.updateOne({ sold }, { $set: { quantity, unit } }, (err, data) => {
      if (!err) {
        reslove("修改成功")
      }
      reject('修改失败')
    })
  })
}

const findOneSold = function (sold) {
  return new Promise((reslove, reject) => {
    soldconstruct.findOne({ sold }, function (err, res) {
      if (err) reject(err);
      if (!res) reject(res);
      reslove(res)
    })
  })

}

const addSoldQuantity = function (sold, num) {//
  findOneSold(sold).then(res => {
    return uPDateSold(sold, Number(res.quantity) + Number(num))
  })

}

const findSold = function (sold, limit = 10) {//查询
  return new Promise((reslove, reject) => {
    soldconstruct.find({ "sold": { $regex: new RegExp(sold) } }, {}, { limit: parseInt(limit) }, function (err, res) {
      if (err) return reject(err);
      if (res) {
        reslove(res)
      }
    })
  })
}



const reduceSoldQuantity =  function (sold, num) {//输入sold,减去sold的质量
  return findOneSold(sold).then(res => {
    console.log(sold,num)
    console.log(res[0])
    console.log(res.quantity>=Number(num))
    if(res.quantity>=Number(num)){
      console.log('------------')
      return uPDateSold(sold, Number(res.quantity) - Number(num))
    }else{
      return Promise.reject('sold under quantity')
    }
    
  })

}

module.exports = {
  addSold,
  findOneSold,
  addSoldQuantity,
  findSold,
  reduceSoldQuantity
}