
import express from 'express'

export const router = express.Router();

router.post('/login', (req, res) => {
    const user = {
        "id": "1",
        "mail": "test@mail.ru"
    };

    res.status(201);
    res.json(user);
})