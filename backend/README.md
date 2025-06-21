# 🧠 Chatbot Backend

This is the backend service for a chatbot project. It handles user registration, authentication via JWT, and file uploads. Built with **Node.js**, **Express**, **MongoDB**, and deployed on **Render**.

---

## 🌐 Live API

https://chatbot-2-k0xs.onrender.com/

---

## 🔐 User Registration Endpoint

**POST** `/api/v1/users/register`  
Use this endpoint to register a new user from the frontend.

### ✅ Request Format

- **Content-Type:** `application/json`(in Headers)
- **Body:**

```json
{
  "fullName": "Anand",
  "email": "anand@example.com",
  "password": "StrongPassword123",
  "username":"anand"
}
```




## 🚀 Getting Started (For Frontend Integration Only)

To consume this backend:

1. Make sure your frontend hits the correct endpoint:  
   **`https://chatbot-2-k0xs.onrender.com/api/v1/users/register`**

2. Send valid fields (`fullName`, `email`, `password`, `username`)  [`email` and `username` must be unique in each post request]

---


## 🛡 Auth Note

JWT will be returned after successful registration (if implemented). Store this in localStorage or cookies on the frontend.

---

## 📄 Environment (For Using and Contributing in Backend)

Use .env.sample file and change its name to .env
---

## 🪪 License

MIT License

---
