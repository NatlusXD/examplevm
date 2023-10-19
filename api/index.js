import express from 'express';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import Message from './models/MessageModel.js';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import cors from 'cors';
import { db } from './db.js';
import mongoose from 'mongoose';
//import server from "express/lib/application.js";
import { Server } from 'socket.io';

const app = express();
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import {createProxyMiddleware} from "http-proxy-middleware";
import {admin} from "./controllers/admin.js";
const server = http.createServer(app);

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use('/admin', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: {
    '^/admin': '/admin' // If your admin panel is served from /admin route
  }
}));

db.on('error', console.error.bind(console, 'Ошибка подключения к базе данных MongoDB:'));
db.once('open', () => {
  console.log('Подключение к базе данных MongoDB успешно.');
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/upload');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let connectedClients = 0;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.setMaxListeners(20);

io.on('connection', (socket) => {
  if (connectedClients === 0) {
    console.log('A user connected');
  }
  connectedClients++;

  socket.on('chat message', (msg) => {
    console.log(`Message from BigGamingGamer: ${msg.text}`);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    connectedClients--;

    if (connectedClients === 0) {
      console.log('A user disconnected');
    }
  });

  process.stdin.on('data', (data) => {
    const command = data.toString().trim();

    if (command.startsWith('sendToClients')) {
      const message = command.substring('sendToClients'.length).trim();
      io.emit('chat message', { text: message, sender: 'server' });
    } else {
      console.log('Unknown command');
    }
  });
});

app.get('/admin', admin, (req, res) => {
  res.send('');
});

app.post("/api/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.post('/api/saveMessage', async (req, res) => {
  const { text } = req.body;

  try {
    const newMessage = new Message({ text });
    await newMessage.save();
    console.log('Сообщение успешно сохранено в базе данных');
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при сохранении сообщения:', error);
    res.status(500).json({ error: 'Ошибка при сохранении сообщения' });
  }
});


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use(express.static(path.join(__dirname, '../client/build')))

//app.use('/admin', createProxyMiddleware({ target: 'http://localhost:3000', changeOrigin: true }));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

server.listen(8800, () => {
  console.log("Connected!");
});
