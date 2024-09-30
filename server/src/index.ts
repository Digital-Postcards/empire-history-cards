import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = process.env.PORT || 3002;

app.get("/healthcheck", (req: Request, res: Response) => {
  res.json({ message: "API is operational" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});