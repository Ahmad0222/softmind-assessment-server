
# 🗂️ Task Management Backend – Node.js API

A modular and secure Node.js backend built with Express, MongoDB, and JWT for authentication. This API allows user registration/login, task management, file uploads, and tracks task history – perfect for integration with a frontend task tracking system.

---

## 🚀 Features

- ✅ User authentication (JWT-based)
- 📂 Task creation, editing, and deletion
- 🔁 Task history tracking
- 📤 File upload support
- 🔒 Role-based protected routes
- 🧱 Modular controller-service architecture
- 🛡️ Secure with CORS, Helmet & environment configs
- 🧾 Error handling and request logging

---

## 📁 Folder Structure

```
backend/
├── config/            # App configs (DB, JWT)
├── controllers/       # Route handlers
├── middleware/        # Auth, upload, error handlers
├── models/            # Mongoose schemas
├── routes/            # API route definitions
├── utils/             # Utility functions (logger, etc.)
├── .env               # Environment variables
├── server.js          # App entry point
└── package.json       # Dependencies
```

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Auth**: JSON Web Tokens (JWT)
- **File Upload**: Multer
- **Others**: dotenv, helmet, cors, morgan

---

## 📦 Installation

### 1. Clone the repo

```bash
git clone [https://github.com/your-username/task-manager-backend.git](https://github.com/Ahmad0222/softmind-assessment-server.git)
cd softmind-assessment-server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/task-manager
ACCESS_TOKEN_SECRET=your_jwt_secret_key
```

---

## ▶️ Running the Server

### Development mode (with auto-reload)

```bash
npm run dev
```

### Production mode

```bash
npm start
```

---

## 🔐 Authentication

This API uses JWT-based authentication. Include the token in request headers for protected routes:

```http
Authorization: Bearer <your_token>
```

---

## 🧪 API Endpoints Overview

### 🔑 Auth Routes

| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| POST   | `/api/auth/register` | Register new user    |
| POST   | `/api/auth/login`    | Login & receive JWT  |

---

### 👤 User Routes

| Method | Endpoint         | Description             |
|--------|------------------|-------------------------|
| GET    | `/api/users/`    | Get all users (admin)   |
| GET    | `/api/users/:id` | Get single user by ID   |

---

### ✅ Task Routes

| Method | Endpoint           | Description                 |
|--------|--------------------|-----------------------------|
| GET    | `/api/tasks/`      | Get all tasks               |
| POST   | `/api/tasks/`      | Create a new task           |
| PUT    | `/api/tasks/:id`   | Update an existing task     |
| DELETE | `/api/tasks/:id`   | Delete a task               |

---

### 🕒 Task History (Auto-Logged)

When a task is updated or deleted, a record is created automatically in `TaskHistory`.

---

### 📁 File Upload

Use `multipart/form-data` and send your file to the endpoint that uses Multer (`upload.js` middleware). Files are stored in the `uploads/` directory.

---

## 🧱 Future Improvements

- API documentation with Swagger
- Admin dashboard and permissions
- Dockerized deployment
- Unit & integration tests

---

## 🙋‍♂️ Contributing

Contributions are welcome! Feel free to fork the repo and submit a PR.

---

## 🧾 License

This project is licensed under the MIT License – you're free to use it for personal or commercial projects.

---

## ✍️ Author

**Ahmad Nawaz**  
🔗 [Portfolio](https://ahmad-software-engineer.vercel.app)  
📧 [Email](mailto:your-email@example.com)

---

> Made with ❤️ using Node.js & MongoDB
