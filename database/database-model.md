# SignOff Database Model

## Models

### User

- id: Integer, primary key, auto increment
- name: String, required
- email: String, required, unique
- passwordHash: String, required
- role: UserRole, required
- createdAt: DateTime, default now

### Project

- id: Integer, primary key, auto increment
- title: String, required
- status: ProjectStatus, required
- startDate: DateTime, required
- deadline: DateTime, optional
- createdAt: DateTime, default now

### ProjectMember

- id: Integer, primary key, auto increment
- projectId: Integer, required, foreign key to Project
- userId: Integer, required, foreign key to User
- role: UserRole, required
- unique: projectId + userId

### Meeting

- id: Integer, primary key, auto increment
- projectId: Integer, required, foreign key to Project
- createdById: Integer, required, foreign key to User
- title: String, required
- date: DateTime, required
- notes: String, optional
- feedback: String, optional
- status: MeetingStatus, required
- createdAt: DateTime, default now

### Task

- id: Integer, primary key, auto increment
- projectId: Integer, required, foreign key to Project
- meetingId: Integer, optional, foreign key to Meeting
- assigneeId: Integer, optional, foreign key to User
- title: String, required
- description: String, optional
- deadline: DateTime, optional
- status: TaskStatus, required
- createdAt: DateTime, default now

### Milestone

- id: Integer, primary key, auto increment
- projectId: Integer, required, foreign key to Project
- title: String, required
- description: String, optional
- deadline: DateTime, required
- status: MilestoneStatus, required
- createdAt: DateTime, default now

### SignOff

- id: Integer, primary key, auto increment
- milestoneId: Integer, required, foreign key to Milestone
- userId: Integer, required, foreign key to User
- decision: SignOffDecision, required
- comment: String, optional
- signedAt: DateTime, optional

### Document

- id: Integer, primary key, auto increment
- projectId: Integer, required, foreign key to Project
- title: String, required
- createdAt: DateTime, default now

### DocumentVersion

- id: Integer, primary key, auto increment
- documentId: Integer, required, foreign key to Document
- meetingId: Integer, optional, foreign key to Meeting
- uploaderId: Integer, required, foreign key to User
- versionNumber: Integer, required
- filePath: String, required
- createdAt: DateTime, default now

## Enums

### UserRole

- STUDENT
- SUPERVISOR

### ProjectStatus

- ACTIVE
- COMPLETED
- ARCHIVED

### MeetingStatus

- PLANNED
- COMPLETED
- CANCELLED

### TaskStatus

- OPEN
- IN_PROGRESS
- DONE

### MilestoneStatus

- OPEN
- SUBMITTED
- APPROVED

### SignOffDecision

- APPROVED
- REJECTED

## Relationships

- User <-> Project through ProjectMember
- Project -> many Meetings
- Project -> many Tasks
- Project -> many Milestones
- Project -> many Documents
- Meeting -> many Tasks
- Meeting -> many DocumentVersions (optional relation)
- Milestone -> many SignOffs
- Document -> many DocumentVersions
- User -> many Meetings through createdById
- User -> many Tasks through assigneeId
- User -> many SignOffs
- User -> many DocumentVersions through uploaderId