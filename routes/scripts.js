const uniqID = require('nanoid');
const fs = require('fs');
const db_file = 'orders.json';
const timePeriod = 30000//7200000; //2 hours

module.exports = {
    pushToDB: function (data) {
        fs.writeFile(db_file, JSON.stringify(data), finished);
        function finished(err) {
            console.log("DB updated.")
        }
    },
    getRecord: function (data, id) {
        let order = data.find(o => o.id === id);
        return order;
    },
    createRecod: function (productName) {
        let order = {
            id: uniqID.nanoid(8),
            name: productName,
            orderTimeStamp: new Date().getTime(),
            deliveredTimeStamp: null
        }

        return order;
    },
    updateRecord: function (data, id) {
        let index = data.findIndex(a => a.id === id);

        if (index > -1) {
            if (data[index].deliveredTimeStamp == null) data[index].deliveredTimeStamp = new Date().getTime();
        }

        return data[index];
    },

    cleanOrders: function (data) {
        let timeNow = new Date().getTime();
        data = data.filter(function (el) {
            return el.deliveredTimeStamp != null || el.orderTimeStamp > timeNow - timePeriod;
        });
        return data;
    },

    getDBScanTime: function(data){
        scanTime = data.reduce(function (prev, current) {
            return (prev.orderTimeStamp > current.orderTimeStamp) ? prev : current
        }) 

        return timePeriod - new Date().getTime() + scanTime.order;
    }


}
