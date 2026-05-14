const { loginUser, logoutUser } = require("../models/sip");

const { signJWT } = require("../utility/authManager");

const db = require("../utility/dbManager");


// LOGIN
const login = (req, res) => {
  const { email, password } = req.body;

  const user = loginUser(email, password);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid Credentials",
    });
  }

  const token = signJWT({
    investor_id: user.investor_id,
    email: user.email,
    role: user.role,
  });

  return res.status(200).json({
    success: true,
    token: token,
  });
};


// LOGOUT
const logout = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logout Successful",
  });
};


// GET INVESTOR
const getInvestorById = (req, res) => {
  const { investorId } = req.params;

  const query = `
    SELECT *
    FROM investor
    WHERE investor_id = ?
  `;

  db.get(query, [investorId], (err, row) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database Error",
      });
    }

    if (!row) {
      return res.status(404).json({
        success: false,
        message: "Investor Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      data: row,
    });
  });
};


// HOLDINGS
const getInvestorHoldings = (req, res) => {
  const { investorId } = req.params;

  const query = `
    SELECT
      mf.fund_name,

      SUM(it.units_allocated)
      AS total_units,

      mf.nav_value
      AS current_nav,

      ROUND(
        SUM(it.units_allocated)
        * mf.nav_value,
        2
      ) AS current_value

    FROM investment_transaction it

    JOIN mutual_fund mf
    ON it.fund_id = mf.fund_id

    WHERE it.investor_id = ?

    AND it.transaction_status = 'Success'

    GROUP BY it.fund_id
  `;

  db.all(query, [investorId], (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database Error",
      });
    }

    return res.status(200).json({
      success: true,
      holdings: rows,
    });
  });
};


// NET WORTH
const getInvestorNetWorth = (req, res) => {
  const { investorId } = req.params;

  const query = `
    SELECT
      ROUND(
        SUM(
          it.units_allocated
          * mf.nav_value
        ),
        2
      ) AS net_worth

    FROM investment_transaction it

    JOIN mutual_fund mf
    ON it.fund_id = mf.fund_id

    WHERE it.investor_id = ?

    AND it.transaction_status = 'Success'
  `;

  db.get(query, [investorId], (err, row) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database Error",
      });
    }

    return res.status(200).json({
      success: true,
      investor_id: investorId,
      net_worth: row.net_worth || 0,
    });
  });
};


// TRANSACTIONS
const getInvestorTransactions = (req, res) => {
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

  db.all(query, [investorId], (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database Error",
      });
    }

    return res.status(200).json({
      success: true,
      transactions: rows,
    });
  });
};


// SIPS
const getInvestorSips = (req, res) => {
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

  db.all(query, [investorId], (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database Error",
      });
    }

    return res.status(200).json({
      success: true,
      sips: rows,
    });
  });
};


module.exports = {
  login,
  logout,
  getInvestorById,
  getInvestorHoldings,
  getInvestorNetWorth,
  getInvestorTransactions,
  getInvestorSips,
};