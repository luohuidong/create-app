import express from "express";

const router = express.Router();

// define the home page route
router.get("/", function (req, res) {
  res.send("User get");
});
// define the about route
router.post("/", function (req, res) {
  res.send("User post");
});

export default router;
