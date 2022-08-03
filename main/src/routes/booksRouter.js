import express from "express";
import { store, Book } from "../book.js";
import { storage, fileFilter } from "../middleware/file.js";
import multer from "multer";
import { COUNTER_URL } from "../config.js";
import axios from 'axios';

export const router = express.Router();

router.get("/:id/download", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const book = books.find((el) => el.id === id);

  if (!book) {
    res.render("error/404", {
      title: "404 | страница не найдена",
    });
  }

  res.download(book.fileBook[0].path);
});

router.get("/", (req, res) => {
  const { books } = store;
  res.render("books/index", {
    title: "Список книг",
    books: books,
  });
});

router.get("/create", (req, res) => {
  res.render("books/create", {
    title: "Добавить книгу",
    book: {},
  });
});

router.get("/:id", async (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const book = books.find((el) => el.id === id);

  if (!book) {
    res.render("error/404", {
      title: "404 | страница не найдена",
    });
  }

  const url = `${COUNTER_URL}/counter/${id}/incr`;
  console.log('url', url);
  axios.post(url).then((counterRes) => {
    console.log('counterRes', counterRes.data);

    res.render("books/view", {
      title: "Просмотр книги",
      book: book,
      counter: counterRes.data.count,
    });
  });

});

router.post(
  "/create",
  multer({ storage: storage, fileFilter: fileFilter }).fields([
    { name: "fileCover", maxCount: 1 },
    { name: "fileBook", maxCount: 1 },
  ]),
  (req, res, next) => {
    const filedata = req.files["fileBook"];
    const imagedata = req.files["fileCover"];

    if (!filedata) {
      res.render("error/loadError", {
        title: "Не удалось загрузить файлы",
      });

      return;
    }

    const { books } = store;
    const { title, desc, authors, favority } = req.body;
    const fileName = filedata.originalname;

    const newBook = new Book(
      title,
      desc,
      authors,
      favority,
      imagedata,
      fileName,
      filedata
    );
    books.push(newBook);

    res.redirect("/api/books");
  }
);

router.get("/update/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx === -1) {
    res.render("error/404", {
      title: "404 | страница не найдена",
    });
  }

  res.render("books/update", {
    title: "Редактирование книги",
    book: books[idx],
  });
});

router.post(
  "/update/:id",
  multer({ storage: storage, fileFilter: fileFilter }).fields([
    { name: "fileCover", maxCount: 1 },
    { name: "fileBook", maxCount: 1 },
  ]),
  (req, res) => {
    const { books } = store;
    const { title, desc } = req.body;
    const { id } = req.params;
    const idx = books.findIndex((el) => el.id === id);

    if (idx === -1) {
      res.render("error/404", {
        title: "404 | страница не найдена",
      });
    }

    books[idx] = {
      ...books[idx],
      title,
      desc,
    };

    res.redirect(`error/api/books/${id}`);
  }
);

router.post("/delete/:id", (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx === -1) {
    res.render("error/404", {
      title: "404 | страница не найдена",
    });
  }

  books.splice(idx, 1);
  res.redirect("/api/books");
});
