const orderHandler = require("../controllers/orderDbController")

module.exports = {
    pendingOrdersCleaner: function () {
        orderHandler.cleanOrders();
        try {
            timePeriod = orderHandler.getDBScanTime();
            console.log("Time Get: " + timePeriod);
        } catch {
            console.log("Can not get time, retry after 10s");
            timePeriod = 10000;
        }
        console.log("Pending items deleted.")
        setTimeout(module.exports.pendingOrdersCleaner, timePeriod)
    }
}


