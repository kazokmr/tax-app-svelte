import { calcIncomeTaxForSeverancePay, calcSeverancePayTaxInputScheme } from "./calcTax.js";
import { Router } from "express";

const router = Router();

router.post("/calc-tax", (req, res) => {
  const validationResult = calcSeverancePayTaxInputScheme.safeParse(req.body);
  if (!validationResult.success) {
    res.status(400).json({ message: "Invalid parameter." });
    return;
  }
  const incomeTax = calcIncomeTaxForSeverancePay(validationResult.data);
  res.json({ tax: incomeTax });
});

export default router;
