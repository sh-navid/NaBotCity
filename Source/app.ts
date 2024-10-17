// import fs from 'fs';
import http from 'http';
import path from 'path';
import cors from 'cors';
import { Server } from 'socket.io';
import express, { Application, Request, Response } from "express";
import { ServerConfig } from "./Infrastructure/Configs/server.config";

const app: Application = express();
const port = ServerConfig.Port;

const server = http.createServer(app);
const io = new Server(server);


const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));


app.get("/", (req: Request, res: Response) => {
  res.send("Server is up");
});


// FIXME: not a clean solution
app.get('/download/:name', (req, res) => {
  const { name } = req.params; // FIXME: validate this
  const filePath = path.join(__dirname, `Presentation/Assets/Files/${name}.glb`);

  // if (!fs.existsSync(filePath)) {
  //   return res.status(404).send('File not found.');
  // }

  res.download(filePath, `${name}.glb`, (err) => {
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