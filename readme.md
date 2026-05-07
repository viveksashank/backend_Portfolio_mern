# SIP Tracker and Portfolio Valuation System

A backend-based fintech application to manage SIPs (Systematic Investment Plans), mutual funds, investor portfolios, and portfolio valuation.

## Project Overview

This project is designed to simulate a real-world fintech backend system where investors can:

* Register and manage SIPs
* Invest in mutual funds
* Track SIP transactions
* View holdings and portfolio valuation
* Calculate investor net worth

The system follows proper database normalization principles up to 3NF and demonstrates transaction handling using SQLite3.

---

# Tech Stack

* **Backend:** Node.js + Express.js
* **Database:** SQLite3
* **API Testing:** Postman
* **Version Control:** Git & GitHub

---

# Features

## Investor Management

* Add investor details
* Maintain contact information
* Manage investor portfolios

## SIP Management
* Register SIPs
* Get SIP details by SIP 

## SIP Processing
* Process SIP installments
* Get SIP transaction history

## Mutual Fund Management
* Add mutual funds
* Get all mutual funds
* Update fund NAV values
---

# Project Structure

```bash
SIP_Tracker_And_Portfolio_Valuation_System/
│
├── controllers/      # Contains business logic for APIs
├── models/           # Database queries and data handling
├── routes/           # API route definitions
├── utilities/        # Utility/helper functions
├── server.js         # Main server entry point
│
├── package.json
├── package-lock.json
└── README.md
```

---

# Database Design

The database is normalized up to **Third Normal Form (3NF)**.

## Main Tables

* investors
* mutual_funds
* sip_registrations
* investment_transactions

## Database Concepts Used

* Primary Keys
* Foreign Keys
* Referential Integrity
* Database Transactions
* Normalization (3NF)

---

# API Endpoints

## Investor APIs

| Method | Endpoint                            | Description            |
| ------ | ----------------------------------- | ---------------------- |
| POST   | /api/investors                      | Create new investor    |
| GET    | /api/investors/:investorId          | Get investor details   |
| GET    | /api/investors/:investorId/holdings | Get investor holdings  |
| GET    | /api/investors/:investorId/networth | Get investor net worth |

---

## Fund APIs

| Method | Endpoint               | Description     |
| ------ | ---------------------- | --------------- |
| POST   | /api/funds             | Add mutual fund |
| GET    | /api/funds             | Get all funds   |
| PUT    | /api/funds/:fundId/nav | Update NAV      |

---

## SIP APIs

| Method | Endpoint                      | Description             |
| ------ | ----------------------------- | ----------------------- |
| POST   | /api/sips                     | Register SIP            |
| GET    | /api/sips/:sipId              | Get SIP details         |
| POST   | /api/sips/:sipId/process      | Process SIP installment |
| GET    | /api/sips/:sipId/transactions | Get SIP transactions    |

---

# Transaction Handling

The application uses SQLite transactions for critical operations.

## Operations Using Transactions

* SIP installment processing
* Investment transaction creation
* Portfolio updates

### Transaction Flow

```sql
BEGIN TRANSACTION;

-- Insert transaction records
-- Update portfolio holdings
-- Update investment values

COMMIT;
```

If any operation fails:

```sql
ROLLBACK;
```

---
