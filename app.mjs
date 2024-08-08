import express from "express";
import questionsRouter from "./route/questionsRouter.mjs";
import answersRouter from "./route/answerRouter.mjs";

const app = express();
const port = 4000;

app.use(express.json());
app.use("/questions", questionsRouter);
app.use("/", answersRouter);

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
