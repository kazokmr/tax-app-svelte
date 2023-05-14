import express from "express";

const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export const viteNodeApp = app;
