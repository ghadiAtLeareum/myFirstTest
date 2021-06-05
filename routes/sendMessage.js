const express = require("express");
const router = express.Router();
const sendMessageToLambda = require("../authFunctions/sendMessageToLambda");

router.post("/sendMessage", async (req, res) => {
 
});

module.exports = router;
