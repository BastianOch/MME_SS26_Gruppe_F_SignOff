// Für Webserver und REST-API
const express = require("express");

// Erlaubt Anfragen vom Frontend an das Backend
const cors = require("cors");

// Verbindung zur PostgreSQL-Datenbank
const pool = require("./db");

// Express-Anwendung erstellen
const app = express();

// Für die Dokumente 
const multer = require("multer");
const path = require("path");

// Für Anmledung
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



// CORS aktivieren
app.use(cors());

// Erlaubt dem Server, JSON-Daten aus Requests zu lesen
app.use(express.json());

// Macht hochgeladene Dateien über /uploads erreichbar
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

// Prüft, ob ein gültiger JWT-Token mitgeschickt wurde
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Kein Token vorhanden."
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Ungültiges Token-Format."
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Token ist ungültig oder abgelaufen."
        });
    }
}

// Testet, ob der Benutzer mit gültigem Token authentifiziert ist
app.get("/api/auth/me", authenticateToken, (req, res) => {
    res.json({
        message: "Token ist gültig.",
        user: req.user
    });
});

// Registriert einen neuen Benutzer
app.post("/api/auth/register", async (req, res) => {
    const {
        name,
        email,
        password,
        role
    } = req.body;

    // Pflichtfelder prüfen
    if (!name || !email || !password || !role) {
        return res.status(400).json({
            message: "Bitte alle Pflichtfelder ausfüllen."
        });
    }

    // Erlaubte Rollen prüfen
    const allowedRoles = ["STUDENT", "SUPERVISOR"];

    if (!allowedRoles.includes(role)) {
        return res.status(400).json({
            message: "Ungültige Benutzerrolle."
        });
    }

    // Einfacher Passwort-Check
    if (password.length < 8) {
        return res.status(400).json({
            message: "Das Passwort muss mindestens 8 Zeichen lang sein."
        });
    }

    try {
        // Passwort hashen
        const passwordHash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `INSERT INTO users
            (name, email, password_hash, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, role, created_at`,
            [
                name,
                email,
                passwordHash,
                role
            ]
        );

        res.status(201).json({
            message: "Benutzer wurde registriert.",
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        // PostgreSQL-Code für verletzte UNIQUE-Regel
        if (error.code === "23505") {
            return res.status(400).json({
                message: "Diese E-Mail-Adresse ist bereits registriert."
            });
        }

        res.status(500).json({
            message: "Benutzer konnte nicht registriert werden."
        });
    }
});

// Meldet einen bestehenden Benutzer an
app.post("/api/auth/login", async (req, res) => {
    const {
        email,
        password
    } = req.body;

    // Pflichtfelder prüfen
    if (!email || !password) {
        return res.status(400).json({
            message: "E-Mail und Passwort sind erforderlich."
        });
    }

    try {
        // Benutzer anhand der E-Mail suchen
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "E-Mail oder Passwort ist falsch."
            });
        }

        const user = result.rows[0];

        // Eingegebenes Passwort mit gespeichertem Hash vergleichen
        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "E-Mail oder Passwort ist falsch."
            });
        }

        // JWT-Token erstellen
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

        res.json({
            message: "Login erfolgreich.",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Login fehlgeschlagen."
        });
    }
});

// Legt fest, wo hochgeladene Dateien gespeichert werden
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "uploads"));
    },

    filename: (req, file, cb) => {
        // Sonderzeichen im Dateinamen ersetzen
        const safeName = file.originalname.replace(
            /[^a-zA-Z0-9._-]/g,
            "_"
        );

        // Zeitstempel verhindert, dass Dateien mit gleichem Namen überschrieben werden
        cb(null, `${Date.now()}-${safeName}`);
    }
});

const upload = multer({
    storage: storage,

    // Maximale Dateigröße: 10 MB
    limits: {
        fileSize: 10 * 1024 * 1024
    },

    // Nur PDF- und DOCX-Dateien erlauben
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            const error = new Error(
                "Nur PDF- und DOCX-Dateien sind erlaubt."
            );

            error.code = "INVALID_FILE_TYPE";
            cb(error);
        }
    }
});


// Test-Endpunkt zum Prüfen, ob das Backend läuft
app.get("/api/test", (req, res) => {
    res.json({
        message: "Backend läuft!"
    });
});


// Gibt aktuell vorhandene Meetings zurück
// Momentan noch Testdaten, später kommen die Daten aus PostgreSQL
// Gibt alle Meetings aus der PostgreSQL-Datenbank zurück
app.get("/api/meetings", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const result = await pool.query(
            `SELECT m.*
     FROM meetings m
     JOIN project_members pm
       ON pm.project_id = m.project_id
     WHERE pm.user_id = $1
     ORDER BY m.date ASC`,
            [userId]
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Meetings konnten nicht geladen werden"
        });
    }
});



// Erstellt ein neues Meeting und speichert es in PostgreSQL
app.post("/api/meetings", authenticateToken, async (req, res) => {
    const {
        projectId,
        title,
        date,
        notes,
        feedback,
        status
    } = req.body;

    // Ersteller kommt aus dem eingeloggten JWT-Token
    const createdById = req.user.userId;

    // Prüft, ob alle Pflichtfelder vorhanden sind
    if (!projectId || !title || !date || !status) {
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

        // Prüfen, ob der eingeloggte Benutzer Mitglied des Projekts ist
        const memberCheck = await pool.query(
            `SELECT id
     FROM project_members
     WHERE project_id = $1
       AND user_id = $2`,
            [
                projectId,
                createdById
            ]
        );

        if (memberCheck.rows.length === 0) {
            return res.status(403).json({
                message: "Du bist kein Mitglied dieses Projekts."
            });
        }
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
app.get("/api/meetings/:id", authenticateToken, async (req, res) => {
    const meetingId = req.params.id;
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            `SELECT m.*
     FROM meetings m
     JOIN project_members pm
       ON pm.project_id = m.project_id
     WHERE m.id = $1
       AND pm.user_id = $2`,
            [
                meetingId,
                userId
            ]
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
app.patch("/api/meetings/:id", authenticateToken, async (req, res) => {
    const meetingId = req.params.id;
    const userId = req.user.userId;

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
        // Prüfen, ob der eingeloggte Benutzer zum Projekt des Meetings gehört
        const memberCheck = await pool.query(
            `SELECT pm.id
     FROM project_members pm
     JOIN meetings m ON m.project_id = pm.project_id
     WHERE m.id = $1
       AND pm.user_id = $2`,
            [
                meetingId,
                userId
            ]
        );

        if (memberCheck.rows.length === 0) {
            return res.status(403).json({
                message: "Du bist kein Mitglied des Projekts dieses Meetings."
            });
        }
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
app.delete("/api/meetings/:id", authenticateToken, async (req, res) => {
    const meetingId = req.params.id;
    const userId = req.user.userId;
    try {

        // Prüfen, ob der eingeloggte Benutzer zum Projekt des Meetings gehört
        const memberCheck = await pool.query(
            `SELECT pm.id
     FROM project_members pm
     JOIN meetings m ON m.project_id = pm.project_id
     WHERE m.id = $1
       AND pm.user_id = $2`,
            [
                meetingId,
                userId
            ]
        );

        if (memberCheck.rows.length === 0) {
            return res.status(403).json({
                message: "Du bist kein Mitglied des Projekts dieses Meetings."
            });
        }
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

// Gibt nur Tasks aus Projekten zurück, bei denen der Benutzer Mitglied ist
app.get("/api/tasks", authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            `SELECT t.*
             FROM tasks t
             JOIN project_members pm
               ON pm.project_id = t.project_id
             WHERE pm.user_id = $1
             ORDER BY t.deadline ASC`,
            [userId]
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
app.post("/api/tasks", authenticateToken, async (req, res) => {
    const userId = req.user.userId;

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
        // Prüfen, ob der eingeloggte Benutzer Mitglied des Projekts ist
        const memberCheck = await pool.query(
            `SELECT id
     FROM project_members
     WHERE project_id = $1
       AND user_id = $2`,
            [
                projectId,
                userId
            ]
        );

        if (memberCheck.rows.length === 0) {
            return res.status(403).json({
                message: "Du bist kein Mitglied dieses Projekts."
            });
        }
        // Falls ein Bearbeiter gesetzt ist, prüfen, ob er Mitglied des Projekts ist
        if (assigneeId) {
            const assigneeCheck = await pool.query(
                `SELECT id
         FROM project_members
         WHERE project_id = $1
           AND user_id = $2`,
                [
                    projectId,
                    assigneeId
                ]
            );

            if (assigneeCheck.rows.length === 0) {
                return res.status(400).json({
                    message: "Der ausgewählte Bearbeiter ist kein Mitglied dieses Projekts."
                });
            }
        }
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
app.get("/api/tasks/:id", authenticateToken, async (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            `SELECT t.*
     FROM tasks t
     JOIN project_members pm
       ON pm.project_id = t.project_id
     WHERE t.id = $1
       AND pm.user_id = $2`,
            [
                taskId,
                userId
            ]
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
app.patch("/api/tasks/:id", authenticateToken, async (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.userId;

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

        // Prüfen, ob der eingeloggte Benutzer zum Projekt des Tasks gehört
        const memberCheck = await pool.query(
            `SELECT pm.id
     FROM project_members pm
     JOIN tasks t ON t.project_id = pm.project_id
     WHERE t.id = $1
       AND pm.user_id = $2`,
            [
                taskId,
                userId
            ]
        );

        if (memberCheck.rows.length === 0) {
            return res.status(403).json({
                message: "Du bist kein Mitglied des Projekts dieses Tasks."
            });
        }
        // Falls ein neuer Bearbeiter gesetzt wird, prüfen,
        // ob dieser Mitglied des Projekts des Tasks ist
        if (assigneeId) {
            const assigneeCheck = await pool.query(
                `SELECT pm.id
         FROM project_members pm
         JOIN tasks t ON t.project_id = pm.project_id
         WHERE t.id = $1
           AND pm.user_id = $2`,
                [
                    taskId,
                    assigneeId
                ]
            );

            if (assigneeCheck.rows.length === 0) {
                return res.status(400).json({
                    message: "Der ausgewählte Bearbeiter ist kein Mitglied dieses Projekts."
                });
            }
        }

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
app.delete("/api/tasks/:id", authenticateToken, async (req, res) => {
    const taskId = req.params.id;
    const userId = req.user.userId;

    try {
        // Prüfen, ob der eingeloggte Benutzer zum Projekt des Tasks gehört
        const memberCheck = await pool.query(
            `SELECT pm.id
     FROM project_members pm
     JOIN tasks t ON t.project_id = pm.project_id
     WHERE t.id = $1
       AND pm.user_id = $2`,
            [
                taskId,
                userId
            ]
        );

        if (memberCheck.rows.length === 0) {
            return res.status(403).json({
                message: "Du bist kein Mitglied des Projekts dieses Tasks."
            });
        }

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
app.get("/api/milestones", authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    try {
        const result = await pool.query(
            `SELECT m.*
             FROM milestones m
             JOIN project_members pm
               ON pm.project_id = m.project_id
             WHERE pm.user_id = $1
             ORDER BY m.deadline ASC`,
            [userId]


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
app.post("/api/milestones", authenticateToken, async (req, res) => {
    const {
        projectId,
        title,
        description,
        deadline,
        status
    } = req.body;
    const userId = req.user.userId;

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

        // Prüfen, ob der eingeloggte Benutzer Mitglied des Projekts ist
        const memberCheck = await pool.query(
            `SELECT id
     FROM project_members
     WHERE project_id = $1
       AND user_id = $2`,
            [
                projectId,
                userId
            ]
        );

        if (memberCheck.rows.length === 0) {
            return res.status(403).json({
                message: "Du bist kein Mitglied dieses Projekts."
            });
        }

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
app.get("/api/milestones/:id", authenticateToken, async (req, res) => {
    const milestoneId = req.params.id;
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            `SELECT m.*
     FROM milestones m
     JOIN project_members pm
       ON pm.project_id = m.project_id
     WHERE m.id = $1
       AND pm.user_id = $2`,
            [
                milestoneId,
                userId
            ]

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
app.patch("/api/milestones/:id", authenticateToken, async (req, res) => {
    const milestoneId = req.params.id;
    const userId = req.user.userId;

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
        // Prüfen, ob der eingeloggte Benutzer zum Projekt des Milestones gehört
        const memberCheck = await pool.query(
            `SELECT pm.id
     FROM project_members pm
     JOIN milestones m ON m.project_id = pm.project_id
     WHERE m.id = $1
       AND pm.user_id = $2`,
            [
                milestoneId,
                userId
            ]
        );

        if (memberCheck.rows.length === 0) {
            return res.status(403).json({
                message: "Du bist kein Mitglied des Projekts dieses Milestones."
            });
        }

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
app.delete("/api/milestones/:id", authenticateToken, async (req, res) => {
    const milestoneId = req.params.id;
    const userId = req.user.userId;

    try {
        // Prüfen, ob der eingeloggte Benutzer zum Projekt des Milestones gehört
        const memberCheck = await pool.query(
            `SELECT pm.id
     FROM project_members pm
     JOIN milestones m ON m.project_id = pm.project_id
     WHERE m.id = $1
       AND pm.user_id = $2`,
            [
                milestoneId,
                userId
            ]
        );

        if (memberCheck.rows.length === 0) {
            return res.status(403).json({
                message: "Du bist kein Mitglied des Projekts dieses Milestones."
            });
        }
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
// Gibt nur Sign-Offs aus Projekten zurück, bei denen der Benutzer Mitglied ist
app.get("/api/signoffs", authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            `SELECT so.*
             FROM sign_offs so
             JOIN milestones m
               ON m.id = so.milestone_id
             JOIN project_members pm
               ON pm.project_id = m.project_id
             WHERE pm.user_id = $1
             ORDER BY so.id ASC`,
            [userId]
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
app.post("/api/signoffs", authenticateToken, async (req, res) => {
    const {
        milestoneId,
        decision,
        comment
    } = req.body;

    // Benutzer kommt nun aus dem eingeloggten JWT-Token
    const userId = req.user.userId;

    // Pflichtfelder prüfen
    if (!milestoneId || !decision) {
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

        // Prüfen, ob der eingeloggte Benutzer Mitglied des Projekts ist
        const memberCheck = await pool.query(
            `SELECT pm.id
     FROM project_members pm
     JOIN milestones m ON m.project_id = pm.project_id
     WHERE m.id = $1
       AND pm.user_id = $2`,
            [
                milestoneId,
                userId
            ]
        );

        if (memberCheck.rows.length === 0) {
            return res.status(403).json({
                message: "Du bist kein Mitglied dieses Projekts."
            });
        }
        // Prüfen, ob der Benutzer diesen Milestone bereits signiert hat
        const existingSignOff = await pool.query(
            `SELECT id
     FROM sign_offs
     WHERE milestone_id = $1
       AND user_id = $2`,
            [
                milestoneId,
                userId
            ]
        );

        if (existingSignOff.rows.length > 0) {
            return res.status(409).json({
                message: "Du hast diesen Milestone bereits bestätigt."
            });
        }
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
app.get("/api/signoffs/:id", authenticateToken, async (req, res) => {
    const signOffId = req.params.id;
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            `SELECT so.*
     FROM sign_offs so
     JOIN milestones m
       ON m.id = so.milestone_id
     JOIN project_members pm
       ON pm.project_id = m.project_id
     WHERE so.id = $1
       AND pm.user_id = $2`,
            [
                signOffId,
                userId
            ]
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
app.patch("/api/signoffs/:id", authenticateToken, async (req, res) => {
    const signOffId = req.params.id;
    const userId = req.user.userId;

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
            AND user_id = $4
            RETURNING *`,
            [
                decision,
                comment,
                signOffId,
                userId
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
app.delete("/api/signoffs/:id", authenticateToken, async (req, res) => {
    const signOffId = req.params.id;
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            "DELETE FROM sign_offs WHERE id = $1 AND user_id = $2 RETURNING *",
            [signOffId,
                userId
            ]
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

// Gibt nur Dokumente aus Projekten zurück, bei denen der Benutzer Mitglied ist
app.get("/api/documents", authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            `SELECT d.*
             FROM documents d
             JOIN project_members pm
               ON pm.project_id = d.project_id
             WHERE pm.user_id = $1
             ORDER BY d.created_at ASC`,
            [userId]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Dokumente konnten nicht geladen werden."
        });
    }
});

// Erstellt ein neues Dokument und speichert es in PostgreSQL
app.post("/api/documents", authenticateToken, async (req, res) => {
    const {
        projectId,
        title
    } = req.body;
    const userId = req.user.userId;

    // Pflichtfelder prüfen
    if (!projectId || !title) {
        return res.status(400).json({
            message: "Bitte alle Pflichtfelder ausfüllen."
        });
    }

    try {
        // Prüfen, ob der eingeloggte Benutzer Mitglied des Projekts ist
        const memberCheck = await pool.query(
            `SELECT id
     FROM project_members
     WHERE project_id = $1
       AND user_id = $2`,
            [
                projectId,
                userId
            ]
        );

        if (memberCheck.rows.length === 0) {
            return res.status(403).json({
                message: "Du bist kein Mitglied dieses Projekts."
            });
        }
        const result = await pool.query(
            `INSERT INTO documents
            (project_id, title)
            VALUES ($1, $2)
            RETURNING *`,
            [
                projectId,
                title
            ]
        );

        res.status(201).json({
            message: "Dokument wurde erstellt.",
            document: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        if (error.code === "23503") {
            return res.status(400).json({
                message: "Projekt existiert nicht."
            });
        }

        res.status(500).json({
            message: "Dokument konnte nicht erstellt werden."
        });
    }
});

// Gibt ein einzelnes Dokument anhand seiner ID zurück
app.get("/api/documents/:id", authenticateToken, async (req, res) => {
    const documentId = req.params.id;
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            `SELECT d.*
     FROM documents d
     JOIN project_members pm
       ON pm.project_id = d.project_id
     WHERE d.id = $1
       AND pm.user_id = $2`,
            [
                documentId,
                userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Dokument nicht gefunden."
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Dokument konnte nicht geladen werden."
        });
    }
});

// Aktualisiert ein bestehendes Dokument
app.patch("/api/documents/:id", authenticateToken, async (req, res) => {
    const documentId = req.params.id;
    const userId = req.user.userId;

    const {
        title
    } = req.body;

    try {
        // Prüfen, ob der eingeloggte Benutzer zum Projekt des Dokuments gehört
        const memberCheck = await pool.query(
            `SELECT pm.id
     FROM project_members pm
     JOIN documents d ON d.project_id = pm.project_id
     WHERE d.id = $1
       AND pm.user_id = $2`,
            [
                documentId,
                userId
            ]
        );

        if (memberCheck.rows.length === 0) {
            return res.status(403).json({
                message: "Du bist kein Mitglied des Projekts dieses Dokuments."
            });
        }
        const result = await pool.query(
            `UPDATE documents
            SET
                title = COALESCE($1, title)
            WHERE id = $2
            RETURNING *`,
            [
                title,
                documentId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Dokument nicht gefunden."
            });
        }

        res.json({
            message: "Dokument wurde aktualisiert.",
            document: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Dokument konnte nicht aktualisiert werden."
        });
    }
});

// Löscht ein Dokument anhand seiner ID
app.delete("/api/documents/:id", authenticateToken, async (req, res) => {
    const documentId = req.params.id;
    const userId = req.user.userId;

    try {
        // Prüfen, ob der eingeloggte Benutzer zum Projekt des Dokuments gehört
        const memberCheck = await pool.query(
            `SELECT pm.id
     FROM project_members pm
     JOIN documents d ON d.project_id = pm.project_id
     WHERE d.id = $1
       AND pm.user_id = $2`,
            [
                documentId,
                userId
            ]
        );

        if (memberCheck.rows.length === 0) {
            return res.status(403).json({
                message: "Du bist kein Mitglied des Projekts dieses Dokuments."
            });
        }
        const result = await pool.query(
            "DELETE FROM documents WHERE id = $1 RETURNING *",
            [documentId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Dokument nicht gefunden."
            });
        }

        res.json({
            message: "Dokument wurde gelöscht.",
            document: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Dokument konnte nicht gelöscht werden."
        });
    }
});

// Gibt alle Dokumentversionen aus der PostgreSQL-Datenbank zurück
// Gibt nur Dokumentversionen aus eigenen Projekten zurück
app.get("/api/document-versions", authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            `SELECT dv.*
             FROM document_versions dv
             JOIN documents d
               ON d.id = dv.document_id
             JOIN project_members pm
               ON pm.project_id = d.project_id
             WHERE pm.user_id = $1
             ORDER BY dv.created_at ASC`,
            [userId]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Dokumentversionen konnten nicht geladen werden."
        });
    }
});

app.get("/api/meetings/:id/document-versions", authenticateToken, async (req, res) => {
    const meetingId = req.params.id;
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            `SELECT dv.*
     FROM document_versions dv
     JOIN meetings m
       ON m.id = dv.meeting_id
     JOIN project_members pm
       ON pm.project_id = m.project_id
     WHERE dv.meeting_id = $1
       AND pm.user_id = $2
     ORDER BY dv.created_at ASC`,
            [
                meetingId,
                userId
            ]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Dokumentversionen des Meetings konnten nicht geladen werden."
        });
    }
});


// Erstellt eine neue Version eines Dokuments
app.post("/api/document-versions", authenticateToken, async (req, res) => {
    const {
        documentId,
        meetingId,
        filePath
    } = req.body;

    // Benutzer kommt aus dem eingeloggten JWT-Token
    const uploaderId = req.user.userId;

    // Pflichtfelder prüfen
    if (!documentId || !filePath) {
        return res.status(400).json({
            message: "Bitte alle Pflichtfelder ausfüllen."
        });
    }

    try {
        // Prüfen, ob der eingeloggte Benutzer zum Projekt des Dokuments gehört
        const memberCheck = await pool.query(
            `SELECT pm.id
     FROM project_members pm
     JOIN documents d ON d.project_id = pm.project_id
     WHERE d.id = $1
       AND pm.user_id = $2`,
            [
                documentId,
                uploaderId
            ]
        );

        if (memberCheck.rows.length === 0) {
            return res.status(403).json({
                message: "Du bist kein Mitglied des Projekts dieses Dokuments."
            });
        }
        // Nächste Versionsnummer für dieses Dokument bestimmen
        const versionResult = await pool.query(
            `SELECT COALESCE(MAX(version_number), 0) + 1 AS next_version
             FROM document_versions
             WHERE document_id = $1`,
            [documentId]
        );

        const nextVersion = versionResult.rows[0].next_version;

        // Neue Dokumentversion speichern
        const result = await pool.query(
            `INSERT INTO document_versions
            (document_id, meeting_id, uploader_id, version_number, file_path)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                documentId,
                meetingId || null,
                uploaderId,
                nextVersion,
                filePath
            ]
        );

        res.status(201).json({
            message: "Dokumentversion wurde erstellt.",
            documentVersion: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        if (error.code === "23503") {
            return res.status(400).json({
                message: "Dokument, Meeting oder Benutzer existiert nicht."
            });
        }

        res.status(500).json({
            message: "Dokumentversion konnte nicht erstellt werden."
        });
    }
});

// Gibt alle Versionen eines bestimmten Dokuments zurück
app.get("/api/documents/:id/versions", authenticateToken, async (req, res) => {
    const documentId = req.params.id;
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            `SELECT dv.*
     FROM document_versions dv
     JOIN documents d
       ON d.id = dv.document_id
     JOIN project_members pm
       ON pm.project_id = d.project_id
     WHERE dv.document_id = $1
       AND pm.user_id = $2
     ORDER BY dv.version_number ASC`,
            [
                documentId,
                userId
            ]
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Dokumentversionen konnten nicht geladen werden."
        });
    }
});

// Gibt eine einzelne Dokumentversion anhand ihrer ID zurück
app.get("/api/document-versions/:id", authenticateToken, async (req, res) => {
    const versionId = req.params.id;
    const userId = req.user.userId;

    try {
        const result = await pool.query(
            `SELECT dv.*
     FROM document_versions dv
     JOIN documents d
       ON d.id = dv.document_id
     JOIN project_members pm
       ON pm.project_id = d.project_id
     WHERE dv.id = $1
       AND pm.user_id = $2`,
            [
                versionId,
                userId
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Dokumentversion nicht gefunden."
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Dokumentversion konnte nicht geladen werden."
        });
    }
});

// Lädt eine Datei hoch und erstellt dafür eine neue Dokumentversion
app.post(
    "/api/document-versions/upload",
    authenticateToken,
    upload.single("file"),
    async (req, res) => {
        const {
            documentId,
            meetingId
        } = req.body;

        // Benutzer kommt aus dem eingeloggten JWT-Token
        const uploaderId = req.user.userId;

        // Pflichtfelder prüfen
        if (!documentId || !req.file) {
            return res.status(400).json({
                message: "Dokument, Benutzer und Datei sind erforderlich."
            });
        }

        try {
            // Prüfen, ob der eingeloggte Benutzer zum Projekt des Dokuments gehört
            const memberCheck = await pool.query(
                `SELECT pm.id
     FROM project_members pm
     JOIN documents d ON d.project_id = pm.project_id
     WHERE d.id = $1
       AND pm.user_id = $2`,
                [
                    documentId,
                    uploaderId
                ]
            );

            if (memberCheck.rows.length === 0) {
                return res.status(403).json({
                    message: "Du bist kein Mitglied des Projekts dieses Dokuments."
                });
            }
            // Nächste Versionsnummer bestimmen
            const versionResult = await pool.query(
                `SELECT COALESCE(MAX(version_number), 0) + 1 AS next_version
                 FROM document_versions
                 WHERE document_id = $1`,
                [documentId]
            );

            const nextVersion = versionResult.rows[0].next_version;

            // Pfad der hochgeladenen Datei
            const filePath = `/uploads/${req.file.filename}`;

            // Neue Dokumentversion in PostgreSQL speichern
            const result = await pool.query(
                `INSERT INTO document_versions
                (document_id, meeting_id, uploader_id, version_number, file_path)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *`,
                [
                    documentId,
                    meetingId || null,
                    uploaderId,
                    nextVersion,
                    filePath
                ]
            );

            res.status(201).json({
                message: "Datei wurde hochgeladen und Dokumentversion erstellt.",
                documentVersion: result.rows[0]
            });

        } catch (error) {
            console.error(error);

            if (error.code === "23503") {
                return res.status(400).json({
                    message: "Dokument, Meeting oder Benutzer existiert nicht."
                });
            }

            res.status(500).json({
                message: "Datei konnte nicht hochgeladen werden."
            });
        }
    }
);

// Fehlerbehandlung für Datei-Uploads
app.use((error, req, res, next) => {
    if (
        error instanceof multer.MulterError &&
        error.code === "LIMIT_FILE_SIZE"
    ) {
        return res.status(400).json({
            message: "Die Datei ist zu groß. Maximal 10 MB sind erlaubt."
        });
    }

    if (error.code === "INVALID_FILE_TYPE") {
        return res.status(400).json({
            message: "Nur PDF- und DOCX-Dateien sind erlaubt."
        });
    }

    next(error);
});

// Startet den Server auf Port 3000
app.listen(3000, () => {
    console.log("Server läuft auf Port 3000");
});