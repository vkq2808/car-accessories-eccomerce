# Gara-ute

This project is created for studying purposes. Follow the instructions below to set up and run the project on your local machine.

---

## Prerequisites

Before you start, make sure you have the following installed on your system:

- **Node.js** 
- **MySQL** (for database management)

---

## Installation

### Step 1: Install dependencies
Run the following command to install all necessary dependencies for both the backend (`be`) and frontend (`fe`):
```bash
npm i
```
### Step 2: Set up environment files
Navigate to the be and fe folders.
Create a .env file in each folder based on your environment settings.

#### Backend .env (./be)
```bash
PORT=3001
SERVER_URL=http://localhost:3001
CLIENT_URL=http://localhost:3000

// JWT
ACCESS_TOKEN_SECRET_KEY=
REFRESH_TOKEN_SECRET_KEY=
REGISTER_SECRET_KEY=
RESET_PASSWORD_SECRET_KEY=
NODE_ENV=

// Bcrypt
SALT=

// Email
SMTP_EMAIL=
SMTP_PASSWORD=

// Database
DB_NAME=
DB_USER=root
DB_PASSWORD=

// SUPER_ADMIN
ADMIN_PASSWORD=
ADMIN_FIRST_NAME=
ADMIN_LAST_NAME=
ADMIN_EMAIL=
ADMIN_PHONE=
ADMIN_BIRTH=

// Google
vnp_TmnCode=
vnp_HashSecret=
vnp_Url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
vnp_ReturnUrl=http://localhost:3000/cart/payment-result/vnpay-return
```

#### Frontend .env (./fe/)
```bash
PORT=3000
REACT_APP_API_URL=http://localhost:3001/api/v1
REACT_APP_BASE_URL=http://localhost:3000
PUBLIC_URL="/"
```

## Step 3: Initialize the database
To create your database schema at the first, run:

```bash
npm run start:init-database
```
Ensure that your MySQL server is installed, running, and accessible using the credentials in your .env file.

Step 4: Start the project
To start the project, use the following command:

```bash
npm start
```

This command will run both the frontend and backend servers.
