CREATE TYPE user_role AS ENUM ('STUDENT', 'SUPERVISOR');

CREATE TYPE project_status AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');

CREATE TYPE meeting_status AS ENUM ('PLANNED', 'COMPLETED', 'CANCELLED');

CREATE TYPE task_status AS ENUM ('OPEN', 'IN_PROGRESS', 'DONE');

CREATE TYPE milestone_status AS ENUM ('OPEN', 'SUBMITTED', 'APPROVED');

CREATE TYPE signoff_decision AS ENUM ('APPROVED', 'REJECTED');


CREATE TABLE users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    status project_status NOT NULL,
    start_date TIMESTAMP NOT NULL,
    deadline TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE project_members (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    role user_role NOT NULL,
    UNIQUE (project_id, user_id)
);

CREATE TABLE meetings (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id),
    created_by_id INTEGER NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    notes TEXT,
    feedback TEXT,
    status meeting_status NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id),
    meeting_id INTEGER REFERENCES meetings(id),
    assignee_id INTEGER REFERENCES users(id),
    title TEXT NOT NULL,
    description TEXT,
    deadline TIMESTAMP,
    status task_status NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE milestones (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id),
    title TEXT NOT NULL,
    description TEXT,
    deadline TIMESTAMP NOT NULL,
    status milestone_status NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sign_offs (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    milestone_id INTEGER NOT NULL REFERENCES milestones(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    decision signoff_decision NOT NULL,
    comment TEXT,
    signed_at TIMESTAMP
);

CREATE TABLE documents (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id),
    title TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE document_versions (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(id),
    meeting_id INTEGER REFERENCES meetings(id),
    uploader_id INTEGER NOT NULL REFERENCES users(id),
    version_number INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);