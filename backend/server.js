// Für Webserver und REST-API 
const express = require("express");
// Anfragen vom Frontend ans Backend
const cors = require("cors");
// Express-Anwendung erstellen
const app = express();

app.use(cors());
// Erlaubt Server, JSON-Daten aus Requests zu lesen
app.use(express.json());

// Test-Endpunkt zum Prüfen, ob das Backend läuft
app.get("/api/test", (req, res) => {
    res.json({
        message: "Backend läuft!"
    });
});


// Gibt aktuell vorhandene Meetings zurück
// Momentan nur Testdaten, später die Daten aus MongoDB
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

// Erstellt ein neues Meeting
// req.body enthält die JSON-Daten, die vom Frontend geschickt werden

app.post("/api/meetings", (req, res) => {
    const newMeeting = req.body;

    res.status(201).json({
        message: "Meeting wurde erstellt",
        meeting: newMeeting
    });
});
// Startet den Server auf Port 3000
app.listen(3000, () => {
    console.log("Server läuft auf Port 3000");
});