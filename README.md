#  <span style="color:pink"> RAG Chat Storage Microservice </span>

#### A production-ready backend microservice for storing and managing chat sessions and messages for a RAG (Retrieval-Augmented Generation) chatbot system.

---

##  <span style="color:lightgreen"> Overview </span>

### This microservice provides secure, scalable APIs to:

- Create and manage chat sessions
- Save user and assistant messages with optional RAG context
- Rename, favorite, delete sessions
- Retrieve paginated message history
- Authenticate all requests using API Key
- Apply rate limiting
- Provide health monitoring
- Run fully inside Docker (API + Postgres + pgAdmin)

It follows best practices for **security, modularity, configurability, error handling, and scalability**.

---

## <span style="color:lightgreen"> Features </span>

### Core Functionalities
- Start and maintain chat sessions
- Save chat messages (role, content, context)
- Rename chat sessions
- Mark/unmark sessions as favorite
- Delete sessions + cascade-delete messages
- Retrieve message history with pagination

### Security & Reliability
- API key authentication (`x-api-key`)
- Rate limiting via Nest Throttler
- Global exception handling
- Logging interceptor for request tracing
- Environment-based configuration (`.env`)
- CORS protection

### Database
- PostgreSQL (local or remote e.g., Neon)
- JSONB column for flexible RAG metadata
- TypeORM auto schema sync
- Cascade delete for messages

### Developer Experience
- Swagger/OpenAPI docs at `/docs`
- Health endpoint at `/health`
- Fully dockerized (API, Postgres, pgAdmin)
- Clean module-based architecture

---

## <span style="color:lightgreen"> Project Structure </span>

```md
src/
├── app.module.ts
├── main.ts
├── common/
│ ├── guards/api-key.guard.ts
│ ├── filters/http-exception.filter.ts
│ └── interceptors/logging.interceptor.ts
├── config/configuration.ts
├── sessions/
│ ├── sessions.module.ts
│ ├── sessions.controller.ts
│ ├── sessions.service.ts
│ ├── dto/
│ └── entities/chat-session.entity.ts
├── messages/
│ ├── messages.module.ts
│ ├── messages.controller.ts
│ ├── messages.service.ts
│ ├── dto/
│ └── entities/chat-message.entity.ts
└── health/
├── health.module.ts
├── health.controller.ts
└── health.service.ts

````` 

## <span style="color:lightgreen"> Running Locally (Without Docker) </span>
```md
Install dependencies:

npm install


Start the server:

npm run start:dev

`````

### Open Swagger documentation:

http://localhost:3000/docs

### Health check:

http://localhost:3000/health

## <span style="color:lightgreen"> Running With Docker (API + Postgres + pgAdmin) </span>

### Build & run services:

```md

docker-compose up --build

`````

## <span style="color:lightgreen"> Services </span>
### Service	URL
API	http://localhost:3000

### Swagger Docs	
http://localhost:3000/docs

### pgAdmin
http://localhost:5050
pgAdmin Login
Email: admin@example.com
Password: admin123

## <span style="color:lightgreen"> Add a new server inside pgAdmin: </span>

```md
Host: db
Port: 5432
User: rag_chat_user
Password: rag_chat_pass
Database: rag_chat_db
`````

## <span style="color:lightgreen">  API Authentication <span>

### All API endpoints require:

```md

x-api-key: <your API_KEY>

Except:

/health (public)

`````

### API Reference
### Health
GET /health

Checks database connection, uptime, and service availability.

## <span style="color:lightgreen"> Session Endpoints </span>
### Create Session

```md
POST /api/v1/sessions

Body:

{
"userId": "123",
"title": "My Chat"
}

`````

### List Sessions
```md

GET /api/v1/sessions?userId=123

`````

### Update Session

### Rename or favorite:

```md
PATCH /api/v1/sessions/:id

Body:

{
"title": "Updated Title",
"isFavorite": true
}
`````

### Delete Session

```md
DELETE /api/v1/sessions/:id


Automatically deletes child messages.

`````

## <span style="color:lightgreen"> Message Endpoints </span>
### Add Message

```md
POST /api/v1/sessions/:sessionId/messages

Body:

{
"role": "user",
"content": "Hello",
"context": { "source": "RAG" }
}
`````

### Get Messages (Paginated)

```md
GET /api/v1/sessions/:sessionId/messages?page=1&limit=20

Response:

{
"items": [...],
"page": 1,
"limit": 20,
"total": 10,
"totalPages": 1
}

`````

## <span style="color:lightgreen"> Unit Tests  </span>

### Tests can be found in:

```md

test/
├── sessions.service.spec.ts
├── messages.service.spec.ts

`````
## <span style="color:lightgreen"> Design Notes </span>

- This service does not perform RAG retrieval—it simply stores RAG metadata (e.g., retrieved chunks, scoring).

- JSONB fields support flexible storage of context.

- Modular architecture supports horizontal scaling into microservices.

- Pagination ensures large chat histories remain performant.

- API key and rate limiting protect against unauthorized and abusive use.

## <span style="color:lightgreen"> Conclusion </span>

This project fulfills all core requirements and all bonus requirements, including:

- Session & message storage
- Rename/favorite/delete
- Pagination
- API key authentication
- Rate limiting
- Global error handling
- Logging
- Health checks
- Swagger docs
- Dockerized Postgres + pgAdmin
- Environment-based configuration

## <span style="color:lightgreen">  Author </span>

RAG Chat Storage Microservice — built for interview assignment demonstration.