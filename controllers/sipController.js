const db = require("../utility/dbManager");


// CREATE SIP
const createSIP = (req, res) => {

    const {
        sip_id,
        investor_id,
        fund_id,
        sip_amount,
        sip_date,
        frequency,
        start_date,
        sip_status
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
            sip_status
        ],

        function(err){

            if(err){

                return res.status(500).json({
                    success: false,
                    message: "Database Error",
                    error: err.message
                });
            }

            return res.status(201).json({
                success: true,
                message: "SIP Created Successfully"
            });

        }
    );

};



// GET ALL SIPS
const getAllSIPs = (req, res) => {

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

    db.all(query, [], (err, rows) => {

        if(err){

            return res.status(500).json({
                success: false,
                message: "Database Error",
                error: err.message
            });
        }

        return res.status(200).json({
            success: true,
            sips: rows
        });

    });

};



// GET SIP DETAILS + TRANSACTIONS
const getSIPWithTransactions = (req, res) => {

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

    db.get(sipQuery, [sipId], (err, sip) => {

        if(err){

            return res.status(500).json({
                success: false,
                message: "Database Error",
                error: err.message
            });
        }

        if(!sip){

            return res.status(404).json({
                success: false,
                message: "SIP Not Found"
            });
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

            (err, transactions) => {

                if(err){

                    return res.status(500).json({
                        success: false,
                        message: "Database Error",
                        error: err.message
                    });
                }

                return res.status(200).json({
                    success: true,
                    sip,
                    transactions
                });

            }
        );

    });

};



// PROCESS SIP
const processSIP = (req, res) => {

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

    db.get(query, [sipId], (err, sip) => {

        if(err){

            return res.status(500).json({
                success: false,
                message: "Database Error",
                error: err.message
            });
        }

        if(!sip){

            return res.status(404).json({
                success: false,
                message: "SIP Not Found"
            });
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
                "Success"
            ],

            function(err){

                if(err){

                    return res.status(500).json({
                        success: false,
                        message: "Transaction Failed",
                        error: err.message
                    });
                }

                return res.status(201).json({
                    success: true,
                    message: "SIP Processed Successfully"
                });

            }
        );

    });

};



module.exports = {
    createSIP,
    getAllSIPs,
    getSIPWithTransactions,
    processSIP
};