"use strict";

import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {

    let x: string = "prova";

    res.send('Hello a World!');
    console.log("Response sent");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});