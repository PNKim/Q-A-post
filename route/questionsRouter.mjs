import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import { validateCreateQuestion } from "../validate/validateQuestion.mjs";
import { validateEditQuestion } from "../validate/validateQuestion.mjs";

const questionsRouter = Router();

questionsRouter
  .post("/", [validateCreateQuestion], async (req, res) => {
    const newQuestion = {
      ...req.body,
      created_at: new Date(),
      updated_at: new Date(),
    };
    try {
      const a = await connectionPool.query(
        `insert into questions (title, description, category, created_at, updated_at) values ($1, $2, $3, $4, $5)`,
        [
          newQuestion.title,
          newQuestion.description,
          newQuestion.category,
          newQuestion.created_at,
          newQuestion.updated_at,
        ]
      );
      return res.status(201).json({
        Created: "Question created successfully.",
        data: a,
      });
    } catch (e) {
      return res.status(500).json({
        message: "Server could not create question because database connection",
      });
    }
  })
  .post("/:id/upvote", async (req, res) => {
    const questionId = req.params.id;
    try {
      const upvote = await connectionPool.query(
        `insert into question_votes(question_id, vote) values($1, 1)`,
        [questionId]
      );
      return res.status(200).json({
        OK: "Successfully upvoted the question.",
      });
    } catch (e) {
      return res.status(500).json({
        message: "Server could not read question because database connection",
      });
    }
  })
  .post("/:id/downvote", async (req, res) => {
    const questionId = req.params.id;
    try {
      const downvote = await connectionPool.query(
        `insert into question_votes(question_id, vote) values($1, -1)`,
        [questionId]
      );
      return res.status(200).json({
        OK: "Successfully downvoted the question.",
      });
    } catch (e) {
      return res.status(500).json({
        message: "Server could not read question because database connection",
      });
    }
  })
  .get("/", async (req, res) => {
    const title = req.query.title;
    const category = req.query.category;
    try {
      const getQuestion = await connectionPool.query(
        `select * from questions where
        (title=$1 or $1 is null or $1 = '') and (category=$2 or $2 is null or $2='')`,
        [title, category]
      );
      if (!getQuestion.rows) {
        return res.status(400).json({
          "Bad Request": "Invalid query parameters.",
        });
      }

      return res.status(200).json({
        OK: "Successfully retrieved the search results.",
        data: getQuestion.rows,
      });
    } catch (e) {
      return res.status(500).json({
        message: "Server could not read question because database connection",
      });
    }
  })
  .get("/:id", async (req, res) => {
    const questionId = req.params.id;
    try {
      const getQuestion = await connectionPool.query(
        `select * from questions where id=$1`,
        [questionId]
      );
      if (getQuestion.rows.length === 0) {
        return res.status(404).json({
          "Not Found": "Question not found",
        });
      }
      return res.status(200).json({
        OK: "Successfully retrieved the question.",
        data: getQuestion.rows,
      });
    } catch (e) {
      return res.status(500).json({
        message: "Server could not read question because database connection",
      });
    }
  })
  .put("/:id", [validateEditQuestion], async (req, res) => {
    const questionId = req.params.id;
    const newQuestion = {
      ...req.body,
      id: questionId,
      updated_at: new Date(),
    };

    try {
      const editQuestion = await connectionPool.query(
        `update questions set title = $2 , description = $3 , category = $4 , updated_at = $5 where id = $1`,
        [
          newQuestion.id,
          newQuestion.title,
          newQuestion.description,
          newQuestion.category,
          newQuestion.updated_at,
        ]
      );
      return res.status(200).json({
        OK: "Successfully updated the question.",
      });
    } catch (e) {
      return res.status(500).json({
        message: "Server could not read question because database connection",
      });
    }
  })
  .delete("/:id", async (req, res) => {
    const questionId = req.params.id;

    try {
      const deleteQuestion = await connectionPool.query(
        `delete from questions where id=$1`,
        [questionId]
      );
      if (deleteQuestion.rowCount === 0) {
        return res.status(404).json({
          "Not Found": "Question not found",
        });
      }
      return res.status(200).json({
        message: "Question and its answers deleted successfully.",
      });
    } catch (e) {
      return res.status(500).json({
        message: "Server could not read question because database connection",
      });
    }
  });

export default questionsRouter;
