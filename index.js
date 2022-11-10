const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
// const services = require("./services.json");

// middleware
app.use(cors());
app.use(express.json());

// getting data from json
// app.get("/services", (req, res) => {
//   res.send(services);
// });

//

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fkxltzv.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//
//
async function run() {
  try {
    const servicesCollection = client
      .db("photography-service")
      .collection("services");
    const reviewsCollection = client
      .db("photography-service")
      .collection("reviews");
    // load limited services

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query).limit(3);
      const services = await cursor.toArray();
      res.send(services);
    });
    // load all services
    app.get("/allservices", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    // single services
    app.get("/services/:id", async (req, res) => {
      const id = parseInt(req.params.id);

      const cursor = servicesCollection.findOne({ serviceid: id });

      const service = await cursor;

      res.send(service);
    });
    // load all reviews
    app.get("/reviews/:id", async (req, res) => {
      const id = parseInt(req.params.id);
      const mysort = { reviewdate: 1 };
      const cursor = reviewsCollection.find({ serviceid: id }).sort(mysort);
      const reviews = await cursor.toArray();
      console.log;
      res.send(reviews);
    });
    // add review
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.send(result);
    });
    // add service
    app.post("/addservice", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      res.send(result);
    });
    // load my reviews
    app.get("/myreviews/:id", async (req, res) => {
      const id = req.params.id;

      const cursor = reviewsCollection.find({ reviewemail: id });
      const myreviews = await cursor.toArray();
      res.send(myreviews);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));
//
app.listen(port, () => {
  console.log("photography services running on port:", port);
});
