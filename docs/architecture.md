# Arquitectura — StockPulse

## 1. Contexto (C4 Nivel 1)

```mermaid
C4Context
    title Contexto del sistema StockPulse

    Person(cajero, "Cajero", "Registra ventas en su sucursal")
    Person(encargado, "Encargado de Sucursal", "Gestiona stock y recibe alertas")
    Person(admin, "Administrador", "Gestiona catálogo, sucursales y usuarios")

    System(stockpulse, "StockPulse", "Sistema de inventario multi-sucursal en tiempo real")

    System_Ext(email, "Servicio de Email (futuro)", "Notificaciones fuera de la app")

    Rel(cajero, stockpulse, "Registra ventas")
    Rel(encargado, stockpulse, "Consulta stock, recibe alertas")
    Rel(admin, stockpulse, "Administra catálogo y usuarios")
    Rel(stockpulse, email, "Podría notificar (fuera de alcance del MVP)")
```

## 2. Contenedores (C4 Nivel 2)

```mermaid
C4Container
    title Contenedores de StockPulse

    Person(usuario, "Usuario (Cajero/Encargado/Admin)")

    Container(spa, "Frontend Next.js", "React/Next.js", "Dashboard, ventas, alertas en vivo")
    Container(api, "Backend API", "Spring Boot 3 / Java 17", "REST + WebSocket (STOMP), lógica de negocio")
    ContainerDb(db, "PostgreSQL", "Base de datos relacional", "Productos, stock, ventas, usuarios")

    Rel(usuario, spa, "Usa", "HTTPS")
    Rel(spa, api, "Consume", "REST/JSON + WebSocket")
    Rel(api, db, "Lee/Escribe", "JDBC")
```

## 3. Componentes del Backend (C4 Nivel 3) — Hexagonal / Clean Architecture

```mermaid
C4Component
    title Componentes internos del Backend

    Container_Boundary(api, "Backend API") {
        Component(controller, "Presentation Layer", "Controllers, DTOs", "Expone REST, valida entrada, traduce errores")
        Component(usecase, "Application Layer", "Use Cases", "Orquesta reglas de negocio y transacciones")
        Component(domain, "Domain Layer", "Entities, Value Objects, Domain Events", "Reglas puras, sin dependencias de framework")
        Component(persistence, "Infrastructure: Persistence", "JPA Repositories", "Adaptador hacia PostgreSQL")
        Component(ws, "Infrastructure: WebSocket", "STOMP Publisher", "Publica eventos de dominio a clientes suscritos")
        Component(security, "Infrastructure: Security", "JWT Filter, Spring Security", "Autenticación y autorización")
    }

    Rel(controller, usecase, "Invoca")
    Rel(usecase, domain, "Usa reglas de")
    Rel(usecase, persistence, "Persiste vía puerto")
    Rel(domain, ws, "Emite evento -> listener publica")
    Rel(controller, security, "Protegido por")
```

**Regla de dependencia (la que defiendes en entrevista):** las flechas de dependencia de código siempre apuntan HACIA el dominio. `domain/` no importa nada de `infrastructure/` ni de Spring. Si un test unitario del dominio necesita un mock de Spring, es una señal de que la capa está mal separada.

## 4. Flujo crítico 1 — Venta con control de concurrencia

```mermaid
sequenceDiagram
    participant C1 as Cajero A (Sucursal 1)
    participant C2 as Cajero B (Sucursal 1)
    participant API as StockPulse API
    participant DB as PostgreSQL

    C1->>API: POST /sales (producto X, cantidad 1)
    C2->>API: POST /sales (producto X, cantidad 1)
    API->>DB: SELECT stock WHERE producto=X (version=5)
    API->>DB: SELECT stock WHERE producto=X (version=5)
    API->>DB: UPDATE stock SET cantidad=cantidad-1, version=6 WHERE version=5
    DB-->>API: OK (1 fila afectada) -> Venta A confirmada
    API->>DB: UPDATE stock SET cantidad=cantidad-1, version=6 WHERE version=5
    DB-->>API: 0 filas afectadas -> OptimisticLockException
    API-->>C2: 409 Conflict "Stock modificado, reintente"
```

## 5. Flujo crítico 2 — Alerta de bajo stock en tiempo real

```mermaid
sequenceDiagram
    participant UC as Use Case (RegistrarVenta)
    participant DOM as Domain Event Publisher
    participant LIS as LowStockEventListener (@Async)
    participant WS as WebSocket Publisher (STOMP)
    participant DASH as Dashboard (Next.js)

    UC->>DOM: Publica LowStockEvent(productoId, sucursalId, stockActual)
    DOM->>LIS: Notifica de forma asíncrona
    LIS->>WS: Envía payload al topic /topic/stock-alerts/{sucursalId}
    WS->>DASH: Push en tiempo real (sin polling)
```

## 6. Decisiones de arquitectura (ADR resumido)

| # | Decisión | Alternativas descartadas | Justificación |
|---|---|---|---|
| ADR-01 | Clean/Hexagonal Architecture | Arquitectura en capas tradicional (Controller-Service-Repository plano) | Permite testear reglas de negocio sin levantar contexto de Spring; aísla el dominio de cambios de framework |
| ADR-02 | Locking optimista (`@Version`) | Locking pesimista (`SELECT FOR UPDATE`) | El conflicto es poco frecuente; pesimista introduce contención innecesaria en el camino feliz |
| ADR-03 | Domain Events + listener asíncrono para alertas | Llamar directo al WebSocket desde el use case | Desacopla "vender" de "notificar"; se puede agregar un canal nuevo (ej. email) sin tocar el caso de uso |
| ADR-04 | JWT stateless (sin sesión de servidor) | Sesiones con Redis | Permite escalar horizontalmente sin sticky sessions; más simple para un MVP de portafolio |
| ADR-05 | Flyway para migraciones | Hibernate `ddl-auto=update` | Esquema versionado y reproducible en CI; `ddl-auto` es inaceptable en un sistema con datos reales |

## 7. Seguridad — flujo de autenticación

```mermaid
sequenceDiagram
    participant U as Usuario
    participant API as StockPulse API
    participant DB as PostgreSQL

    U->>API: POST /auth/login (email, password)
    API->>DB: Busca usuario, verifica hash bcrypt
    API-->>U: 200 OK { accessToken (15 min), refreshToken (7 días) }
    U->>API: GET /api/v1/products (Authorization: Bearer accessToken)
    API->>API: JwtFilter valida firma y expiración
    API-->>U: 200 OK
```

## 8. Referencias cruzadas

- Modelo de entidades detallado: `docs/entities.md` (o sección de entidades del documento de setup previo)
- Requerimientos funcionales: `docs/requirements-functional.md`
- Requerimientos no funcionales: `docs/requirements-non-functional.md`
- Historias de usuario: `docs/user-stories.md`