require("dotenv").config();
const express = require("express");
const app = express();
const routes = require("./routes");
const Web3 = require("web3");
const mongodb = require("mongodb").MongoClient;
const contract = require("truffle-contract");
const artifacts = require("./build/Inbox.json");
const fileupload = require("express-fileupload");
// app.use(express.json());
app.use(fileupload());

if (typeof web3 !== "undefined") {
  var web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

const LMS = contract(artifacts);
LMS.setProvider(web3.currentProvider);
mongodb.connect(process.env.DB, async (err, client) => {
  const db = client.db("cryptomongo");
  const accounts = await web3.eth.getAccounts();
  const lms = await LMS.deployed();
  //const lms = LMS.at(contract_address) for remote nodes deployed on ropsten or rinkeby
  routes(app, db, lms, accounts);
  app.listen(process.env.PORT, () => {
    console.log("listening");
  });
});
