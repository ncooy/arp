let {execute, sql} = require('../index');

class Lot {
    list() {
        let sql = 'SELECT * FROM lot';
        return execute(sql);
    }

    findByMac(mac) {
        return new Promise(resolve => {
            let sqlCon = 'SELECT * FROM lot WHERE mac = ?';
            sql.query(sqlCon,mac,(err,result)=>{
                resolve(result)
            })
        })
    }

    insert(lots) {
        let array = [];
        lots.map(item => {
            let {mac, name, ip} = item;
            array.push([mac, ip, name])
        })
        sql.query(`INSERT INTO lot VALUES ?`, [array], (err, result) => {
            if (err) console.log(err)
        })
    }
}

module.exports = new Lot();
