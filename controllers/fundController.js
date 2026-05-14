const db = require("../utility/dbManager");

// CREATE FUND
const createFund = (req, res) => {
    const {
        fund_id,
        fund_name,
        amc_name,
        fund_type,
        category,
        nav_value,
        nav_date,
        risk_level
    } = req.body;

    const query = `
        INSERT INTO mutual_fund (
            fund_id,
            fund_name,
            amc_name,
            fund_type,
            category,
            nav_value,
            nav_date,
            risk_level
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        query,
        [
            fund_id,
            fund_name,
            amc_name,
            fund_type,
            category,
            nav_value,
            nav_date,
            risk_level
        ],
        function(err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error",
                    error: err.message
                });
            }

            return res.status(201).json({
                success: true,
                message: "Fund created successfully"
            });
        }
    );
};

// GET ALL FUNDS
const getAllFunds = (req, res) => {
    const query = `
        SELECT * FROM mutual_fund
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error",
                error: err.message
            });
        }

        return res.status(200).json({
            success: true,
            funds: rows
        });
    });
};

// UPDATE NAV
const updateFundNAV = (req, res) => {
    const { fundId } = req.params;
    const { nav_value, nav_date } = req.body;

    const query = `
        UPDATE mutual_fund
        SET 
            nav_value = ?,
            nav_date = ?
        WHERE fund_id = ?
    `;

    db.run(
        query, 
        [nav_value, nav_date, fundId], 
        function(err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error",
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Fund not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "NAV updated successfully"
            });
        }
    );
};

module.exports = {
    createFund,
    getAllFunds,
    updateFundNAV
};