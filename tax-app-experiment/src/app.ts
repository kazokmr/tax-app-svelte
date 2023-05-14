import express from "express";

const app = express();

app.use(express.json());

type CalcInput = {
  yearsOfService: number;
  isDisability: boolean;
  isOfficer: boolean;
  severancePay: number;
};

const calcTax = (input: CalcInput) => {
  // TODO 退職金の所得税計算
  return 10000;
};

app.post("/calc-tax", (req, res) => {
  res.json({ tax: calcTax(req.body) });
});

export default app;
