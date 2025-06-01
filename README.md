# 💬 Real-Time Chat App (React + Node.js + MongoDB + RabbitMQ)

A full-stack **real-time chat application** built using **React**, **Node.js**, **MongoDB**, and **RabbitMQ**. This app ensures reliable message delivery — even when a user is offline — using **RabbitMQ** as a message broker.

---

## 🧰 Tech Stack

### 🔹 Frontend
- React
- Axios
- Socket.IO Client
- Tailwind CSS / Bootstrap (optional)

### 🔹 Backend
- Node.js + Express.js
- MongoDB (Mongoose ODM)
- Socket.IO
- RabbitMQ (via `amqplib`)
- JWT (Authentication)
- Bcrypt (Password Hashing)

---

## 🚀 Features

- ✅ User Registration & Login (JWT)
- ✅ Real-time 1-on-1 Messaging
- ✅ Offline Message Queueing via RabbitMQ
- ✅ Persistent Chat History (MongoDB)
- ✅ Online/Offline User Status
- ✅ Scalable Microservice-Friendly Backend
- ✅ Fully Responsive UI

---

## 🔄 How RabbitMQ Works in This Project

RabbitMQ is used to handle **offline messaging** or decoupled communication:

1. When a message is sent:
   - It is **published** to a RabbitMQ queue.
2. A **consumer service** listens to the queue.
3. If the recipient is online → the message is pushed via **Socket.IO**
4. If offline → the message is stored in **MongoDB** and delivered when the user comes online.

This setup improves reliability and **decouples message sending from delivery**.

---

## 📸 Screenshots

| Login Page | Chat Interface |
|------------|----------------|
| ![Login](screenshots/login.png) | ![Chat](screenshots/chat.png) |

---

## 🧩 System Architecture

```txt
CLIENT (React + Socket.IO Client)
    ↓
SERVER (Node.js + Express + Socket.IO)
    ↓
RabbitMQ (Publisher - Queue - Consumer)
    ↓
MongoDB (Store messages)
    ↓
Socket.IO (Deliver messages)
