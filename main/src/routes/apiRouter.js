import express from "express";
import { store, Book } from "../book.js";
import { storage, fileFilter } from "../middleware/file.js";
import multer from "multer";
import { STORAGE_URL } from "../config.js";
import redis from "redis";

export const router = express.Router();

const client = redis.createClient({ url: STORAGE_URL });

(async () => {
  await client.connect();
})();

const storeRedis = {};

router.get("/:id/download", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const book = books.find((el) => el.id === id);

  if (!book) {
    res.status(404);
    res.json("404 | страница не найдена");

    return;
  }

  res.download(book.fileBook.path);
});

router.get("/:id", async (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const book = books.find((el) => el.id === id);

  if (!book) {
    res.status(404);
    res.json("404 | страница не найдена");

    return;
  }

  try {
    const count = await client.incr(id);
    res.json({ book: book, bookId: id, count: count });
  } catch (e) {
    console.log(e);
    res.statusCode(500).json({ errcode: 500, errmsg: "Ошибка redis" });
  }
});

router.get("/", (req, res) => {
  const { books } = store;
  res.json(books);
});

router.post(
  "/",
  multer({ storage: storage, fileFilter: fileFilter }).fields([
    { name: "fileCover", maxCount: 1 },
    { name: "fileBook", maxCount: 1 },
  ]),
  (req, res, next) => {
    const filedata = req.files["fileBook"];
    const imagedata = req.files["fileCover"];

    if (!filedata) {
      res.json("Ошибка при загрузке файла");
      return;
    }

    const { books } = store;
    const { title, desc, authors } = req.body;
    const fileName = filedata.originalname;

    const newBook = new Book(
      title,
      desc,
      authors,
      imagedata,
      fileName,
      filedata
    );
    books.push(newBook);

    res.status(201);

    res.json("Файл загружен");
  }
);

router.put("/:id", (req, res) => {
  const { books } = store;
  const { title, desc, authors, favorite, fileCover, fileName } = req.body;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx !== -1) {
    books[idx] = {
      ...books[idx],
      title,
      desc,
      authors,
      favorite,
      fileCover,
      fileName,
    };

    res.json(books[idx]);
  } else {
    res.status(404);
    res.json("404 | страница не найдена");
  }
});

router.delete("/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx === -1) {
    res.status(404);
    res.json("404 | страница не найдена");
    return;
  }

  books.splice(idx, 1);
  res.json("ok");
});
