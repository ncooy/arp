let find = require('local-devices');
let request = require('request');
let loda = require('lodash');
let intDevices = [];
let newDevicesIp = [];
scanning();
setInterval(() => {
    scanning();
}, 10000);

function scanning() {
    find().then(res => {
        console.log(res)
        console.log('---------------------------', Date.now())
        if (!intDevices.length) {
            intDevices = res.map(item => item.ip);
            return;
        }
        if (intDevices.length !== res.length) {
            newDevicesIp = res.map(item => item.ip);
            difference(intDevices.length < res.length);
        }
    })
}

function difference(type) {
    let array = [newDevicesIp, intDevices];
    let result = loda.differenceBy(...array);
    if (!result.length) result = loda.differenceBy(...array.reverse());
    if (type) {
        console.log(result, '新上线设备')
        result.forEach(item => {
            request({
                url: `http://${item}/getDevice`,
            }, (err, response, body) => {
                console.log(body)
            })
        })
    }else console.log(result,'设备离线')
    intDevices = JSON.parse(JSON.stringify(newDevicesIp));
}
