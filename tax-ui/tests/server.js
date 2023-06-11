import jsonServer from "json-server";

const server = jsonServer.create();
const router = jsonServer.router("./tests/db.json");
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use((req, res, next) => {
  if (req.path === "/calc-tax") {
    res.status(200).json({ tax: 25525 });
  } else {
    next();
  }
});

server.use(router);
server.listen(3000, () => {
  console.log("JSON Server is running");
});