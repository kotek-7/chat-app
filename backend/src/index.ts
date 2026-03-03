import "dotenv/config";
import cors from "cors";
import express from "express";
import { z } from "zod";
import { pool } from "./db";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/rooms", async (_req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id, name FROM rooms ORDER BY id ASC"
    );
    res.json({ rooms: result.rows });
  } catch (error) {
    next(error);
  }
});

app.get("/api/messages", async (req, res, next) => {
  const querySchema = z.object({
    limit: z.coerce.number().int().min(1).max(200).optional(),
  });

  try {
    const parsed = querySchema.parse(req.query);
    const limit = parsed.limit ?? 50;

    const result = await pool.query(
      `SELECT id, room_id AS "roomId", user_name AS "userName", text, created_at AS "createdAt"
       FROM messages
       WHERE room_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      ["global", limit]
    );

    res.json({ messages: result.rows.reverse() });
  } catch (error) {
    next(error);
  }
});

app.post("/api/messages", async (req, res, next) => {
  const bodySchema = z.object({
    userName: z.string().trim().min(1).max(40),
    text: z.string().trim().min(1).max(500),
  });

  try {
    const body = bodySchema.parse(req.body);

    const result = await pool.query(
      `INSERT INTO messages (room_id, user_name, text)
       VALUES ($1, $2, $3)
       RETURNING id, room_id AS "roomId", user_name AS "userName", text, created_at AS "createdAt"`,
      ["global", body.userName, body.text]
    );

    res.status(201).json({ message: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        error: {
          code: "BAD_REQUEST",
          message: "入力が不正です",
          details: err.issues,
        },
      });
    }

    console.error(err);
    return res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "サーバーエラーが発生しました",
      },
    });
  }
);

app.listen(port, () => {
  console.log(`backend listening on :${port}`);
});
