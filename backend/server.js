const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
    res.json({
        message: "Backend läuft!"
    });
});


app.get("/api/meetings", (req, res) => {
    const meetings = [
        {
            id: 1,
            title: "Erstes Betreuungsgespräch",
            date: "2026-09-07",
            feedback: "Prototyp weiter ausarbeiten"
        },
        {
            id: 2,
            title: "Zweites Betreuungsgespräch",
            date: "2026-09-14",
            feedback: "ER-Diagramm überarbeiten"
        }
    ];

    res.json(meetings);
});

app.post("/api/meetings", (req, res) => {
    const newMeeting = req.body;

    res.status(201).json({
        message: "Meeting wurde erstellt",
        meeting: newMeeting
    });
});

app.listen(3000, () => {
    console.log("Server läuft auf Port 3000");
});