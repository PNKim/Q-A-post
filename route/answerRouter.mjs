import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateAnswer } from "../validate/validateAnswer.mjs";

const answersRouter = Router();

answersRouter
  .post("/questions/:id/answers", [validateAnswer], async (req, res) => {
    const questionId = req.params.id;
    const newAnswer = {
      ...req.body,
      question_id: questionId,
      created_at: new Date(),
      updated_at: new Date(),
    };

    try {
      await connectionPool.query(
        `insert into answers(question_id, content, created_at, updated_at) values($1, $2, $3, $4)`,
        [
          newAnswer.question_id,
          newAnswer.content,
          newAnswer.created_at,
          newAnswer.updated_at,
        ]
      );
      return res.status(201).json({
        Created: "Answer created successfully.",
      });
    } catch (e) {
      return res.status(500).json({
        message: "Server could not create question because database connection",
      });
    }
  })
  .post("/answers/:id/upvote", async (req, res) => {
    const questionId = req.params.id;
    try {
      const upvote = await connectionPool.query(
        `insert into answer_votes(answer_id, vote) values($1, 1)`,
        [questionId]
      );

      return res.status(200).json({
        OK: "Successfully upvoted the answer.",
      });
    } catch (e) {
      return res.status(500).json({
        message: "Server could not read answer because database connection",
      });
    }
  })
  .post("/answers/:id/dwonvote", async (req, res) => {
    const questionId = req.params.id;
    try {
      const downvote = await connectionPool.query(
        `insert into answer_votes(answer_id, vote) values($1, -1)`,
        [questionId]
      );
      return res.status(200).json({
        OK: "Successfully downvoted the answer.",
      });
    } catch (e) {
      return res.status(500).json({
        message: "Server could not read answer because database connection",
      });
    }
  })
  .get("/questions/:id/answers", async (req, res) => {
    const questionId = req.params.id;
    try {
      const answerFromQuestionId = await connectionPool.query(
        `select * from answers where question_id=$1`,
        [questionId]
      );
      if (answerFromQuestionId.rows.length === 0) {
        return res.status(404).json({
          "Not Found": "Question not found",
        });
      }
      return res.status(200).json({
        OK: "Successfully retrieved the answers.",
        data: answerFromQuestionId.rows,
      });
    } catch (e) {
      return res.status(500).json({
        message: "Server could not read question because database connection",
      });
    }
  });

export default answersRouter;
