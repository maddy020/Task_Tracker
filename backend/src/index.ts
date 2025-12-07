import express from "express";
import cors from "cors";
import routes from "./routes/index";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use("/api", routes);

app.listen(PORT, async () => {
  console.log(`Server is running at the port ${PORT}`);
});
export default app;
