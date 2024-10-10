import express, { Application, Request, Response } from 'express';

const app: Application = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello!!!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});