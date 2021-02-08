const express = require('express');
const router = express.Router();
const orderController = require("./ordersMiddleware")

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
 */
router.get('/', orderController.getAllOrder, (req, res) => {
    res.send(res.orders);
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
 *                  description: A successful response.
 *              '204':
 *                  description: Order not found.
 */
router.get('/:id', orderController.getOrder, (req, res) => {
    if (!res.order) { res.sendStatus(204) }
    else {
        res.send(res.order);
    }
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
 *                description: Product to order.
 *                required: true
 *                schema:
 *                      $ref: '#/definitions/order'
 *          description: Use to order product.
 *          responses: 
 *              '201':
 *                  description: Order successfully created.
 *              '400':
 *                  description: Bad Request
 * definitions:
 *      order:
 *          type: object
 *          requires:
 *              - name
 *          properties:
 *              name:
 *                  type: string
 *                  example: Product Name
 */
router.post('/', orderController.createOrder, (req, res) => {
    if (res.order) {
        res.status(201).send(res.order);
        console.log("Order placed (Notification to seller)");
    } else {
        res.sendStatus(400);
    }

})

//Update order
/**
 * @swagger
 * /orders/{id}:
 *      patch:
 *          tags: 
 *          - orders
 *          summary: Update delivery date.
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
router.patch('/:id', orderController.updateDeliveryTimeStamps, (req, res) => { //funtio nname deliverydate
    if (!res.order) { res.sendStatus(204); } else {
        res.send(res.order)
        console.log("Order delivered (Notification to buyer)")
    }

})

module.exports = router;
