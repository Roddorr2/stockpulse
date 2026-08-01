# ⚡ StockPulse — Sistema de Inventario Multi-Sucursal en Tiempo Real

![Java](https://img.shields.io/badge/Java-17-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.0-brightgreen.svg)
![Next.js](https://img.shields.io/badge/Next.js-14%2B-black.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)
![Architecture](https://img.shields.io/badge/Architecture-Clean%2FHexagonal-purple.svg)

StockPulse es una plataforma web y API backend de gestión de inventario multi-sucursal diseñada para prevenir situaciones de sobreventa (*overselling*) mediante **Locking Optimista (`@Version`)** y notificar alertas de stock crítico en tiempo real usando **WebSockets (STOMP)**.

---

## 🏛️ Arquitectura del Sistema (Clean / Hexagonal Architecture)

El backend implementa de forma rigurosa la Regla de Dependencia de Clean Architecture en 4 capas separadas:

```
presentation (Controllers, DTOs, Handlers)
      │
      ▼
application (Use Cases, Transaction Boundaries)
      │
      ▼
   domain (Entities, Value Objects, Domain Events - PURAS sin Spring/JPA)
      ▲
      │
infrastructure (JPA Repositories, Flyway, WebSocket Publishers, Security)
```

Para consultar el diagrama C4 detallado, flujos de secuencia de locking y eventos asíncronos, ver [docs/architecture.md](file:///e:/stockpulse/docs/architecture.md).

---

## 🗄️ Modelo de Datos y Entidades

El modelo entidad-relación del sistema incluye 8 entidades fundamentales:

- **Producto**: Catálogo global con SKU único y umbral de `stock_minimo`.
- **Sucursal**: Sedes físicas operativas.
- **Stock**: Existencia física por sucursal con control de concurrencia optimista (`version`).
- **Venta / DetalleVenta**: Registro transaccional auditado de operaciones comerciales.
- **TransferenciaStock**: Movimientos atómicos de inventario entre sucursales.
- **Usuario / Rol**: Autenticación y autorización basada en roles (`ADMIN`, `ENCARGADO_SUCURSAL`, `CAJERO`).

Para especificaciones detalladas del esquema, ver [docs/entities.md](file:///e:/stockpulse/docs/entities.md).

---

## 💡 Decisiones Técnicas y de Diseño (ADR)

| Decisión | Opción Elegida | Razón de Elección |
|---|---|---|
| **Estilo Arquitectónico** | Clean / Hexagonal | Aísla el modelo de dominio de Spring; facilita pruebas unitarias puras y mantenibilidad a largo plazo. |
| **Concurrencia de Stock** | Locking Optimista (`@Version`) | Alta frecuencia de lecturas con baja contención de colisiones simultáneas. |
| **Alertas de Bajo Stock** | Eventos de Dominio + WebSockets (STOMP) | Desacopla la transacción de la venta de la capa de notificación (principio de responsabilidad única). |
| **Migraciones de Base de Datos** | Flyway (`V1`, `V2`, `V3`) | Gestión del esquema declarativa, auditable con seeders de datos iniciales y operadores (`V3__additional_users_seed.sql`). |
| **Mapeo Objeto-Relacional/DTO** | MapStruct / Spring Data JPA | Desempeño superior y mitigación de errores de mapeo manual. |

---

## 🚀 Inicio Rápido para Desarrollo Local

### Prerrequisitos
- Docker & Docker Compose
- Java JDK 17
- Node.js 20+

### 1. Iniciar Base de Datos (PostgreSQL)
```bash
docker-compose up -d
```

### 2. Ejecutar Backend
```bash
cd backend
./mvnw spring-boot:run
```
La API estará accesible en `http://localhost:8080` y Swagger UI en `http://localhost:8080/swagger-ui.html`.

### 3. Ejecutar Frontend
```bash
cd frontend
npm install
npm run dev
```
La aplicación web estará disponible en `http://localhost:3000`.

---

## 🧪 Pruebas y Calidad de Código

```bash
# Ejecutar tests de Backend (Unitarios + Testcontainers)
cd backend && ./mvnw verify

# Validar estilo de código Java (Google Checkstyle)
cd backend && ./mvnw checkstyle:check

# Validar código Frontend
cd frontend && npm run lint
```
