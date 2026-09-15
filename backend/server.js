// Für Webserver und REST-API
const express = require("express");

// Erlaubt Anfragen vom Frontend an das Backend
const cors = require("cors");

// Verbindung zur PostgreSQL-Datenbank
const pool = require("./db");

// Express-Anwendung erstellen
const app = express();

// CORS aktivieren
app.use(cors());

// Erlaubt dem Server, JSON-Daten aus Requests zu lesen
app.use(express.json());


// Test-Endpunkt zum Prüfen, ob das Backend läuft
app.get("/api/test", (req, res) => {
    res.json({
        message: "Backend läuft!"
    });
});


// Gibt aktuell vorhandene Meetings zurück
// Momentan noch Testdaten, später kommen die Daten aus PostgreSQL
// Gibt alle Meetings aus der PostgreSQL-Datenbank zurück
app.get("/api/meetings", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM meetings ORDER BY date ASC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Meetings konnten nicht geladen werden"
        });
    }
});


// Erstellt ein neues Meeting
// Erstellt ein neues Meeting und speichert es in PostgreSQL
app.post("/api/meetings", async (req, res) => {
    const {
        projectId,
        createdById,
        title,
        date,
        notes,
        feedback,
        status
    } = req.body;

    // Prüft, ob alle Pflichtfelder vorhanden sind
    if (!projectId || !createdById || !title || !date || !status) {
        return res.status(400).json({
            message: "Bitte alle Pflichtfelder ausfüllen."
        });
    }

    // Erlaubt nur diese drei Statuswerte
    const allowedStatus = ["PLANNED", "COMPLETED", "CANCELLED"];

    if (!allowedStatus.includes(status)) {
        return res.status(400).json({
            message: "Ungültiger Meeting-Status."
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO meetings
            (project_id, created_by_id, title, date, notes, feedback, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                projectId,
                createdById,
                title,
                date,
                notes || null,
                feedback || null,
                status
            ]
        );

        res.status(201).json({
            message: "Meeting wurde erstellt",
            meeting: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        // PostgreSQL-Fehler für einen ungültigen Fremdschlüssel
        if (error.code === "23503") {
            return res.status(400).json({
                message: "Projekt oder Benutzer existiert nicht."
            });
        }

        res.status(500).json({
            message: "Meeting konnte nicht erstellt werden."
        });
    }
});


// Testet die Verbindung zur PostgreSQL-Datenbank
app.get("/api/db-test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "Datenbankverbindung funktioniert!",
            time: result.rows[0].now
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Datenbankverbindung fehlgeschlagen"
        });
    }
});

// Gibt ein einzelnes Meeting anhand seiner ID zurück
app.get("/api/meetings/:id", async (req, res) => {
    const meetingId = req.params.id;

    try {
        const result = await pool.query(
            "SELECT * FROM meetings WHERE id = $1",
            [meetingId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Meeting nicht gefunden."
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Meeting konnte nicht geladen werden."
        });
    }
});

// Aktualisiert ein bestehendes Meeting
app.patch("/api/meetings/:id", async (req, res) => {
    const meetingId = req.params.id;

    const {
        title,
        date,
        notes,
        feedback,
        status
    } = req.body;

    const allowedStatus = ["PLANNED", "COMPLETED", "CANCELLED"];

    if (status && !allowedStatus.includes(status)) {
        return res.status(400).json({
            message: "Ungültiger Meeting-Status."
        });
    }

    try {
        const result = await pool.query(
            `UPDATE meetings
            SET
                title = COALESCE($1, title),
                date = COALESCE($2, date),
                notes = COALESCE($3, notes),
                feedback = COALESCE($4, feedback),
                status = COALESCE($5, status)
            WHERE id = $6
            RETURNING *`,
            [
                title,
                date,
                notes,
                feedback,
                status,
                meetingId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Meeting nicht gefunden."
            });
        }

        res.json({
            message: "Meeting wurde aktualisiert.",
            meeting: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Meeting konnte nicht aktualisiert werden."
        });
    }
});

// Löscht ein Meeting anhand seiner ID
app.delete("/api/meetings/:id", async (req, res) => {
    const meetingId = req.params.id;

    try {
        const result = await pool.query(
            "DELETE FROM meetings WHERE id = $1 RETURNING *",
            [meetingId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Meeting nicht gefunden."
            });
        }

        res.json({
            message: "Meeting wurde gelöscht.",
            meeting: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Meeting konnte nicht gelöscht werden."
        });
    }
});

// Gibt alle Tasks aus der PostgreSQL-Datenbank zurück
app.get("/api/tasks", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM tasks ORDER BY deadline ASC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Tasks konnten nicht geladen werden."
        });
    }
});

// Erstellt einen neuen Task und speichert ihn in PostgreSQL
app.post("/api/tasks", async (req, res) => {
    const {
        projectId,
        meetingId,
        assigneeId,
        title,
        description,
        deadline,
        status
    } = req.body;

    // Pflichtfelder prüfen
    if (!projectId || !title || !status) {
        return res.status(400).json({
            message: "Bitte alle Pflichtfelder ausfüllen."
        });
    }

    // Erlaubte Statuswerte laut Datenbank
    const allowedStatus = ["OPEN", "IN_PROGRESS", "DONE"];

    if (!allowedStatus.includes(status)) {
        return res.status(400).json({
            message: "Ungültiger Task-Status."
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO tasks
            (project_id, meeting_id, assignee_id, title, description, deadline, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                projectId,
                meetingId || null,
                assigneeId || null,
                title,
                description || null,
                deadline || null,
                status
            ]
        );

        res.status(201).json({
            message: "Task wurde erstellt.",
            task: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        if (error.code === "23503") {
            return res.status(400).json({
                message: "Projekt, Meeting oder Benutzer existiert nicht."
            });
        }

        res.status(500).json({
            message: "Task konnte nicht erstellt werden."
        });
    }
});

// Gibt einen einzelnen Task anhand seiner ID zurück
app.get("/api/tasks/:id", async (req, res) => {
    const taskId = req.params.id;

    try {
        const result = await pool.query(
            "SELECT * FROM tasks WHERE id = $1",
            [taskId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task nicht gefunden."
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Task konnte nicht geladen werden."
        });
    }
});

// Aktualisiert einen bestehenden Task
app.patch("/api/tasks/:id", async (req, res) => {
    const taskId = req.params.id;

    const {
        assigneeId,
        title,
        description,
        deadline,
        status
    } = req.body;

    const allowedStatus = ["OPEN", "IN_PROGRESS", "DONE"];

    if (status && !allowedStatus.includes(status)) {
        return res.status(400).json({
            message: "Ungültiger Task-Status."
        });
    }

    try {
        const result = await pool.query(
            `UPDATE tasks
            SET
                assignee_id = COALESCE($1, assignee_id),
                title = COALESCE($2, title),
                description = COALESCE($3, description),
                deadline = COALESCE($4, deadline),
                status = COALESCE($5, status)
            WHERE id = $6
            RETURNING *`,
            [
                assigneeId,
                title,
                description,
                deadline,
                status,
                taskId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task nicht gefunden."
            });
        }

        res.json({
            message: "Task wurde aktualisiert.",
            task: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        if (error.code === "23503") {
            return res.status(400).json({
                message: "Benutzer existiert nicht."
            });
        }

        res.status(500).json({
            message: "Task konnte nicht aktualisiert werden."
        });
    }
});

// Löscht einen Task anhand seiner ID
app.delete("/api/tasks/:id", async (req, res) => {
    const taskId = req.params.id;

    try {
        const result = await pool.query(
            "DELETE FROM tasks WHERE id = $1 RETURNING *",
            [taskId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Task nicht gefunden."
            });
        }

        res.json({
            message: "Task wurde gelöscht.",
            task: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Task konnte nicht gelöscht werden."
        });
    }
});

// Gibt alle Milestones aus der PostgreSQL-Datenbank zurück
app.get("/api/milestones", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM milestones ORDER BY deadline ASC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Milestones konnten nicht geladen werden."
        });
    }
});

// Erstellt einen neuen Milestone und speichert ihn in PostgreSQL
app.post("/api/milestones", async (req, res) => {
    const {
        projectId,
        title,
        description,
        deadline,
        status
    } = req.body;

    // Pflichtfelder prüfen
    if (!projectId || !title || !deadline || !status) {
        return res.status(400).json({
            message: "Bitte alle Pflichtfelder ausfüllen."
        });
    }

    // Erlaubte Statuswerte laut Datenbank
    const allowedStatus = ["OPEN", "SUBMITTED", "APPROVED"];

    if (!allowedStatus.includes(status)) {
        return res.status(400).json({
            message: "Ungültiger Milestone-Status."
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO milestones
            (project_id, title, description, deadline, status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                projectId,
                title,
                description || null,
                deadline,
                status
            ]
        );

        res.status(201).json({
            message: "Milestone wurde erstellt.",
            milestone: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        if (error.code === "23503") {
            return res.status(400).json({
                message: "Projekt existiert nicht."
            });
        }

        res.status(500).json({
            message: "Milestone konnte nicht erstellt werden."
        });
    }
});

// Gibt einen einzelnen Milestone anhand seiner ID zurück
app.get("/api/milestones/:id", async (req, res) => {
    const milestoneId = req.params.id;

    try {
        const result = await pool.query(
            "SELECT * FROM milestones WHERE id = $1",
            [milestoneId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Milestone nicht gefunden."
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Milestone konnte nicht geladen werden."
        });
    }
});

// Aktualisiert einen bestehenden Milestone
app.patch("/api/milestones/:id", async (req, res) => {
    const milestoneId = req.params.id;

    const {
        title,
        description,
        deadline,
        status
    } = req.body;

    const allowedStatus = ["OPEN", "SUBMITTED", "APPROVED"];

    if (status && !allowedStatus.includes(status)) {
        return res.status(400).json({
            message: "Ungültiger Milestone-Status."
        });
    }

    try {
        const result = await pool.query(
            `UPDATE milestones
            SET
                title = COALESCE($1, title),
                description = COALESCE($2, description),
                deadline = COALESCE($3, deadline),
                status = COALESCE($4, status)
            WHERE id = $5
            RETURNING *`,
            [
                title,
                description,
                deadline,
                status,
                milestoneId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Milestone nicht gefunden."
            });
        }

        res.json({
            message: "Milestone wurde aktualisiert.",
            milestone: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Milestone konnte nicht aktualisiert werden."
        });
    }
});

// Löscht einen Milestone anhand seiner ID
app.delete("/api/milestones/:id", async (req, res) => {
    const milestoneId = req.params.id;

    try {
        const result = await pool.query(
            "DELETE FROM milestones WHERE id = $1 RETURNING *",
            [milestoneId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Milestone nicht gefunden."
            });
        }

        res.json({
            message: "Milestone wurde gelöscht.",
            milestone: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Milestone konnte nicht gelöscht werden."
        });
    }
});

// Gibt alle Sign-Offs aus der PostgreSQL-Datenbank zurück
app.get("/api/signoffs", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM sign_offs ORDER BY id ASC"
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Sign-Offs konnten nicht geladen werden."
        });
    }
});

// Erstellt einen neuen Sign-Off und speichert ihn in PostgreSQL
app.post("/api/signoffs", async (req, res) => {
    const {
        milestoneId,
        userId,
        decision,
        comment
    } = req.body;

    // Pflichtfelder prüfen
    if (!milestoneId || !userId || !decision) {
        return res.status(400).json({
            message: "Bitte alle Pflichtfelder ausfüllen."
        });
    }

    // Erlaubte Entscheidungen laut Datenbank
    const allowedDecisions = ["APPROVED", "REJECTED"];

    if (!allowedDecisions.includes(decision)) {
        return res.status(400).json({
            message: "Ungültige Sign-Off-Entscheidung."
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO sign_offs
            (milestone_id, user_id, decision, comment, signed_at)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
            RETURNING *`,
            [
                milestoneId,
                userId,
                decision,
                comment || null
            ]
        );

        res.status(201).json({
            message: "Sign-Off wurde erstellt.",
            signOff: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        if (error.code === "23503") {
            return res.status(400).json({
                message: "Milestone oder Benutzer existiert nicht."
            });
        }

        res.status(500).json({
            message: "Sign-Off konnte nicht erstellt werden."
        });
    }
});

// Gibt einen einzelnen Sign-Off anhand seiner ID zurück
app.get("/api/signoffs/:id", async (req, res) => {
    const signOffId = req.params.id;

    try {
        const result = await pool.query(
            "SELECT * FROM sign_offs WHERE id = $1",
            [signOffId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Sign-Off nicht gefunden."
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Sign-Off konnte nicht geladen werden."
        });
    }
});

// Aktualisiert einen bestehenden Sign-Off
app.patch("/api/signoffs/:id", async (req, res) => {
    const signOffId = req.params.id;

    const {
        decision,
        comment
    } = req.body;

    const allowedDecisions = ["APPROVED", "REJECTED"];

    if (decision && !allowedDecisions.includes(decision)) {
        return res.status(400).json({
            message: "Ungültige Sign-Off-Entscheidung."
        });
    }

    try {
        const result = await pool.query(
            `UPDATE sign_offs
            SET
                decision = COALESCE($1, decision),
                comment = COALESCE($2, comment),
                signed_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING *`,
            [
                decision,
                comment,
                signOffId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Sign-Off nicht gefunden."
            });
        }

        res.json({
            message: "Sign-Off wurde aktualisiert.",
            signOff: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Sign-Off konnte nicht aktualisiert werden."
        });
    }
});

// Löscht einen Sign-Off anhand seiner ID
app.delete("/api/signoffs/:id", async (req, res) => {
    const signOffId = req.params.id;

    try {
        const result = await pool.query(
            "DELETE FROM sign_offs WHERE id = $1 RETURNING *",
            [signOffId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Sign-Off nicht gefunden."
            });
        }

        res.json({
            message: "Sign-Off wurde gelöscht.",
            signOff: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Sign-Off konnte nicht gelöscht werden."
        });
    }
});

// Startet den Server auf Port 3000
app.listen(3000, () => {
    console.log("Server läuft auf Port 3000");
});