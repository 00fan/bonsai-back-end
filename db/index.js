const mongoose = require('mongoose');


// var connection = mongoose.connect('mongodb://47.108.79.196:27017/bonsai_system').then(res => {
//     console.log('数据库连接成功...');
// }, err => {
//     console.log('数据库连接失败:' + err)
// })
var connection = mongoose.connect('mongodb://localhost:27017/bonsai_system').then(res => {
    console.log('数据库连接成功...');
}, err => {
    console.log('数据库连接失败:' + err)
})


//const { addUser, findUser } = require('./models/user');

// addUser('test0003', '123456').then(product => {
//     console.log('添加成功:' + product)
// }).catch(err => {
//     console.log('添加失败:' + err)
// })

// findUser('test1').then(res => {
//     console.log('查询结果:' + res)
// }).catch(err => {
//     console.log('查询失败:' + err)
// })

// require('./models/id.js')

module.exports = {
    
}