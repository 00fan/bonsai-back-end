const { reduceFGQuantity, addFGQuantity } = require('./finished-goods');
const { addSold, findOneSold, addSoldQuantity, reduceSoldQuantity } = require('./sold')
const {addMoney,delMoneyById } =require('./money')
const mongoose = require('mongoose');
var sellSchema = new mongoose.Schema({
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
        default: 1
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
        default: '盆'
    },
    time: {
        type: Date,
        default: Date.now
    },
    moneyId:{
        type:String,
        required: [true, 'moneyId  required'],
    }
});
var sellconstruct = mongoose.model('sell', sellSchema);


const sell = async function (seedling, quantity, price, totalPrices, unit = '盆', time) {//完成种植，返回promise
    if (!totalPrices) {//计算总价
        totalPrices = price * quantity;
    }
    

    //减少finished-goods质量，
    try {

        await reduceFGQuantity(seedling, quantity);
    } catch (error) {
        return Promise.reject('finish-goods under quantity')
    }


    //添加sold
    findOneSold(seedling).then(res => {
        addSoldQuantity(seedling, quantity)
    }).catch(err => {
        addSold(seedling, quantity)
    })

    
    let res;
    if (time) {
         res= await addMoney(totalPrices, 'IN', `售卖${quantity}盆${seedling}收入`,seedling, time)
    }else{
        res= await addMoney(totalPrices, 'IN', `售卖${quantity}盆${seedling}收入`,seedling)
    }


    let moneyId = res.id
    time=res.time;

    let newsell = new sellconstruct({ seedling, quantity, price, totalPrices, unit, time,moneyId,time });
    // if (time) {
    //     newsell = new sellconstruct({ seedling, quantity, price, totalPrices, unit, time,moneyId });
    // } else {
    //     newsell = new sellconstruct({ seedling, quantity, price, totalPrices, unit,moneyId });
    // }
    //
    return new Promise((resolve, reject) => {
        newsell.save(function (err, product) {
            if (err) {
                reject(err)
            }
            resolve(product);
        })
    })
}

const findSell = function (seedling, limit = 10) {//查询
    return new Promise((reslove, reject) => {
        sellconstruct.find({ "seedling": { $regex: new RegExp(seedling) } }, {}, { limit: parseInt(limit),sort: { _id: -1 } }, function (err, res) {
            if (err) return reject(err);
            if (res) {
                reslove(res)
            }
        })
    })
}

const findSellById = async function (id) {//查询一笔sell
    return new Promise((reslove, reject) => {
        sellconstruct.findById(id, function (err, res) {
            if (err) return reject(err);
            if (res) {
                reslove(res)
            }
            reject('id no exist')
        })
    })
}

const delSell = async function (id) {//撤销一笔sell
    let res;
    try {
        res = await findSellById(id)
    } catch (error) {
        return Promise.reject('id no exist')
    }
    //添加FG质量
    await addFGQuantity(res.seedling, res.quantity);
    //撤掉sold中质量
    try {
        await reduceSoldQuantity(res.seedling, res.quantity);
    } catch (error) {
        return Promise.reject('sold under quantity')
    }

    try {
         await delMoneyById(res.moneyId)
    } catch (error) {
        return Promise.reject('money id no exist')
    }

    
    

    return new Promise((reslove, reject) => {
        sellconstruct.findByIdAndDelete(id, function (err, res) {
            if (err) return reject(err);
            if (res) {
                reslove(res)
            }
        })
    })
}




module.exports = {
    sell,
    findSell,
    delSell
}