import calcTaxHandler from "./calcTaxHandler";
import cors from "cors";
import express from "express";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));

app.use(express.json());

app.use(calcTaxHandler);

export default app;
