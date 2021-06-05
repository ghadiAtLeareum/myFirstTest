"use strict";
const express = require("express");
const path = require("path");
const ejs = require("ejs");
var cors = require("cors");
const registerRoute = require("./routes/authRoutes");
const sendMessageToLambda = require("./routes/sendMessage")

  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(cors());

  // Template engine
  app.engine("html", ejs.renderFile);
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "html");

  app.use("/", registerRoute);
  app.use("/" , sendMessageToLambda)


  app.listen(8000)

 


