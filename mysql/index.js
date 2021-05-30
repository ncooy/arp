let db = require('mysql');
let mysql = require('mysql');
let sql = mysql.createConnection({
    host: '127.0.0.1',
    user: 'zero',
    password: '3420767891',
    database: 'zero',
    queueLimit: 15,
})
sql.connect(() => {
    console.log('mysql Success')
});
module.exports = {
    execute(Statement, data) {
        return new Promise((resolve, reject) => {
            sql.query(Statement, (err, result) => {
                if (err) reject(err);
                if (data) {
                    result = Object.assign(data, result)
                }
                resolve(result)
            })
        })
    },
    mysql,
    sql,
}
