const { reduceCultivationQuantity, addCultivationQuantity } = require('./cultivation');
const { addGoods, findOneGoods, addFGQuantity, reduceFGQuantity } = require('./finished-goods')
const mongoose = require('mongoose');
var cultivatedSchema = new mongoose.Schema({
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
    output: {
        type: Number,
        required: [true, 'quantity  required'],
        minlength: 1,
        default: 1
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
    }
});
var cultivatedconstruct = mongoose.model('cultivated', cultivatedSchema);


const cultivated = async function (seedling, quantity, output, unit, time) {//完成种植，返回promise



    let newcultivated;
    if (time) {
        newcultivated = new cultivatedconstruct({ seedling, quantity, output, unit, time });
    } else {
        newcultivated = new cultivatedconstruct({ seedling, quantity, output, unit });
    }

    //减少cultivation质量，
    try {
        await reduceCultivationQuantity(seedling, quantity);
    } catch (error) {
        return Promise.reject('cultivation under quantity')
    }


    //添加finished-goods
    findOneGoods(seedling).then(res => {
        addFGQuantity(seedling, output)
    }).catch(err => {
        addGoods(seedling, output, unit)
    })
    
    //
    return new Promise((resolve, reject) => {
        newcultivated.save(function (err, product) {
            if (err) {
                reject(err)
            }
            resolve(product);
        })
    })
}



const findCultivatedById = async function (id) {//查询一笔种植结束
    return new Promise((reslove, reject) => {
        cultivatedconstruct.findById(id, function (err, res) {
            if (err) {  return reject(err) };
            if (res) {
                return reslove(res)
            }
            reject('id no exist')
        })
    })
}

const delCultivated = async function (id) {//撤销一笔种植结束
    let res;
    //添加seedling质量
    try {
        res = await findCultivatedById(id)
    } catch (error) {
        return Promise.reject('id no exist')
    }
    //添加Cultivation质量
    await addCultivationQuantity(res.seedling, res.quantity);

    //撤掉fg种植中质量
    try {
        await reduceFGQuantity(res.seedling, res.quantity);
    } catch (error) {
        return Promise.reject('finished-goods under quantity')
    }



    return new Promise((reslove, reject) => {
        cultivatedconstruct.findByIdAndDelete(id, function (err, res) {
            if (err) return reject(err);
            if (res) {
                reslove(res)
            }
        })
    })
}





const findCultivated = function (seedling, limit = 10) {//查询栽培详情
    return new Promise((reslove, reject) => {
        cultivatedconstruct.find({ "seedling": { $regex: new RegExp(seedling) } }, {}, { limit: parseInt(limit), sort: { _id: -1 } }, function (err, res) {
            if (err) return reject(err);
            if (res) {
                reslove(res)
            }
        })
    })
}
module.exports = {
    cultivated,
    delCultivated,
    findCultivated
}