const orderHandler = require("../controllers/orderDbController")

module.exports = {
    getAllOrder: function (req, res, next) {
        res.orders = orderHandler.getAllRecords();
        next();
    },

    getOrder: function (req, res, next) {
        let order = orderHandler.getRecord(req.params.id);
        res.order = order;
        next();
    },

    createOrder: function (req, res, next) {
        let order;
        if (req.body.name){
            order = orderHandler.createRecod(req.body.name);
        }
        res.order = order;
        next();
    },

    updateDeliveryTimeStamps: function (req, res, next) {
        let order = orderHandler.updateRecord(req.params.id);
        res.order = order
        next();
    }
}
