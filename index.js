require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ connected: "true" });
});

const uri = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASS}@cluster0.s7kzw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const db = client.db("coffee-shop");
    const coffies = db.collection("coffies");

    app.get("/coffies", async (req, res) => {
      const result = await coffies.find().toArray();
      res.send(result);
    });

    app.post("/coffies", async (req, res) => {
      const data = req.body;

      console.log(data);
      const result = await coffies.insertOne(data);
      res.send(result);
    });
    app.delete("/coffies/:cid", async (req, res) => {
      const cid = req.params.cid;

      const query = { _id: new ObjectId(cid) };

      const result = await coffies.deleteOne(query);
      res.send(result);
    });
    app.patch("/coffies/:cid", async (req, res) => {
      const cid = req.params.cid;
      const data = req.body;
      const updateData = {
        $set: data,
      };
      const query = { _id: new ObjectId(cid) };

      const result = await coffies.updateOne(query, updateData);
      res.send(result);
    });
    app.put("/coffies/:cid", async (req, res) => {
      const cid = req.params.cid;
      const data = req.body;
      const query = { _id: new ObjectId(cid) };
      const updateData = {
        $set: data,
      };
      const option = { upsert: true };
      const result = await coffies.updateOne(query, updateData, option);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

app.listen(port, () => console.log(`server started : ${port}`));
