const express = require('express');
const router = express.Router();


const orderHandler = require("./scripts")

const fs = require('fs');
const ordersdb = fs.readFileSync('orders.json')
let orders = JSON.parse(ordersdb)
let nextScanPeriod = 0;
//const runTime = 0;


function dbScan(){
    console.log(orders.length)
    orders = orderHandler.cleanOrders(orders)
    orderHandler.pushToDB(orders)
    console.log(orders.length)
}


async function scan(period){
    setTimeout(dbScan(), period);
    nextScanPeriod = orderHandler.getDBScanTime(orders)
    await scan(nextScanPeriod)
}

//scan(nextScanPeriod);



//Get all
/**
 * @swagger
 * /orders/:
 *      get:
 *          tags:
 *          - orders
 *          summary: Retriev orders
 *          description: Use to get order details.
 *          responses: 
 *              '200':
 *                  description: A successful response
 *              '404':
 *                  description: Bad Call
 */
router.get('/', (req, res) => {
    res.send(orders);
})


//Get One
/**
 * @swagger
 * /orders/{id}:
 *      get:
 *          tags:
 *          - orders
 *          summary: Retriev orders
 *          description: Use to get order details.
 *          parameters:
 *          - name: id
 *            in: path
 *          responses: 
 *              '200':
 *                  description: A successful response
 *              '404':
 *                  description: Bad Call
 */
router.get('/:id', getOrder, (req, res) => {
})

//Create order
/**
 * @swagger
 * /orders/:
 *      post:
 *          tags: 
 *          - orders
 *          summary: Create an order.
 *          parameters:
 *              - in: body
 *                name: body
 *                description: Product name to order.
 *                required: true
 *                schema:
 *                      $ref: '#/definitions/order'
 *          description: Use to order product.
 *          responses: 
 *              '201':
 *                  description: Order successfully created.
 *              '404':
 *                  description: Bad Request
 * definitions:
 *      order:
 *          type: object
 *          requires:
 *              - name
 *          properties:
 *              name:
 *                  type: string
 *                  example: Product
 */
router.post('/', createOrder, (req, res) => {
    res.status(201).send(res.order);
    console.log("Order placed (Notification to seller)");
})

//Update order
/**
 * @swagger
 * /orders/{id}:
 *      patch:
 *          tags: 
 *          - orders
 *          summary: Update an order.
 *          description: Updates delivery date if not null. Returns object with delivery date.
 *          parameters:
 *              - name: id
 *                in: path
 *                required: true
 *          responses: 
 *              '200':
 *                  description: Successfully updated.
 *              '204':
 *                  description: Order not found.
 *              '404':
 *                  description: Bad Request
 */
router.patch('/:id', updateOrder, (req, res) => {

})

function getOrder(req, res, next) {
    order = orderHandler.getRecord(orders, req.params.id);
    if (order == null) { res.status(204) } else {
        res.order = order;
        res.send(res.order);
        next();
    }
}

function createOrder(req, res, next) {
    order = orderHandler.createRecod(req.body.name);
    orders.push(order);
    orderHandler.pushToDB(orders);
    res.order = order;
    next();
}


function updateOrder(req, res, next) {
    order = orderHandler.updateRecord(orders, req.params.id);
    if (order == null) { res.status(404).send({ message: 'Cannot find order to update.' }) } else {
        orderHandler.pushToDB(orders); 
        res.order = order;
        res.status(200).send(res.order);
        console.log("Order delivered (notification)")
        next();
    }
}

module.exports = router;
