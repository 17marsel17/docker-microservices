import express from "express";
import redis from "redis";
import { STORAGE_URL } from "../config.js";

export const router = express.Router();
const client = redis.createClient({ url: STORAGE_URL });

(async () => {
  await client.connect();
})();

router.post("/:bookId/incr", async (req, res) => {
  const { bookId } = req.params;

  console.log('bookId', bookId);

  try {
    const count = await client.incr(bookId);

    console.log('count', count);
    res.json({ bookId: bookId, count: count });
  } catch (e) {
    console.log(e);
    res.statusCode(500).json({ errcode: 500, errmsg: "Ошибка redis" });
  }
});

router.get("/:bookId", async (req, res) => {
  const { bookId } = req.params;

  const count = await client.get(bookId);

  res.json({
    bookId: bookId,
    count: count,
  });
});
