let find = require('local-devices');
let request = require('request');
let loda = require('lodash');
let lot = require('./mysql/lot/index');
let flag = 0;
let devicesDetails = [];
let intDevices = [];
//只存设备的Ip地址;
let newDevicesMac = [];
scanning();
setInterval(() => {
    scanning();
}, 1000);

function lotList(res) {
    lot.list().then(list => {
        if (!list.length) {
            lot.insert(res)
        }
    })
}

function scanning() {
    find().then(res => {
        devicesDetails = res;
        if (!intDevices.length) {
            lotList(res);
            intDevices = res.map(item => item.mac);
            return;
        }
        if (intDevices.length !== res.length) {
            newDevicesMac = res.map(item => item.mac);
            difference(intDevices.length < res.length);
        }
    })
}

function difference(type) {
    let array = [newDevicesMac, intDevices];
    let result = loda.differenceBy(...array);
    if (!result.length) result = loda.differenceBy(...array.reverse());
    if (type) {
        result.forEach(item => {
            lot.findByMac(item).then(result => {
                if (!result.length) {
                    console.log(item, '新上线设备');
                    request({
                        url: `http://${item}/getDevice`,
                    }, (err, response, body) => {
                        if (err) return console.log(item, '设备无响应');
                        console.log(body, '从设备获取到的信息')
                    })
                    lot.insert([devicesDetails.find(ele => ele.mac === item)]);
                }
            })
        })
    }
    intDevices = JSON.parse(JSON.stringify(newDevicesMac));
}
