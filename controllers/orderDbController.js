const uniqID = require('nanoid');
const fs = require('fs');
const db_table = './db_orders/orders.json'
const timePeriod = 7200000; //2h


module.exports = {
    pushRecordToDB: function (item) {
        let ordersdb = fs.readFileSync(db_table);
        let data = JSON.parse(ordersdb);
        data.push(item);
        module.exports.updateDB(data)
    },
    updateDB: function (data) {
        if (data.length == 0) {
            fs.writeFile(db_table, "[]", function () {
                console.log("DB updated (empty).")
            });
        } else {
            fs.writeFile(db_table, JSON.stringify(data), function () {
                console.log("DB updated.")
            });
        }
    },
    getRecord: function (id) {
        let ordersdb = fs.readFileSync(db_table);
        let data = JSON.parse(ordersdb);
        let order = data.find(o => o.id === id);
        return order;
    },
    getAllRecords: function (id) {
        let ordersdb = fs.readFileSync(db_table);
        let data = JSON.parse(ordersdb);
        return data;
    },
    createRecod: function (productName) {
        let order = {
            id: uniqID.nanoid(8),
            name: productName,
            orderTimeStamp: new Date().getTime(),
            deliveredTimeStamp: null
        }

        module.exports.pushRecordToDB(order);
        return order;
    },
    updateRecord: function (id) {
        let ordersdb = fs.readFileSync(db_table);
        let data = JSON.parse(ordersdb);
        let index = data.findIndex(a => a.id === id);

        if (index > -1) {
            if (data[index].deliveredTimeStamp == null) data[index].deliveredTimeStamp = new Date().getTime();
            module.exports.updateDB(data);
            return data[index];
        }
        return;
    },

    cleanOrders: function () {
        let ordersdb = fs.readFileSync(db_table);
        let data = JSON.parse(ordersdb);
        let timeNow = new Date().getTime();
        data = data.filter(function (el) {
            return el.deliveredTimeStamp != null || el.orderTimeStamp > timeNow - timePeriod;
        });
        module.exports.updateDB(data)
    },

    getDBScanTime: function () {
        let ordersdb = fs.readFileSync(db_table);
        let data = JSON.parse(ordersdb);
        scanTime = data.reduce(function (prev, current) {
            return (prev.orderTimeStamp > current.orderTimeStamp) ? prev : current
        })

        nextPeriod = timePeriod - (new Date().getTime() - scanTime.orderTimeStamp);
        if (nextPeriod < 0) { nextPeriod = timePeriod; }
        console.log("Next run after: " + nextPeriod + " ms")
        return nextPeriod
    }
}
