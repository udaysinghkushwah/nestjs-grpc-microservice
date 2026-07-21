# NestJS gRPC Microservice & REST Gateway Application

A standalone NestJS application demonstrating **gRPC Microservice Communication** (Unary RPC and Server Streaming RPC) along with an integrated **REST API Gateway**.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [gRPC Contract (`hero.proto`)](#-grpc-contract-heroproto)
- [Installation & Setup](#%EF%B8%8F-installation--setup)
- [Running & Testing](#-running--testing)
- [gRPC Concepts Covered](#-grpc-concepts-covered)

---

## 🚀 Overview

This repository demonstrates how to build and communicate with a gRPC microservice in NestJS:
1. **gRPC Server**: Runs on TCP port `50051` using `@nestjs/microservices` and `@grpc/grpc-js`.
2. **REST Gateway**: Runs on HTTP port `3050` exposing HTTP endpoints (`GET /heroes/:id`, `GET /heroes/stream/all`) that invoke the gRPC microservice client proxy via `ClientsModule.register`.

---

## 📐 Architecture

```
[ HTTP Client / Browser / cURL ]
               │
               │  HTTP GET http://localhost:3050/heroes/1
               ▼
   [ REST Client Gateway ]
    (Port 3050 - HTTP)
               │
               │  gRPC Call over TCP (Protobuf / HTTP/2)
               ▼
   [ gRPC Microservice Server ]
    (Port 50051 - gRPC)
               │
               ├─► @GrpcMethod('HeroService', 'FindOne')  [Unary RPC]
               └─► @GrpcMethod('HeroService', 'FindMany') [Server Streaming RPC]
```

---

## 📂 Project Structure

```text
grpc-nest-app/
├── nest-cli.json                  # Assets compiler configuration for .proto files
├── package.json                   # Dependencies (@nestjs/microservices, @grpc/grpc-js)
├── tsconfig.json                  # TypeScript compiler settings
├── README.md                      # Documentation
└── src/
    ├── main.ts                    # Hybrid NestJS bootstrap (HTTP :3050 + gRPC :50051)
    ├── app.module.ts              # Root Application Module
    └── hero/
        ├── hero.proto             # Protobuf v3 Service & Message Schema
        ├── hero.interface.ts      # TypeScript payload interfaces & client contract
        ├── hero.service.ts        # Business logic & Hero data provider
        ├── hero.controller.ts     # gRPC Server Controller (@GrpcMethod)
        ├── hero-client.controller.ts # REST API Gateway Controller (HTTP -> gRPC)
        └── hero.module.ts         # Module registering gRPC ClientsModule proxy
```

---

## 📜 gRPC Contract (`hero.proto`)

```protobuf
syntax = "proto3";

package hero;

// Service contract defining RPC methods
service HeroService {
  // Unary RPC: 1 Request -> 1 Response
  rpc FindOne (HeroById) returns (Hero);

  // Server Streaming RPC: 1 Request -> Stream of Responses
  rpc FindMany (HeroByIdStream) returns (stream Hero);
}

message HeroById {
  int32 id = 1;
}

message HeroByIdStream {
  repeated int32 ids = 1;
}

message Hero {
  int32 id = 1;
  string name = 2;
  string superpower = 3;
  int32 level = 4;
}
```

---

## 🛠️ Installation & Setup

1. **Navigate to the application folder**:
   ```bash
   cd grpc-nest-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the project** (compiles TypeScript and copies `.proto` files into `dist/`):
   ```bash
   npm run build
   ```

---

## 🧪 Running & Testing

### Start the Application

```bash
npm run start
```
*(Starts both gRPC microservice on `0.0.0.0:50051` and HTTP Gateway on `http://localhost:3050`)*

---

### Test Endpoints

#### 1. Unary gRPC Call (Single Record Lookup)
```bash
curl http://localhost:3050/heroes/1
```
**Response:**
```json
{
  "id": 1,
  "name": "Iron Man",
  "superpower": "Genius, Powered Armor",
  "level": 95
}
```

#### 2. Server Streaming gRPC Call (Multiple Records Stream)
```bash
curl http://localhost:3050/heroes/stream/all
```
**Response:**
```json
[
  { "id": 1, "name": "Iron Man", "superpower": "Genius, Powered Armor", "level": 95 },
  { "id": 2, "name": "Spider-Man", "superpower": "Spider-sense, Agility", "level": 88 },
  { "id": 3, "name": "Thor", "superpower": "God of Thunder, Mjolnir", "level": 99 },
  { "id": 4, "name": "Captain America", "superpower": "Super Soldier, Vibranium Shield", "level": 90 },
  { "id": 5, "name": "Doctor Strange", "superpower": "Master of Mystical Arts", "level": 96 }
]
```

---

## 💡 gRPC Concepts Covered

- **Protocol Buffers (v3)**: Binary serialization mechanism replacing JSON text.
- **HTTP/2 Transport**: Multiplexed data streaming over a persistent TCP connection.
- **Unary RPC**: Standard 1 request to 1 response pattern.
- **Server Streaming RPC**: Server streams multiple responses back to client using RxJS `Observable`.
- **Hybrid NestJS App**: Concurrently running HTTP REST server and gRPC microservice transport.
