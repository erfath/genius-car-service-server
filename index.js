const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
//var MongoClient = require('mongodb').MongoClient;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.btz4c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0-shard-00-00.btz4c.mongodb.net:27017,cluster0-shard-00-01.btz4c.mongodb.net:27017,cluster0-shard-00-02.btz4c.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-yo6xk8-shard-0&authSource=admin&retryWrites=true&w=majority`;

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('geniusCar').collection('service');
        const orderCollection = client.db('geniusCar').collection('order');

        //auth
        app.post('/login', async (req, res)=>{
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            })
            res.send({accessToken}); 

        })



        //service API
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })

        app.get('/service/:id', async (req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        //post
        app.post('/service', async (req, res)=>{
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result)
        })

        //delete
        app.delete('/service/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })
        //order collection API
            app.get('/order', async (req, res)=>{
                const email = req.query;
                console.log(email);
                const query = {};
                const cursor = orderCollection.find(query)
                const orders = await cursor.toArray()
                res.send(orders)
            })

        app.post('/order', async (req, res)=>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result)
        })

    }

    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running Genius Car Service')
})


app.listen(port, () => {
    console.log('Server is listening', port)
});