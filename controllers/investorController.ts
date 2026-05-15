import { Request, Response } from "express";
import { loginUser, logoutUser } from "../models/sip";
import { signJWT } from "../utility/authManager";
import {db} from "../utility/dbManager";

export function login(req: Request, res: Response): void {
  const { email, password } = req.body;

  const user: any = loginUser(email, password);

  if (!user) {
    res.status(401).json({
      success: false,
      message: "Invalid Credentials",
    });
    return;
  }

  const token = signJWT({
    investor_id: user.investor_id,
    email: user.email,
    role: user.role,
  });

  res.status(200).json({
    success: true,
    token,
  });
}

export function logout(req: Request, res: Response): void {
  res.status(200).json({
    success: true,
    message: "Logout Successful",
  });
}

export function getInvestorById(
  req: Request,
  res: Response
): void {
  const { investorId } = req.params;

  const query = `
    SELECT *
    FROM investor
    WHERE investor_id = ?
  `;

  db.get(query, [investorId], (err: Error | null, row: any) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: "Database Error",
      });
      return;
    }

    if (!row) {
      res.status(404).json({
        success: false,
        message: "Investor Not Found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: row,
    });
  });
}

export function getInvestorHoldings(
  req: Request,
  res: Response
): void {
  const { investorId } = req.params;

  const query = `
    SELECT
      mf.fund_name,
      SUM(it.units_allocated) AS total_units,
      mf.nav_value AS current_nav,
      ROUND(
        SUM(it.units_allocated) * mf.nav_value,
        2
      ) AS current_value
    FROM investment_transaction it
    JOIN mutual_fund mf
    ON it.fund_id = mf.fund_id
    WHERE it.investor_id = ?
    AND it.transaction_status = 'Success'
    GROUP BY it.fund_id
  `;

  db.all(query, [investorId], (err: Error | null, rows: any[]) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: "Database Error",
      });
      return;
    }

    res.status(200).json({
      success: true,
      holdings: rows,
    });
  });
}

export function getInvestorNetWorth(
  req: Request,
  res: Response
): void {
  const { investorId } = req.params;

  const query = `
    SELECT
      ROUND(
        SUM(
          it.units_allocated * mf.nav_value
        ),
        2
      ) AS net_worth
    FROM investment_transaction it
    JOIN mutual_fund mf
    ON it.fund_id = mf.fund_id
    WHERE it.investor_id = ?
    AND it.transaction_status = 'Success'
  `;

  db.get(query, [investorId], (err: Error | null, row: any) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: "Database Error",
      });
      return;
    }

    res.status(200).json({
      success: true,
      investor_id: investorId,
      net_worth: row?.net_worth || 0,
    });
  });
}

export function getInvestorTransactions(
  req: Request,
  res: Response
): void {
  const { investorId } = req.params;

  const query = `
    SELECT
      transaction_id,
      transaction_amount,
      transaction_status,
      transaction_date
    FROM investment_transaction
    WHERE investor_id = ?
    ORDER BY transaction_date DESC
  `;

  db.all(query, [investorId], (err: Error | null, rows: any[]) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: "Database Error",
      });
      return;
    }

    res.status(200).json({
      success: true,
      transactions: rows,
    });
  });
}

export function getInvestorSips(
  req: Request,
  res: Response
): void {
  const { investorId } = req.params;

  const query = `
    SELECT
      sr.sip_id,
      sr.sip_amount,
      sr.frequency,
      sr.sip_status,
      mf.fund_name
    FROM sip_registration sr
    JOIN mutual_fund mf
    ON sr.fund_id = mf.fund_id
    WHERE sr.investor_id = ?
  `;

  db.all(query, [investorId], (err: Error | null, rows: any[]) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: "Database Error",
      });
      return;
    }

    res.status(200).json({
      success: true,
      sips: rows,
    });
  });
}