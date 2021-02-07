const express = require('express');
const app = express();
app.use(express.json());
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition:{
        info:{
            title: 'Ordering API',
            description: 'Task for gg.',
            contact:{
                name:'Amazing Name'
            },
            servers: ["http://localcost:3000"]
        }
    },
    apis: ["./routes/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Routes
const ordersRouter = require('./routes/orders');
app.use('/orders', ordersRouter);

// memory database
app.listen(3000, () => console.log('Listening onm port 3000..'));

