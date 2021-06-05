const express = require("express");
const router = express.Router();
const signUp = require("../authFunctions/auth").signUp
const verify = require("../authFunctions/auth").verify
const signin = require("../authFunctions/auth").signIn
router.get("/", (req, res) => {
  res.locals.name = "test1";
  res.render("index");
});
router.get("/confirmEmail", (req, res) => {
    res.render("confirmEmail");
  });
  router.get("/signin", (req, res) => {
    res.render("signin");
  });

router.post("/register",  async function (req, res) {
  const response =  await signUp(req.body.email, req.body.password);
  console.log(response);
  res.redirect('/confirmEmail')
});

router.post("/confirmEmail",  async function (req, res) {
    const response =  await verify(req.body.email, req.body.otp);
    console.log(response);
    res.redirect("/signin")
  });

  router.post("/signin",  async function (req, res) {
    const response =  await signin(req.body.email, req.body.password);
    console.log(response);
  });

module.exports = router;
