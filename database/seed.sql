-- Test users
INSERT INTO users (name, email, password_hash, role)
VALUES
    ('Marci', 'marci@signoff.local', 'test_hash', 'STUDENT'),
    ('Daniel', 'daniel@signoff.local', 'test_hash', 'SUPERVISOR');

-- Test project
INSERT INTO projects (title, status, start_date, deadline)
VALUES
    ('Bachelorarbeit Beispielprojekt', 'ACTIVE', '2026-09-01', '2026-12-15');

-- Project members
INSERT INTO project_members (project_id, user_id, role)
VALUES
    (1, 1, 'STUDENT'),
    (1, 2, 'SUPERVISOR');

-- Test meeting
INSERT INTO meetings (
    project_id,
    created_by_id,
    title,
    date,
    notes,
    feedback,
    status
)
VALUES (
    1,
    1,
    'Erstes Betreuungsgespräch',
    '2026-09-10 14:00:00',
    'Thema und erste Gliederung besprochen.',
    'Gliederung bis zum nächsten Meeting überarbeiten.',
    'COMPLETED'
);

-- Test task
INSERT INTO tasks (
    project_id,
    meeting_id,
    assignee_id,
    title,
    description,
    deadline,
    status
)
VALUES (
    1,
    1,
    1,
    'Gliederung überarbeiten',
    'Die Gliederung anhand des Feedbacks aus dem Meeting anpassen.',
    '2026-09-20',
    'OPEN'
);

-- Test milestone
INSERT INTO milestones (
    project_id,
    title,
    description,
    deadline,
    status
)
VALUES (
    1,
    'Exposé fertigstellen',
    'Das vollständige Exposé soll zur Kontrolle abgegeben werden.',
    '2026-09-30',
    'APPROVED'
);

-- Test sign-off
INSERT INTO sign_offs (
    milestone_id,
    user_id,
    decision,
    comment,
    signed_at
)
VALUES (
    1,
    2,
    'APPROVED',
    'Der aktuelle Stand passt.',
    CURRENT_TIMESTAMP
);

-- Test document
INSERT INTO documents (
    project_id,
    title
)
VALUES (
    1,
    'Bachelorarbeit'
);

-- Test document version
INSERT INTO document_versions (
    document_id,
    meeting_id,
    uploader_id,
    version_number,
    file_path
)
VALUES (
    1,
    1,
    1,
    1,
    '/uploads/bachelorarbeit-v1.pdf'
);