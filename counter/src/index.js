import express from "express";
import { PORT } from "./config.js";
import { router as counterRouter } from "./routes/counterRouter.js";
import { logger } from "./middleware/logger.js";

const app = express();

app.use(express.json());

app.use(logger);

app.use("/counter", counterRouter);

app.listen(PORT);
