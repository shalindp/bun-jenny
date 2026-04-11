import express from "express";
import cors from "cors";
import {Jenny} from "./jenny/jenny.ts";
import {GRAMMAR_CHECK_PROMPT} from "./jenny/prompts.ts";

const app = express();
const PORT = 3000;
const jenny = new Jenny();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({status: "ok"});
});

app.post("/prompt", async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            res.status(400).json({ error: "prompt is required" });
            return;
        }
        const result = await jenny.promptAsync(prompt, GRAMMAR_CHECK_PROMPT);
        res.json(result);
    } catch (error) {
        console.error("/prompt error:", error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Internal error" });
    }
});

app.get("/init", async (_req, res) => {
    try {
        const result = await jenny.initialiseAsync();
        res.json(result);
    } catch (error) {
        console.error("/init error:", error);
        res.status(500).json({ error: error instanceof Error ? error.message : "Internal error" });
    }
});

app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
});