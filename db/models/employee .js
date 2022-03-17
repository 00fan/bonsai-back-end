const mongoose = require('mongoose');
const { addMoney, delMoneyById } = require('./money')
var employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name  required'],
        minlength: 1,
        unique: true,
        dropDups: true
    },
    gender: {
        type: String,
        enum: ['BOY', 'GIRL'],
        default: 'BOY'
    },
    phone: {
        type: String,
        required: [true, 'phone  required'],
        minlength: 1,
    },
    pay: {
        type: Number,
        required: [true, 'pay  required'],
        minlength: 1,
        default: 2500
    },
    address: {
        type: String,
        required: [true, 'address  required'],
        minlength: 1,
    },
    entryTime: {
        type: Date,
        default: Date.now
    },
    resignationTime: {
        type: Date,
        default: null
    },
});
var employeeconstruct = mongoose.model('employee', employeeSchema);




async function addEmployee(name, gender, phone, pay, address, entryTime, resignationTime = null) {//添加，返回promise
    try {
        let res = await findOneEmployee(name);
        return Promise.reject('name already exist')

    } catch (error) {

    }



    let newEmployee;
    if (entryTime) {
        newEmployee = new employeeconstruct({ name, gender, phone, pay, address, entryTime, resignationTime });
    } else {
        newEmployee = new employeeconstruct({ name, gender, phone, pay, address, resignationTime });
    }
    return new Promise(function (resolve, reject) {
        newEmployee.save(function (err, product) {
            console.log(err)
            if (err) {
                reject(err)
            }
            resolve(product);
        })
    })
}

const delEmployeeById = async function (id) {//撤销一笔流水
    return new Promise((reslove, reject) => {
        employeeconstruct.findByIdAndDelete(id, function (err, res) {
            if (err) return reject(err);
            if (res) {
                reslove(res)
            }
        })
    })
}


const uPDateEmployee = function (employee, quantity, unit) {//添加，返回
    return new Promise((reslove, reject) => {
        employeeconstruct.updateOne({ employee }, { $set: { quantity, unit } }, (err, data) => {
            if (!err) {
                reslove("修改成功")
            }
            reject('修改失败')
        })
    })
}

const findOneEmployee = function (name) {
    return new Promise((reslove, reject) => {
        employeeconstruct.findOne({ name }, function (err, res) {
            if (err) reject(err);
            if (!res) reject(res);
            reslove(res)
        })
    })

}


const updateEmployeeById = function (id, newData) {//添加，返回
    return new Promise((reslove, reject) => {
        employeeconstruct.findByIdAndUpdate(id, newData, (err, data) => {
            if (!err) {
                reslove("修改成功")
            }
            reject('修改失败')
        })
    })
}



const findEmployee = function (Info, limit = 10) {//查询
    let { name, gender, phone, address, entryTime, resignationTime } = Info;
    if (!limit) {
        limit = 10;
    }
    let findOption = {}
    if (name) {
        findOption['name'] = name;
    }
    if (gender) {
        findOption['gender'] = gender
    }
    if (phone) {
        findOption['phone'] = phone
    }
    return new Promise((reslove, reject) => {
        employeeconstruct.find(findOption, {}, { limit: parseInt(limit), sort: { _id: -1 } }, function (err, res) {
            if (err) return reject(err);
            if (res) {
                reslove(res)
            }
        })
    })
}





const employeePay = async function (name, count, time) {//添加，返回promise

    let res;
    if (time) {
        try {
            return await addMoney(count, 'PAY', `${name}薪水支出`, name, time)
        } catch (error) {
            return Promise.reject('addmoney err')
        }

    } else {
        try {
            return await addMoney(count, 'PAY', `${name}薪水支出`, name)
        } catch (error) {
            return Promise.reject('addmoney err')
        }
    }
}

const delEmployeePayById = async function (id) {//添加，返回promise
    try {
        return await delMoneyById(id)
    } catch (error) {
        return Promise.reject('moneyId no exist')
    }
}


const findAllEmployee = function () {
    return new Promise((reslove, reject) => {
        employeeconstruct.find({}, { name: '1', _id: 0 }, { sort: { time: -1 } }, function (err, res) {
            if (err) return reject(err);
            if (res) {
                console.log(res)
                reslove(res)
            }
        })
    })
}

module.exports = {
    addEmployee,
    findOneEmployee,
    findEmployee,
    delEmployeeById,
    updateEmployeeById,
    delEmployeePayById,
    employeePay,
    findAllEmployee
}