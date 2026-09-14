const { Pool } = require("pg");
const path = require("path");

// Lädt die .env-Datei aus dem Projekt-Hauptordner
require("dotenv").config({
    path: path.join(__dirname, "../.env")
});

// Für Verbindung zur PostgreSQL-Datenbank
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

module.exports = pool;