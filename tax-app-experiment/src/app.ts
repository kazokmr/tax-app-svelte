import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/check-post", (req, res) => {
  res.send("Hello Post!");
});

app.post("/check-json", (req, res) => {
  res.json({ message: "Hello JSON!" });
});

app.post("/check-status", (req, res) => {
  res.status(500).json({ message: "Hello StatusCode!" });
});

app.post("/check-body", (req, res) => {
  console.dir(req.body);
  res.json({ message: "Hello JSON body!" });
});

export default app;
