# user-authentication-api

User authentication project implementation using Node.js, MongoDB and Express.js task by Innobyte Solution

## USER GUIDE LINK OR HANDBOOK TO RUN API ON LOCAL MACHINE:

- [link for user guide of api](https://drive.google.com/file/d/13mh_pW4f_8d9_6lJSIylaJdH8nUlK7_u/view?usp=drive_link)

This project implements a user authentication system using **Node.js**, **MongoDB**, and **Express.js**. It provides a basic authentication flow for user registration, login, profile management, and email verification.

### Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Testing](#testing)

---

## Project Overview

This is a user authentication API built using **Node.js**, **Express.js**, and **MongoDB**. It supports the following features:

- **User Sign Up**: Allows new users to register with basic details like name, email, username, and password.
- **User Login**: Allows users to authenticate using their username/email and password.
- **JWT Authentication**: After logging in, a JSON Web Token (JWT) is issued for session management.
- **Profile Management**: Users can access their profile data after logging in.
- **Email Verification**: A verification email is sent after registration to confirm the user's email address.
- **Sign Out**: Users can sign out, invalidating the JWT.

---

## Features

- Secure password hashing with **bcrypt**.
- Authentication via **JWT** (JSON Web Tokens).
- Email verification and activation via **Nodemailer**.
- Validating user input and providing best response using Error Hander and formated response

---

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Email Service**: Nodemailer
- **Password Hashing**: bcryptjs
- **Environment Configuration**: dotenv
- **Error Handling**: Custom Error Handler

---

## Getting Started

Follow these steps to get your development environment set up for this project.

### Prerequisites

Before you begin, ensure that you have the following software installed on your local machine:

- **Node.js** and **npm** (Node Package Manager) - [Install Node.js](https://nodejs.org/)
- **MongoDB** - [Install MongoDB](https://www.mongodb.com/try/download/community)
- **Postman** or **cURL** for testing API endpoints (optional).

### Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/Manish0045/user-auth-services-api.git
   cd user-auth-services-api
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the project and add the following environment variables:

   ```bash
   PORT=Your-port-number
   MONGO_URI=your-mongodb-connection-string
   DB_NAME=user-auth
   ACCESS_TOKEN_SECRET=your-secret-key
   CORS_ORIGIN=http://localhost:3000 or any specific url you want to whitelist or accessible
   MAIL_HOST=smtp.mailtrap.io
   MAIL_PORT=587
   MAIL_USER=your-mailtrap-username
   MAIL_PASSWORD=your-mailtrap-password
   ```

   - `MONGO_URI`: MongoDB connection string.
   - `ACCESS_TOKEN_SECRET`: JWT secret key for signing tokens.
   - `CORS_ORIGIN`: The origin URL for CORS requests.
   - `MAIL_*`: Credentials for sending verification emails (use services like Mailtrap for testing).

### Configuration

- **MongoDB**: Ensure that your MongoDB instance is running. You can either use a local instance or a cloud-based MongoDB service like **MongoDB Atlas**.
- **Mail Service**: Configure your email service provider. For local development, you can use services like **Mailtrap** for testing email sending.

### Running the Project

After installation and configuration, you can start the project by running the following command:

```bash
   npm start
```

---

## API Endpoints

### Sign Up

- `Endpoint`: /api/signup
- `Method`: POST
- `Description`: Registers a new user and sends a confirmation email.
- `Request Body`:

  ```
     {
        "username": "exampleuser",
        "email": "example@example.com",
        "password": "securepassword"
     }
  ```

- `Sample Response`:

  ```
   {
      "stausCode": 201,
      "data": {
         "_id": "676282f910346b2665dcc932",
         "username": "exampleuser",
         "email": "example@example.com"
      },
      "message": "User created successfully",
      "success": true
   }
  ```

- `Sample Error Reponse`

  ```
  {
     "statusCode": 409,
     "message": "Username or Email already exists!",
     "success": false
  }
  ```

### Sign In

- `Endpoint`: /api/login
- `Method`: POST
- `Description`: Registers a new user and sends a confirmation email.
- `Request Body`:

  ```
     {
        "email": "example@example.com",
        "password": "securepassword"
     }
  ```

- `Sample Response`:

  ```
   {
      "stausCode": 200,
      "data": {
         "email": " example@example.com",
         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzYyODJmOTEwMzQ2YjI2NjVkY2M5MzIiLCJpYXQiOjE3MzQ1MDk0NTN9.5aAdRURPed5aW6HCjPFxe6sBZi8R_qudzJ-p-M_vYm4"
      },
      "message": "Logged in successfully!",
      "success": true
   }
  ```

- `Sample Error Reponse`:

  ```
     {
      "statusCode": 404,
      "message": "Invalid username or email",
      "success": false
     }
  ```

- `Unverified account error`:

  ```
     {
      "statusCode": 403,
      "message": "Please verify your email to login!",
      "success": false
     }
  ```

### Profile

- `Endpoint`: /api/profile
- `Method`: GET
- `Description`: Registers a new user and sends a confirmation email.
- `Headers`:

  ```
     {
        "authorization":"Bearer your-jwt-token"
     }
  ```

- `Sample Response`:

  ```
   {
      "stausCode": 200,
      "data": {
         "profile": [
               {
                  "_id": "676282f910346b2665dcc932",
                  "username": "username",
                  "email": " example@example.com",
                  "isVerified": true,
                  "userRole": "user"
               }
         ]
      },
      "message": "Profile fetched successfully",
      "success": true
   }

  ```

- `Sample Error Reponse`:

  ```
     {
         "statusCode": 400,
         "message": "Token is missing or malformed",
         "success": false
      }
  ```

  ```
   {
      "statusCode": 401,
      "message": "Invalid token",
      "success": false
   }
  ```

- `Email Confirmation`:

  - After a successful signup, the system sends a confirmation email to the provided email address.
  - Example email content:

  ```
     Subject: Registration Confirmation

     Body:
        Dear {username},
        Thank you for registering with us! Please activate your account by clicking the link below:
        Activate My Account <link>
        To activate your account
        If you did not create an account, no action is required.
        If you have any questions, feel free to contact our support team at {support team email or contact}.
  ```

---

## Error Handling

- User custom error handler to handle various error which extends existing error handler
- Follows specific and organized way to handle error

#### Error handling file code

```
   class CustomError extends Error {
      constructor(statusCode = 500, message = "Something went wrong") {
         super(message);
         this.statusCode = statusCode;
         this.message = message;
         this.success = false;
      }
   };

   module.exports = CustomError;
```

#### Usage Sample

```
   throw new CustomError(statusCode, message);
```

#### Sample Responses Error

```
{
   "status": "Error",
   "statusCode": 401,
   "message": "Unauthorized : Invalid Access Token!"
}
```

---

## Testing

- For testing used POSTMAN where each cate tested for api's following best practices
