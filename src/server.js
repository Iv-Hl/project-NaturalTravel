import express from "express";
import helmet from "helmet";
import "dotenv/config";
import { errors } from "celebrate";
import cookieParser from "cookie-parser";
import { connectMongoDB } from "./db/connectMongoDB.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";
import {
  authRouter,
  usersRouter,
  categoriesRouter,
  storiesRouter,
} from "./routes/index.js";
import { createCorsMiddleware } from "./middleware/corsMiddleware.js";

const PORT = process.env.PORT ?? 3000;

const app = express();

app.use(createCorsMiddleware(process.env.CORS_ORIGINS));
app.use(helmet());
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/stories", storiesRouter);
app.use("/user", usersRouter);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
