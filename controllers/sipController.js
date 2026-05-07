const db = require("../utility/dbManager");

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
                message: "SIP registered successfully"
            });

        }
    );

};


const getSIPById = (req, res) => {

    const { sipId } = req.params;

    const query = `
        SELECT *
        FROM sip_registration
        WHERE sip_id = ?
    `;

    db.get(query, [sipId], (err, row) => {

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
                message: "SIP not found"
            });
        }

        return res.status(200).json({
            success: true,
            sip: row
        });

    });

};



const processSIP = (req, res) => {

    const { sipId } = req.params;

    const getSIPQuery = `
        SELECT 
            sr.*,
            mf.nav_value

        FROM sip_registration sr

        JOIN mutual_fund mf
        ON sr.fund_id = mf.fund_id

        WHERE sr.sip_id = ?
    `;

    db.get(getSIPQuery, [sipId], (err, sip) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error",
                error: err.message
            });
        }

        if (!sip) {
            return res.status(404).json({
                success: false,
                message: "SIP not found"
            });
        }

        const unitsAllocated =
            sip.sip_amount / sip.nav_value;

        const transactionId =
            "TXN" + Date.now();

        const insertTransactionQuery = `
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
            insertTransactionQuery,
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
            function(err) {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Transaction failed",
                        error: err.message
                    });
                }

                return res.status(201).json({
                    success: true,
                    message: "SIP processed successfully",
                    transaction_id: transactionId,
                    units_allocated: unitsAllocated
                });

            }
        );

    });

};


const getSIPTransactions = (req, res) => {

    const { sipId } = req.params;

    const query = `
        SELECT *
        FROM investment_transaction
        WHERE sip_id = ?
    `;

    db.all(query, [sipId], (err, rows) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error",
                error: err.message
            });
        }

        return res.status(200).json({
            success: true,
            transactions: rows
        });

    });

};

module.exports = { createSIP, getSIPById, processSIP, getSIPTransactions };