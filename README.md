# Backend Project

Node.js + Express.js backend with MongoDB Atlas integration and a scalable architecture.

## Features

- Express server with secure middleware: `helmet`, `cors`, `morgan`
- MongoDB Atlas connectivity via `mongoose`
- Clean folder structure: `routes/`, `controllers/`, `models/`, `middleware/`, `config/`
- Mongoose models for `User`, `Client`, and `Project`
- Development auto-reload with `nodemon`

## Setup

1. Copy `.env.example` to `.env`
2. Set `MONGODB_URI` to your MongoDB Atlas connection string
3. Run `npm install`
4. Run `npm run dev`

## API Endpoints

- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

- `GET /api/clients`
- `GET /api/clients/:id`
- `POST /api/clients`
- `PUT /api/clients/:id`
- `DELETE /api/clients/:id`

- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
