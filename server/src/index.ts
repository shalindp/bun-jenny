import express from "express";
import {Jenny} from "./jenny/jenny.ts";

const app = express();
const PORT = 3000;

app.get("/health", (_req, res) => {
    res.json({status: "ok"});
});

app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    const jenny = new Jenny();
    await jenny.initialiseAsync()
});