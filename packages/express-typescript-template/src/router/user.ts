import express from "express";

const router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});
// define the home page route
router.get("/", function (req, res) {
  res.send("User get");
});
// define the about route
router.post("/", function (req, res) {
  res.send("User post");
});

export default router;
