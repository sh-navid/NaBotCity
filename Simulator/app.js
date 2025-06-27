/* */
import http from 'http';
import path from 'path';
import cors from 'cors';
import { Server } from 'socket.io';
import { ServerConfig } from "./Configs/server.config.js";
import express from "express";

const app = express();
const port = ServerConfig.Port;
const server = http.createServer(app);
const io = new Server(server);

const corsOptions = {
  origin: 'http://localhost:4411',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Server is up");
});

// Validate file parameter to prevent directory traversal
app.get('/download/:name', (req, res) => {
  const { name } = req.params; 
  const sanitizedFileName = path.basename(name); // Basic sanitization
  const filePath = path.join(process.cwd(), `Assets/Files/${sanitizedFileName}.glb`);

  res.download(filePath, `${sanitizedFileName}.glb`, (err) => {
    if (err) {
      console.error('Error downloading the file:', err);
      res.status(500).send('Could not download the file.');
    }
  });
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});