import { Request, Response } from "express";
import {db} from "../utility/dbManager";

export function createSIP(
  req: Request,
  res: Response
): void {
  const {
    sip_id,
    investor_id,
    fund_id,
    sip_amount,
    sip_date,
    frequency,
    start_date,
    sip_status,
  } = req.body;

  const query = `
        INSERT INTO sip_registration (
            sip_id,
            investor_id,
            fund_id,
            sip_amount,
            sip_date,
            frequency,
            start_date,
            sip_status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

  db.run(
    query,
    [
      sip_id,
      investor_id,
      fund_id,
      sip_amount,
      sip_date,
      frequency,
      start_date,
      sip_status,
    ],
    function (err: Error | null) {
      if (err) {
        res.status(500).json({
          success: false,
          message: "Database Error",
          error: err.message,
        });
        return;
      }

      res.status(201).json({
        success: true,
        message: "SIP Created Successfully",
      });
    }
  );
}

export function getAllSIPs(
  req: Request,
  res: Response
): void {
  const query = `
        SELECT
            sr.*,
            mf.fund_name,
            mf.amc_name,
            mf.nav_value,
            mf.risk_level
        FROM sip_registration sr
        JOIN mutual_fund mf
        ON sr.fund_id = mf.fund_id
        ORDER BY sr.start_date DESC
    `;

  db.all(query, [], (err: Error | null, rows: any[]) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: "Database Error",
        error: err.message,
      });
      return;
    }

    res.status(200).json({
      success: true,
      sips: rows,
    });
  });
}

export function getSIPWithTransactions(
  req: Request,
  res: Response
): void {
  const { sipId } = req.params;

  const sipQuery = `
        SELECT
            sr.*,
            mf.fund_name,
            mf.amc_name,
            mf.nav_value,
            mf.risk_level
        FROM sip_registration sr
        JOIN mutual_fund mf
        ON sr.fund_id = mf.fund_id
        WHERE sr.sip_id = ?
    `;

  db.get(sipQuery, [sipId], (err: Error | null, sip: any) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: "Database Error",
        error: err.message,
      });
      return;
    }

    if (!sip) {
      res.status(404).json({
        success: false,
        message: "SIP Not Found",
      });
      return;
    }

    const transactionQuery = `
            SELECT *
            FROM investment_transaction
            WHERE sip_id = ?
            ORDER BY transaction_date DESC
        `;

    db.all(
      transactionQuery,
      [sipId],
      (err: Error | null, transactions: any[]) => {
        if (err) {
          res.status(500).json({
            success: false,
            message: "Database Error",
            error: err.message,
          });
          return;
        }

        res.status(200).json({
          success: true,
          sip,
          transactions,
        });
      }
    );
  });
}

export function processSIP(
  req: Request,
  res: Response
): void {
  const { sipId } = req.params;

  const query = `
        SELECT
            sr.*,
            mf.nav_value
        FROM sip_registration sr
        JOIN mutual_fund mf
        ON sr.fund_id = mf.fund_id
        WHERE sr.sip_id = ?
    `;

  db.get(query, [sipId], (err: Error | null, sip: any) => {
    if (err) {
      res.status(500).json({
        success: false,
        message: "Database Error",
        error: err.message,
      });
      return;
    }

    if (!sip) {
      res.status(404).json({
        success: false,
        message: "SIP Not Found",
      });
      return;
    }

    const unitsAllocated =
      sip.sip_amount / sip.nav_value;

    const transactionId =
      "TXN" + Date.now();

    const insertQuery = `
            INSERT INTO investment_transaction (
                transaction_id,
                sip_id,
                investor_id,
                fund_id,
                transaction_amount,
                nav_used,
                units_allocated,
                transaction_date,
                transaction_status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, DATE('now'), ?)
        `;

    db.run(
      insertQuery,
      [
        transactionId,
        sip.sip_id,
        sip.investor_id,
        sip.fund_id,
        sip.sip_amount,
        sip.nav_value,
        unitsAllocated,
        "Success",
      ],
      function (err: Error | null) {
        if (err) {
          res.status(500).json({
            success: false,
            message: "Transaction Failed",
            error: err.message,
          });
          return;
        }

        res.status(201).json({
          success: true,
          message: "SIP Processed Successfully",
        });
      }
    );
  });
}