const { loginUser, logoutUser } = require("../models/sip");
const { signJWT } = require("../utility/authManager");
const db = require("../utility/dbManager");

const login = (req, res) => {

    const { email, password } = req.body;

    console.log(`Passed Email: ${email}, ${password}`);

    const user = loginUser(email, password);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid Credentials"
        });
    }

    const token = signJWT({
        investor_id: user.investor_id,
        email: user.email,
        role: user.role
    });

    return res.status(200).json({
        success: true,
        token: token
    });

};

const logout = (req,res) => {
    const {email, token} = req.body;
    const result = logoutUser(email, token);
    res.send(200);
}


const getInvestorById = (req, res) => {

    const { investorId } = req.params;

    const query = ` SELECT * FROM investor WHERE investor_id = ?`;

    db.get(query, [investorId], (err, row) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error",
                error: err.message
            });
        }

        if (!row) {
            return res.status(404).json({
                success: false,
                message: "Investor not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: row
        });

    });

};


const getInvestorHoldings = (req, res) => {

    const { investorId } = req.params;

    const query = `
        SELECT  mf.fund_name, 
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

        GROUP BY it.fund_id`;

    db.all(query, [investorId], (err, rows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error",
                error: err.message
            });
        }

        return res.status(200).json({
            success: true,
            holdings: rows
        });

    });

};



const getInvestorNetWorth = (req, res) => {

    const { investorId } = req.params;

    const query = `
        SELECT 
            ROUND(
                SUM(it.units_allocated * mf.nav_value),
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
                message: "Database error",
                error: err.message
            });
        }

        return res.status(200).json({
            success: true,
            investor_id: investorId,
            net_worth: row.net_worth || 0
        });

    });

};

module.exports = { login, logout, getInvestorById, getInvestorHoldings, getInvestorNetWorth };