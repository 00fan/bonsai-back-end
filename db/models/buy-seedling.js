const BigNumber = require('bignumber.js');
const mongoose = require('mongoose');
const { addSeedlingQuantity, addSeedling, findOneSeedling, reduceSeedlingQuantity } = require('./seedling')
const { addMoney, delMoneyById } = require('./money')
var buy_seedlingSchema = new mongoose.Schema({
    seedling: {
        type: String,
        required: [true, 'seedling  required'],
        minlength: 1,
        // unique: true,
        // dropDups: true
    },
    quantity: {
        type: Number,
        required: [true, 'quantity  required'],
        minlength: 1,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'price  required'],
    },
    totalPrices: {
        type: Number,
        required: [true, 'totalPrices  required'],
    },
    unit: {
        type: String,
        required: [true, 'unit  required'],
        minlength: 1,
        default: '棵'
    },
    time: {
        type: Date,
        default: Date.now
    },
    moneyId: {
        type: String,
        required: [true, 'moneyId  required'],
    }
});
var buy_seedlingconstruct = mongoose.model('buy_seedling', buy_seedlingSchema);


const buy_seedling = async function (seedling, quantity, unit, price, totalPrices, time) {//添加，返回promise

    if (!totalPrices) {//计算总价
        let p = new BigNumber(price);
        let q = new BigNumber(quantity);
        totalPrices = p * q;
    }
    let newbuy_seedling;


    //添加原有seedling添加质量，原没有添加品种
    findOneSeedling(seedling).then(res => {
        addSeedlingQuantity(seedling, quantity)
    }).catch(err => {
        addSeedling(seedling, quantity, unit)
    })


    //
    let res;
    if (time) {
         res= await addMoney(totalPrices, 'DE', `购买${quantity}${unit}${seedling}支出`,seedling, time)
    }else{
        res= await addMoney(totalPrices, 'DE', `购买${quantity}${unit}${seedling}支出`,seedling)
    }


    let moneyId = res.id
    time=res.time;
    // if (time) {
    //     newbuy_seedling = new buy_seedlingconstruct({ seedling, quantity, unit, price, totalPrices, time, moneyId });
    // } else {
    //     newbuy_seedling = new buy_seedlingconstruct({ seedling, quantity, unit, price, totalPrices, moneyId });
    // }

    newbuy_seedling = new buy_seedlingconstruct({ seedling, quantity, unit, price, totalPrices, time, moneyId,time });
    return new Promise(function (resolve, reject) {
        newbuy_seedling.save(function (err, product) {
            if (err) {
                reject(err)
            }
            resolve(product);
        })
    })
}



const findBuySeedling = function (seedling, limit = 10) {//查询购买详情
    return new Promise((reslove, reject) => {
        buy_seedlingconstruct.find({ "seedling": { $regex: new RegExp(seedling) } }, {}, { limit: parseInt(limit), sort: { _id: -1 } }, function (err, res) {
            if (err) return reject(err);
            if (res) {
                reslove(res)
            }
        })
    })
}

const findBuySeedlingById = async function (id) {//查询一笔购买
    return new Promise((reslove, reject) => {
        buy_seedlingconstruct.findById(id, function (err, res) {
            if (err) return reject(err);
            if (res) {
                reslove(res)
            }
        })
    })
}


const delBuySeedling = async function (id) {//撤销购买事件
    const res = await findBuySeedlingById(id);

    //减去幼苗质量
    await reduceSeedlingQuantity(res.seedling, res.quantity)

    try {
        await delMoneyById(res.moneyId)
    } catch (error) {
        return Promise.reject('moneyId no exist')
    }

    return new Promise((reslove, reject) => {
        buy_seedlingconstruct.findByIdAndDelete(id, function (err, res) {
            if (err) return reject(err);
            if (res) {
                reslove(res)
            }
        })
    })
}


const updateBuySeedlingById = function (id, newData) {//添加，返回
    return new Promise((reslove, reject) => {
        buy_seedlingconstruct.findByIdAndUpdate(id, newData, (err, data) => {
            if (!err) {
                reslove("修改成功")
            }
            reject('修改失败')
        })
    })
}

module.exports = {
    buy_seedling,
    findBuySeedling,
    delBuySeedling,
    updateBuySeedlingById

}