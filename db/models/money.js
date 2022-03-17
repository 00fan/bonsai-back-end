const mongoose = require('mongoose');
var moneySchema = new mongoose.Schema({
    count: {
        type: Number,
        required: [true, 'money  required'],
        minlength: 1,
    },
    type: {
        type: String,
        enum: ['IN', 'DE', 'PAY'],
        default: 'IN'
    },
    thing: {
        type: String,
        required: [true, 'thing  required'],
        minlength: 1,
    },
    obj: {
        type: String,
        required: [true, 'thing  required'],
        minlength: 1,
    },
    time: {
        type: Date,
        default: Date.now
    }
});
var moneyconstruct = mongoose.model('money', moneySchema);


const  findAllByType= async function (type) {
    return moneyconstruct.aggregate([{
        $match: {
            "type": type,
        }
    },
    {
        $group: {

            _id: type,
            total: {
                "$sum": "$count"
            }

        }
    }]);
}

async function addMoney(count, type, thing, obj, time) {//添加，返回promise

    let newMoney;
    if (time) {
        newMoney = new moneyconstruct({ count, type, thing, obj, time });
    } else {
        newMoney = new moneyconstruct({ count, type, thing, obj });
    }

    return new Promise(function (resolve, reject) {
        newMoney.save(function (err, product) {
            if (err) {
                reject(err)
            }
            resolve(product);
        })
    })
}

const delMoneyById = async function (id) {//撤销一笔流水
    return new Promise((reslove, reject) => {
        moneyconstruct.findByIdAndDelete(id, function (err, res) {
            if (err) return reject(err);
            if (res) {
                reslove(res)
            }
        })
    })
}


const uPDateMoney = function (money, quantity, unit) {//添加，返回
    return new Promise((reslove, reject) => {
        moneyconstruct.updateOne({ money }, { $set: { quantity, unit } }, (err, data) => {
            if (!err) {
                reslove("修改成功")
            }
            reject('修改失败')
        })
    })
}

const findOneMoney = function (money) {
    return new Promise((reslove, reject) => {
        moneyconstruct.findOne({ money }, function (err, res) {
            if (err) reject(err);
            if (!res) reject(res);
            reslove(res)
        })
    })

}

const addMoneyQuantity = function (money, num) {//
    findOneMoney(money).then(res => {
        return uPDateMoney(money, Number(res.quantity) + Number(num))
    })

}

const findMoney = function (count, type, obj, limit = 10) {//查询

    if (!limit) {
        limit = 10;
    }
    let findOption = {}
    if (count) {
        findOption['count'] = count;
    }
    if (type) {
        findOption['type'] = type
    }
    if (obj) {
        findOption['obj'] = obj
    }
    return new Promise((reslove, reject) => {
        moneyconstruct.find(findOption, {}, { limit: parseInt(limit), sort: { time: -1 } }, function (err, res) {
            if (err) return reject(err);
            if (res) {
                reslove(res)
            }
        })
    })
}



const reduceMoneyQuantity = function (money, num) {//输入money,减去money的质量
    return findOneMoney(money).then(res => {
        console.log(money, num)
        console.log(res[0])
        console.log(res.quantity >= Number(num))
        if (res.quantity >= Number(num)) {
            return uPDateMoney(money, Number(res.quantity) - Number(num))
        } else {
            return Promise.reject('money under quantity')
        }

    })

}

module.exports = {
    addMoney,
    findOneMoney,
    addMoneyQuantity,
    findMoney,
    reduceMoneyQuantity,
    delMoneyById,
    findAllByType
}