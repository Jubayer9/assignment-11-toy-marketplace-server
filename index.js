const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.43vj3zh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const serviceCollection = client.db('toyCategory').collection('Categories')

    app.get('/category', async (req, res) => {
      const cursor = serviceCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    // ADD Toy

    app.get('/addToy', async (req, res) => {
      const cursor = ToyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // Update Toy
    app.get('/addToy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await ToyCollection.findOne(query);
      res.send(result);
    })
    app.get('/totalToys', async (req, res) => {
      const result = await ToyCollection.estimatedDocumentCount();
      res.send({totalToy: result })
    })


    app.put('/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateToy = req.body;
      const Toy = {
        $set: {
          category: updateToy.category,
          price: updateToy.price,
          photo: updateToy.photo,
          name: updateToy.name,
          email: updateToy.email
        }
      }

      const result = await ToyCollection.updateOne(filter, Toy, options);
      res.send(result);
    })
    // created Toy

    const ToyCollection = client.db('toyDB').collection('toy')
    app.post('/addToy', async (req, res) => {
      const newToy = req.body;
      console.log(newToy);
      const result = await ToyCollection.insertOne(newToy);
      res.send(result)
    })

    // Delete Toy

    app.delete('/addToy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await ToyCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('port is running')

})
app.listen(port, () => {
  console.log(`toy Server is on port:${port}`);
})