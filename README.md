# New Project for Studying Only

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

#### Backend .env
```bash
PORT=3001
SERVER_URL=http://localhost:3001
CLIENT_URL=http://localhost:3000

// JWT
ACCESS_TOKEN_SECRET_KEY=b13d7ff0644a3befebdf10bbc22f89d2fec4f802e0e4ace0ee1f06265dbb6d99
REFRESH_TOKEN_SECRET_KEY=b13d7ff0644a3befebdf1028082f89d2fec4f802e0e4ace0ee1f06265dbb6d99
REGISTER_SECRET_KEY=074333f986bd0416512fd3039cb78511
RESET_PASSWORD_SECRET_KEY=e2c3e07278cbb4e41632119fa58a5146
NODE_ENV=development

// Bcrypt
SALT=$2a$05$DpDEQ9AxrvW8bPd0HDYJ6u

// Email
SMTP_EMAIL=vkq0919309031@gmail.com
SMTP_PASSWORD=euof txyi wgwb axiz

// Database
DB_NAME=db
DB_USER=root
DB_PASSWORD=@123

// ADMIN
ADMIN_PASSWORD=12345678
ADMIN_FIRST_NAME='Vu'
ADMIN_LAST_NAME='Quoc'
ADMIN_EMAIL='vkq265@gmail.com'
ADMIN_PHONE='0919309031'
ADMIN_BIRTH='2003-08-28'

// Google
vnp_TmnCode=NX64F3UU
vnp_HashSecret=5I0ND3HNOMOAPPUB447DUWJ0PXT1QB6H
vnp_Url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
vnp_ReturnUrl=http://localhost:3000/cart/payment-result/vnpay-return
```

#### Frontend .env
```bash
PORT=3000
REACT_APP_API_URL=http://localhost:3001/api/v1
REACT_APP_BASE_URL=http://localhost:3000
PUBLIC_URL="/"
```

## Step 3: Initialize the database
To create your database schema at the first, run:

```bash
INIT_DATABASE=true npm start
```
Ensure that your MySQL server is installed, running, and accessible using the credentials in your .env file.

Step 4: Start the project
To start the project, use the following command:

```bash
npm start
```

This command will run both the frontend and backend servers.
