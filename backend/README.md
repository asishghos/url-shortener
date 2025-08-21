# URL Shortener – Backend UML

Below are UML diagrams describing the backend system architecture and flows.

## Component diagram
```mermaid
graph TD
subgraph "Clients"
  U["User (Browser)"]
  A["Admin Panel (Flutter)"]
end
subgraph "Backend"
  API["Express App"]
  Rts["Routes: /api, /api/analytics"]
  Ctrls["Controllers: UrlController, AnalyticsController"]
  Utils["Utils: RateLimiter, Shortener"]
  Ev["Events: Kafka Producer"]
end
subgraph "Data Stores"
  R["Redis"]
  M["MongoDB"]
end
subgraph "Streaming"
  K["Kafka Broker"]
  W["Analytics Worker"]
end
U -->|"POST /api/shorten\nGET /:shortId"| API
A -->|"GET /api/analytics/*"| API
API --> Rts
Rts --> Ctrls
Ctrls -->|"CRUD"| M
API -->|"GET/SET rate, url:*"| R
API -->|"sendClickEvent"| K
K --> W
W -->|"save analytics"| M
```

## Class diagram
```mermaid
classDiagram
class Url {
  +shortId: String
  +longUrl: String
  +createdAt: Date
  +clicks: Number
  +expiresAt: Date
}
class Analytics {
  +shortId: String
  +ip: String
  +userAgent: String
  +referrer: String
  +timestamp: Date
}
class UrlController {
  +shortenUrl(req, res)
}
class AnalyticsController {
  +getTopLinks(req, res)
  +getDailyClicks(req, res)
}
class RateLimiter {
  +invoke(limit, windowSeconds) middleware
}
class Shortener {
  +generateShortId(): String
}
class RedisClient
class KafkaProducer {
  +initProducer()
  +sendClickEvent(shortId, ip)
}
class ExpressApp {
  +startServer()
  +GET(":shortId")
}
class AnalyticsWorker {
  +run()
}
ExpressApp --> UrlController
ExpressApp --> AnalyticsController
ExpressApp --> RedisClient
ExpressApp --> KafkaProducer
UrlController --> Shortener
UrlController --> Url
AnalyticsController --> Analytics
RateLimiter --> RedisClient
AnalyticsWorker --> Analytics
AnalyticsWorker --> KafkaProducer
```

## Sequence diagram – Shorten URL
```mermaid
sequenceDiagram
autonumber
actor U as User
participant API as Express App
participant RL as RateLimiter (Redis)
participant CTRL as UrlController
participant DB as MongoDB (Url)
U->>API: POST /api/shorten {longUrl, customAlias, expiresAt}
API->>RL: check ip rate
alt over limit
  RL-->>API: 429 Too Many Requests
  API-->>U: 429 error
else allowed
  RL-->>API: ok
  API->>CTRL: shortenUrl()
  alt customAlias provided
    CTRL->>DB: findOne({shortId: customAlias})
    DB-->>CTRL: exists?
  end
  CTRL->>DB: save({shortId,longUrl,expiresAt})
  CTRL-->>API: {shortUrl,expiresAt}
  API-->>U: 201 Created
end
```

## Sequence diagram – Redirect and analytics
```mermaid
sequenceDiagram
autonumber
actor U as User
participant API as Express App
participant Cache as Redis
participant DB as MongoDB (Url)
participant KP as Kafka Producer
participant W as Analytics Worker
participant ADB as MongoDB (Analytics)
U->>API: GET /:shortId
API->>Cache: GET url:shortId
alt cache hit
  Cache-->>API: longUrl
  API->>KP: sendClickEvent(shortId, ip)
  API-->>U: 302 Redirect longUrl
else cache miss
  Cache-->>API: null
  API->>DB: findOne({shortId})
  alt expired
    API->>Cache: DEL url:shortId
    API-->>U: 410 Gone
  else found
    DB-->>API: entry
    API->>Cache: SET url:shortId longUrl EX=3600
    API->>KP: sendClickEvent(shortId, ip)
    API-->>U: 302 Redirect longUrl
  else not found
    DB-->>API: null
    API-->>U: 404 Not Found
  end
end
par worker processes
  KP-->>W: message click-events
  W->>ADB: save({shortId, ip, ts, ...})
end
```

## Deployment diagram
```mermaid
graph LR
subgraph "Client"
  Browser["User Browser"]
  Admin["Admin Panel (Flutter app)"]
end
subgraph "App Server"
  Express["Node.js Express API"]
end
subgraph "Data Layer"
  Mongo["MongoDB"]
  Redis["Redis"]
end
subgraph "Streaming"
  Kafka["Kafka Broker"]
  Worker["Analytics Worker (Node.js)"]
end
Browser --> Express
Admin --> Express
Express --> Mongo
Express --> Redis
Express --> Kafka
Kafka --> Worker
Worker --> Mongo
```
