const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const services = require("./services.json");

app.use(cors());
app.use(express.json());
app.get("/services", (req, res) => {
  res.send(services);
});

//

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.app9bcf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db("photography-service").collection("services");
  // perform actions on the collection object

  client.close();
});

//
app.listen(port, () => {
  console.log("photography services running on port:", port);
});
