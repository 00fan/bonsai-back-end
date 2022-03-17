const  { reduceSeedlingQuantity,addSeedlingQuantity } = require('./seedling')
const { addCultivation, addCultivationQuantity, findOneCultivation,reduceCultivationQuantity }=require('./cultivation');
const mongoose = require('mongoose');
var cultivateSchema = new mongoose.Schema({
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
var cultivateconstruct = mongoose.model('cultivate', cultivateSchema);


const cultivate = async function (seedling, quantity, output, unit, time) {//消耗种子进行种植，返回promise



    let newcultivate;
    if (time) {
        newcultivate = new cultivateconstruct({ seedling, quantity, output, unit, time });
    } else {
        newcultivate = new cultivateconstruct({ seedling, quantity, output, unit });
    }

    //减少seedlig质量，
    try {
        await reduceSeedlingQuantity(seedling, quantity);
    } catch (error) {
        return Promise.reject('seedling under quantity')
    }


    //有就添加质量，否则添加cultivation
    findOneCultivation(seedling).then(res => {
        addCultivationQuantity(seedling, output)
    }).catch(err => {
        addCultivation(seedling, output, unit)
    })

    //
    return new Promise((resolve, reject)=>{
        newcultivate.save(function (err, product) {
            if (err) {
                reject(err)
            }
            resolve(product);
        })
    })
}

const findCultivateById = async function (id) {//查询一笔种植
    return new Promise((reslove, reject) => {
        cultivateconstruct.findById(id, function (err, res) {
            if (err) return reject(err);
            if (res) {
                reslove(res)
            }
        })
    })
}

const delCultivate=async function(id){//撤销一笔种植
   let res
   //添加seedling质量
    try {
        res= await findCultivateById(id)
    } catch (error) {
        return  Promise.reject('id no exist')
    }


    await addSeedlingQuantity(res.seedling,res.quantity);

   //撤掉cultivation种植中质量
   await reduceCultivationQuantity(res.seedling,res.output);

   return new Promise((reslove, reject) => {
    cultivateconstruct.findByIdAndDelete(id, function (err, res) {
        if (err) return reject(err);
        if (res) {
            reslove(res)
        }
    })
})
}

const findCultivate = function (seedling, limit = 10) {//查询购买详情
    return new Promise((reslove, reject) => {
        cultivateconstruct.find({ "seedling": { $regex: new RegExp(seedling) } }, {}, { limit: parseInt(limit), sort: { _id: -1 } }, function (err, res) {
            if (err) return reject(err);
            if (res) {
                reslove(res)
            }
        })
    })
}

module.exports = {
    cultivate,
    delCultivate,
    findCultivate
}