# 🏗️ Guide d'Architecture - Booking Service

> Guide complet pour comprendre l'architecture Clean Architecture de ce projet, du contrôleur à la base de données.

## 📚 Table des matières

1. [Introduction à la Clean Architecture](#introduction)
2. [Vue d'ensemble du projet](#vue-densemble)
3. [Le voyage d'une requête HTTP](#le-voyage-dune-requête-http)
4. [Les 4 couches de l'architecture](#les-4-couches)
5. [Composants détaillés](#composants-détaillés)
6. [Exemples concrets](#exemples-concrets)
7. [Prisma expliqué simplement](#prisma-expliqué)
8. [FAQ](#faq)

---

## 🎯 Introduction à la Clean Architecture {#introduction}

### Qu'est-ce que la Clean Architecture ?

La **Clean Architecture** est une façon d'organiser le code en couches séparées, où chaque couche a une responsabilité précise. L'objectif principal est de **séparer la logique métier** (les règles de votre application) de **l'infrastructure** (base de données, web, etc.).

### Principe fondamental : La règle de dépendance

```
┌─────────────────────────────────────────┐
│  Présentation (Controllers, DTOs)      │  ← Couche externe
├─────────────────────────────────────────┤
│  Application (Use Cases)                │
├─────────────────────────────────────────┤
│  Domain (Entités, Business Logic)      │  ← Couche interne
├─────────────────────────────────────────┤
│  Infrastructure (Prisma, BDD, HTTP)     │
└─────────────────────────────────────────┘

👉 Les flèches de dépendance vont toujours VERS L'INTÉRIEUR
```

**Règle d'or** : Les couches internes (Domain) ne connaissent JAMAIS les couches externes. Le Domain ne sait pas qu'il y a une base de données ou des contrôleurs HTTP.

### Pourquoi utiliser Clean Architecture ?

✅ **Testabilité** : Vous pouvez tester votre logique métier sans base de données  
✅ **Flexibilité** : Changer de base de données (PostgreSQL → MongoDB) sans toucher à la logique  
✅ **Maintenabilité** : Code organisé et facile à comprendre  
✅ **Indépendance** : Votre métier ne dépend d'aucun framework  

---

## 🗺️ Vue d'ensemble du projet {#vue-densemble}

### Structure du projet

```
bookingService/
├── src/
│   ├── presentation/          # 🌐 Couche HTTP (Controllers, DTOs)
│   │   ├── controllers/       # Points d'entrée HTTP
│   │   ├── dto/              # Objets de transfert de données
│   │   └── mappers/          # Conversion entre couches
│   │
│   ├── application/           # 💼 Logique applicative (Use Cases)
│   │   └── uses-case/        # Cas d'utilisation métier
│   │
│   ├── domain/                # 🎯 Cœur métier (Entités, Règles)
│   │   ├── entities/         # Objets métier purs
│   │   ├── repositories/     # Interfaces (contrats)
│   │   └── ValueObject/      # Valeurs immuables
│   │
│   └── infrastructure/        # 🔧 Détails techniques
│       ├── database/         # Prisma et migrations
│       ├── adapters/         # Implémentations concrètes
│       └── http/             # Services externes
│
├── prisma.config.ts          # Configuration Prisma
└── docker-compose.yml        # PostgreSQL en conteneur
```

### Technologies utilisées

| Technologie | Rôle | Pourquoi |
|-------------|------|----------|
| **NestJS** | Framework HTTP | Structure et injection de dépendances |
| **Prisma** | ORM | Communique avec PostgreSQL |
| **PostgreSQL** | Base de données | Stockage des données |
| **Swagger** | Documentation API | Interface de test interactive |
| **TypeScript** | Langage | Typage fort pour moins d'erreurs |

---

## 🚀 Le voyage d'une requête HTTP {#le-voyage-dune-requête-http}

Suivons une requête **"Créer une réservation"** de bout en bout :

### 📍 Étape 1 : Le client envoie une requête

```http
POST http://localhost:3000/bookings
Content-Type: application/json

{
  "userId": "user-123",
  "showtimeId": "show-456",
  "seatIds": ["A1", "A2"],
  "totalPrice": 25.50,
  "tickets": [...]
}
```

### 📍 Étape 2 : Le Controller reçoit la requête

**Fichier** : `src/presentation/controllers/BookingController.ts`

```typescript
@Controller('bookings')
export class BookingController {
  
  @Post()
  async create(@Body() request: CreateBookingRequest) {
    // 1. On reçoit un objet HTTP (Request DTO)
    // 2. On le transforme en DTO application avec le Mapper
    const dto = BookingMapper.toCreateDto(request);
    
    // 3. On appelle le Use Case
    const booking = await this.createBookingUseCase.execute(dto);
    
    // 4. On transforme l'entité en Response DTO
    return BookingMapper.toResponse(booking);
  }
}
```

**Rôle du Controller** :
- 🎯 Point d'entrée de l'API
- 📝 Valide le format HTTP
- 🔄 Transforme les données (Request → DTO → Entity → Response)
- ⚡ Délègue la logique métier au Use Case

### 📍 Étape 3 : Le Mapper transforme les données

**Fichier** : `src/presentation/mappers/BookingMapper.ts`

```typescript
export class BookingMapper {
  static toCreateDto(request: CreateBookingRequest): CreateBookingDto {
    // Transforme un objet HTTP en DTO application
    return new CreateBookingDto(
      request.userId,
      request.showtimeId,
      request.seatIds,
      request.totalPrice,
      request.tickets.map(t => ({...}))
    );
  }
}
```

**Pourquoi un Mapper ?**
- 🛡️ **Isolation** : La couche application ne connaît pas les détails HTTP
- 🔄 **Transformation** : Adapte les formats entre couches
- 🧪 **Testabilité** : On peut tester le Use Case sans HTTP

### 📍 Étape 4 : Le Use Case exécute la logique métier

**Fichier** : `src/application/uses-case/booking/createbooking/CreateBookingUseCase.ts`

```typescript
export class CreateBookingUseCase {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly authService: IAuthServicePort
  ) {}
  
  async execute(dto: CreateBookingDto): Promise<Booking> {
    // 1. Valider l'utilisateur via le service Auth
    const user = await this.authService.validateUser(dto.userId);
    if (!user) throw new Error('Unauthorized');
    
    // 2. Créer l'entité métier avec ses règles
    const booking = Booking.createBooking(
      dto.userId,
      dto.showtimeId,
      dto.seatIds,
      dto.totalPrice,
      dto.tickets.map(t => new Ticket(...))
    );
    
    // 3. Sauvegarder via le repository
    return await this.bookingRepository.create(booking);
  }
}
```

**Rôle du Use Case** :
- 💼 Contient la **logique métier** de l'application
- 🎭 Orchestre les différents acteurs (repositories, services)
- ✅ Applique les **règles métier** (validations, calculs)
- 🔌 Utilise des **interfaces** (IBookingRepository) et non des implémentations

### 📍 Étape 5 : L'Entité applique les règles métier

**Fichier** : `src/domain/entities/booking/Booking.ts`

```typescript
export class Booking {
  constructor(
    public id: string,
    public userId: string,
    public showtimeId: string,
    public status: BookingStatus,
    public seatIds: string[],
    public totalPrice: number,
    public tickets: Ticket[]
  ) {}
  
  static createBooking(...): Booking {
    // Règles métier lors de la création
    if (seatIds.length === 0) {
      throw new Error('At least one seat is required');
    }
    
    return new Booking(
      crypto.randomUUID(),
      userId,
      showtimeId,
      BookingStatus.PENDING,  // Statut initial
      seatIds,
      totalPrice,
      tickets
    );
  }
  
  updateStatus(newStatus: BookingStatus): void {
    // Règles métier pour changer de statut
    if (this.status === BookingStatus.CANCELLED) {
      throw new Error('Cannot update cancelled booking');
    }
    this.status = newStatus;
  }
}
```

**Rôle de l'Entité** :
- 🎯 **Cœur métier pur** : contient les règles business
- 🚫 **Aucune dépendance** : ne connaît ni la BDD ni HTTP
- 🔒 **Encapsulation** : protège l'intégrité des données
- ✨ **Factory methods** : `createBooking()` assure la cohérence

### 📍 Étape 6 : Le Repository sauvegarde en base

**Fichier** : `src/infrastructure/database/repository/PrismaBookingRepository.ts`

```typescript
export class PrismaBookingRepository implements IBookingRepository {
  constructor(private readonly prisma: PrismaService) {}
  
  async create(booking: Booking): Promise<Booking> {
    // 1. Transformer l'entité en format Prisma
    const data = {
      id: booking.id,
      userId: booking.userId,
      showtimeId: booking.showtimeId,
      status: booking.status,
      seatIds: booking.seatIds,
      totalPrice: new Prisma.Decimal(booking.totalPrice),
      tickets: {
        create: booking.tickets.map(t => ({
          id: t.id,
          price: new Prisma.Decimal(t.price),
          // ...
        }))
      }
    };
    
    // 2. Appeler Prisma pour insérer en BDD
    const saved = await this.prisma.booking.create({
      data,
      include: { tickets: true }  // Récupère aussi les tickets
    });
    
    // 3. Transformer le résultat Prisma en entité
    return this.toDomain(saved);
  }
  
  private toDomain(prismaBooking: any): Booking {
    // Conversion Prisma → Entité Domain
    return new Booking(
      prismaBooking.id,
      prismaBooking.userId,
      // ...
      prismaBooking.tickets.map(t => new Ticket(...))
    );
  }
}
```

**Rôle du Repository** :
- 💾 **Accès aux données** : CRUD sur la base de données
- 🔄 **Traduction** : Prisma ↔ Entité Domain
- 🎭 **Abstraction** : Le Use Case ne sait pas que c'est Prisma
- 📦 **Implémentation** : Réalise l'interface `IBookingRepository`

### 📍 Étape 7 : Prisma communique avec PostgreSQL

**Fichier** : `src/infrastructure/database/prisma/schema.prisma`

```prisma
model Booking {
  id          String        @id @default(uuid())
  userId      String
  showtimeId  String
  status      BookingStatus @default(PENDING)
  seatIds     String[]
  totalPrice  Decimal       @db.Decimal(10, 2)
  tickets     Ticket[]      @relation("BookingTickets")
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}
```

**Ce qui se passe ici** :
```sql
-- Prisma génère et exécute cette requête SQL :
INSERT INTO "Booking" (
  "id", "userId", "showtimeId", "status", 
  "seatIds", "totalPrice", "createdAt", "updatedAt"
) VALUES (
  'booking-uuid', 'user-123', 'show-456', 'PENDING',
  ARRAY['A1', 'A2'], 25.50, NOW(), NOW()
);
```

### 📍 Étape 8 : Retour de la réponse au client

```typescript
// Le Controller reçoit l'entité Booking
const booking = await this.createBookingUseCase.execute(dto);

// Le Mapper transforme en Response DTO
return BookingMapper.toResponse(booking);

// Le client reçoit :
{
  "id": "booking-uuid",
  "userId": "user-123",
  "status": "PENDING",
  "totalPrice": 25.50,
  "tickets": [...]
}
```

### 🔄 Schéma récapitulatif

```
Client HTTP
    ↓ POST /bookings
┌─────────────────────────────────────────────────────┐
│ 1. PRÉSENTATION (HTTP)                              │
│    BookingController.create()                       │
│    - Reçoit CreateBookingRequest                    │
│    - Mapper.toCreateDto() → CreateBookingDto        │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ 2. APPLICATION (Use Cases)                          │
│    CreateBookingUseCase.execute()                   │
│    - Valide l'utilisateur (AuthService)             │
│    - Crée l'entité Booking                          │
│    - Appelle bookingRepository.create()             │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ 3. DOMAIN (Entités)                                 │
│    Booking.createBooking()                          │
│    - Applique les règles métier                     │
│    - Retourne un objet Booking valide               │
└──────────────────────┬──────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ 4. INFRASTRUCTURE (Persistence)                     │
│    PrismaBookingRepository.create()                 │
│    - Transforme Booking → Prisma format             │
│    - prisma.booking.create() → SQL                  │
└──────────────────────┬──────────────────────────────┘
                       ↓
                 PostgreSQL
```

---

## 🏛️ Les 4 couches de l'architecture {#les-4-couches}

### 1️⃣ Couche PRÉSENTATION (Presentation Layer)

**Localisation** : `src/presentation/`

**Responsabilités** :
- 🌐 Gérer les entrées/sorties HTTP
- 📝 Valider les formats de requêtes
- 🔄 Transformer les données (Mappers)
- 📚 Générer la documentation Swagger

**Composants** :

#### Controllers
```typescript
// src/presentation/controllers/BookingController.ts
// Point d'entrée HTTP, définit les routes
@Controller('bookings')
export class BookingController {
  @Post()           // → POST /bookings
  @Get(':id')       // → GET /bookings/:id
  @Put(':id')       // → PUT /bookings/:id
  @Delete(':id')    // → DELETE /bookings/:id
}
```

#### DTOs Request
```typescript
// src/presentation/dto/request/BookingRequest.ts
// Format attendu par le Controller
export interface CreateBookingRequest {
  userId: string;
  showtimeId: string;
  seatIds: string[];
  totalPrice: number;
  tickets: CreateTicketRequest[];
}
```

#### DTOs Response
```typescript
// src/presentation/dto/response/BookingResponse.ts
// Format renvoyé au client
export interface BookingResponse {
  id: string;
  userId: string;
  status: BookingStatus;
  totalPrice: number;
  tickets: TicketResponse[];
  createdAt?: Date;
}
```

#### Mappers
```typescript
// src/presentation/mappers/BookingMapper.ts
// Convertit Request → Application DTO
// Convertit Entity → Response
export class BookingMapper {
  static toCreateDto(request: CreateBookingRequest): CreateBookingDto
  static toUpdateDto(id: string, request: UpdateBookingRequest): UpdateBookingDto
  static toResponse(booking: Booking): BookingResponse
  static toResponseArray(bookings: Booking[]): BookingResponse[]
}
```

**Principe** : Cette couche ne contient AUCUNE logique métier, seulement de la transformation de données.

---

### 2️⃣ Couche APPLICATION (Application Layer)

**Localisation** : `src/application/uses-case/`

**Responsabilités** :
- 💼 Orchestrer la logique métier
- 🎯 Implémenter les cas d'utilisation
- 🔌 Coordonner Domain et Infrastructure
- ✅ Valider les données métier

**Structure** :
```
application/
└── uses-case/
    ├── booking/
    │   ├── createbooking/
    │   │   ├── CreateBookingDto.ts        # DTO application
    │   │   └── CreateBookingUseCase.ts    # Logique
    │   ├── confirmBooking/
    │   ├── cancelBooking/
    │   └── ...
    └── ticket/
        └── ...
```

#### Use Case Example
```typescript
// src/application/uses-case/booking/confirmBooking/ConfirmBookingUseCase.ts

export class ConfirmBookingUseCase {
  constructor(
    @Inject('IBookingRepository')
    private readonly bookingRepository: IBookingRepository
  ) {}
  
  async execute(dto: ConfirmBookingDto): Promise<void> {
    // 1. Récupérer l'entité
    const booking = await this.bookingRepository.findById(dto.bookingId);
    if (!booking) throw new Error('Booking not found');
    
    // 2. Appliquer la règle métier (via l'entité)
    booking.updateStatus(BookingStatus.CONFIRMED);
    
    // 3. Persister le changement
    await this.bookingRepository.update(booking);
  }
}
```

#### Application DTO
```typescript
// src/application/uses-case/booking/confirmBooking/ConfirmBookingDto.ts
export class ConfirmBookingDto {
  constructor(public readonly bookingId: string) {}
}
```

**Principe** : Les Use Cases orchestrent, mais les **règles métier** sont dans les **entités**.

---

### 3️⃣ Couche DOMAIN (Domain Layer)

**Localisation** : `src/domain/`

**Responsabilités** :
- 🎯 **Cœur de l'application** : règles métier pures
- 🚫 Aucune dépendance vers l'extérieur
- 🔒 Protéger l'intégrité des données
- 📐 Définir les contrats (interfaces)

**Structure** :
```
domain/
├── entities/           # Objets métier
│   ├── booking/
│   │   └── Booking.ts
│   └── Ticket.ts
├── repositories/       # Interfaces (contrats)
│   ├── IBookingRepository.ts
│   └── ITicketRepository.ts
└── ValueObject/        # Valeurs immuables
    ├── BookingStatus.ts
    └── User.ts
```

#### Entité (Entity)
```typescript
// src/domain/entities/booking/Booking.ts

export class Booking {
  constructor(
    public id: string,
    public userId: string,
    public showtimeId: string,
    public status: BookingStatus,
    public seatIds: string[],
    public totalPrice: number,
    public tickets: Ticket[]
  ) {}
  
  // Factory method : création avec règles métier
  static createBooking(
    userId: string,
    showtimeId: string,
    seatIds: string[],
    totalPrice: number,
    tickets: Ticket[]
  ): Booking {
    // ✅ Validation métier
    if (seatIds.length === 0) {
      throw new Error('At least one seat required');
    }
    if (totalPrice <= 0) {
      throw new Error('Total price must be positive');
    }
    
    return new Booking(
      crypto.randomUUID(),
      userId,
      showtimeId,
      BookingStatus.PENDING,  // Toujours PENDING à la création
      seatIds,
      totalPrice,
      tickets
    );
  }
  
  // Méthode métier : changer de statut
  updateStatus(newStatus: BookingStatus): void {
    // ✅ Règles de transition de statut
    if (this.status === BookingStatus.CANCELLED) {
      throw new Error('Cannot update cancelled booking');
    }
    if (this.status === BookingStatus.REFUNDED) {
      throw new Error('Cannot update refunded booking');
    }
    this.status = newStatus;
  }
  
  // Méthode métier : mettre à jour les sièges
  updateSeats(newSeatIds: string[]): void {
    if (this.status !== BookingStatus.PENDING) {
      throw new Error('Can only update seats for pending bookings');
    }
    this.seatIds = newSeatIds;
  }
}
```

#### Value Object
```typescript
// src/domain/ValueObject/BookingStatus.ts

export enum BookingStatus {
  PENDING = 'PENDING',       // En attente de confirmation
  CONFIRMED = 'CONFIRMED',   // Confirmée
  CANCELLED = 'CANCELLED',   // Annulée
  REFUNDED = 'REFUNDED'      // Remboursée
}
```

#### Interface Repository (Contrat)
```typescript
// src/domain/repositories/IBookingRepository.ts

export interface IBookingRepository {
  create(booking: Booking): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  findAll(): Promise<Booking[]>;
  findByUserId(userId: string): Promise<Booking[]>;
  update(booking: Booking): Promise<void>;
  delete(id: string): Promise<void>;
}
```

**Principe** : Le Domain **définit des contrats** (interfaces) mais ne les implémente PAS. L'implémentation est dans Infrastructure.

---

### 4️⃣ Couche INFRASTRUCTURE (Infrastructure Layer)

**Localisation** : `src/infrastructure/`

**Responsabilités** :
- 💾 Accès à la base de données (Prisma)
- 🌐 Appels HTTP vers services externes
- 🔌 Implémentation des interfaces du Domain
- 🛠️ Détails techniques (configuration, etc.)

**Structure** :
```
infrastructure/
├── database/
│   ├── prisma/
│   │   ├── schema.prisma      # Schéma BDD
│   │   ├── migrations/        # Historique des migrations
│   │   └── seed.ts            # Données de test
│   └── repository/
│       ├── PrismaBookingRepository.ts
│       └── PrismaTicketRepository.ts
├── adapters/
│   └── external/
│       └── MockAuthService.ts
└── http/
    ├── PrismaService.ts
    └── AuthService.ts
```

#### Repository Implementation
```typescript
// src/infrastructure/database/repository/PrismaBookingRepository.ts

@Injectable()
export class PrismaBookingRepository implements IBookingRepository {
  constructor(private readonly prisma: PrismaService) {}
  
  async create(booking: Booking): Promise<Booking> {
    // Transformation Entity → Prisma
    const data = {
      id: booking.id,
      userId: booking.userId,
      showtimeId: booking.showtimeId,
      status: booking.status,
      seatIds: booking.seatIds,
      totalPrice: new Prisma.Decimal(booking.totalPrice),
      tickets: {
        create: booking.tickets.map(ticket => ({
          id: ticket.id,
          price: new Prisma.Decimal(ticket.price),
          seatIds: ticket.seatIds,
          seatLabel: ticket.seatLabel,
          showtimeId: ticket.showtimeId,
          userId: ticket.userId
        }))
      }
    };
    
    // Appel Prisma
    const saved = await this.prisma.booking.create({
      data,
      include: { tickets: true }
    });
    
    // Transformation Prisma → Entity
    return this.toDomain(saved);
  }
  
  private toDomain(data: any): Booking {
    return new Booking(
      data.id,
      data.userId,
      data.showtimeId,
      data.status as BookingStatus,
      data.seatIds,
      data.totalPrice.toNumber(),  // Decimal → number
      data.tickets.map(t => new Ticket(
        t.id,
        t.price.toNumber(),
        t.seatIds,
        t.seatLabel,
        t.showtimeId,
        t.userId,
        t.bookingId
      ))
    );
  }
}
```

**Principe** : Les repositories **implémentent** les interfaces définies dans le Domain.

---

## 🧩 Composants détaillés {#composants-détaillés}

### 📦 Nest JS Module (BookingModule)

**Fichier** : `src/presentation/BookingModule.ts`

Le module NestJS configure **l'injection de dépendances** :

```typescript
@Module({
  imports: [InfrastructureModule, DomainModule],
  controllers: [BookingController, TicketController],
  providers: [
    // Repositories
    {
      provide: 'IBookingRepository',
      useClass: PrismaBookingRepository
    },
    {
      provide: 'ITicketRepository',
      useClass: PrismaTicketRepository
    },
    
    // External Services
    {
      provide: 'IAuthServicePort',
      useClass: MockAuthService
    },
    
    // Use Cases
    CreateBookingUseCase,
    GetBookingByIdUseCase,
    ConfirmBookingUseCase,
    // ... tous les autres Use Cases
  ]
})
export class BookingModule {}
```

**Ce qui se passe** :
1. NestJS **crée une instance** de chaque Use Case
2. Il **injecte automatiquement** les dépendances dans les constructeurs
3. Exemple : `CreateBookingUseCase` reçoit automatiquement `PrismaBookingRepository`

---

### 🗄️ Prisma expliqué {#prisma-expliqué}

#### Qu'est-ce que Prisma ?

**Prisma** est un **ORM** (Object-Relational Mapping) : il fait le **pont entre votre code TypeScript et la base de données SQL**.

#### Les 3 composants de Prisma

1. **Prisma Schema** (`schema.prisma`)
   - Décrit la structure de votre base de données
   - Définit les tables et leurs relations

2. **Prisma Client**
   - Code TypeScript généré automatiquement
   - API typée pour interroger la BDD

3. **Prisma Migrate**
   - Gère les changements de schéma
   - Crée les migrations SQL

#### Schéma Prisma

```prisma
// src/infrastructure/database/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
  output   = "./generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  REFUNDED
}

model Booking {
  id          String        @id @default(uuid())
  userId      String
  showtimeId  String
  status      BookingStatus @default(PENDING)
  seatIds     String[]
  totalPrice  Decimal       @db.Decimal(10, 2)
  
  // Relation 1-N avec Ticket
  tickets     Ticket[]      @relation("BookingTickets")
  
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  
  @@index([userId])
  @@index([showtimeId])
}

model Ticket {
  id          String   @id @default(uuid())
  price       Decimal  @db.Decimal(10, 2)
  seatIds     String[]
  seatLabel   String?
  showtimeId  String
  userId      String
  
  // Relation N-1 avec Booking
  bookingId   String?
  booking     Booking? @relation("BookingTickets", fields: [bookingId], references: [id], onDelete: Cascade)
  
  @@index([bookingId])
  @@index([userId])
}
```

**Explications** :

| Annotation | Signification |
|------------|---------------|
| `@id` | Clé primaire |
| `@default(uuid())` | Génère automatiquement un UUID |
| `@default(now())` | Date actuelle par défaut |
| `@updatedAt` | Se met à jour automatiquement |
| `@db.Decimal(10, 2)` | Type SQL : décimal avec 10 chiffres dont 2 après la virgule |
| `String[]` | Array de strings (tableau) |
| `@relation(...)` | Définit une relation entre tables |
| `onDelete: Cascade` | Supprime les tickets si la réservation est supprimée |
| `@@index([userId])` | Crée un index pour optimiser les recherches |

#### Commandes Prisma essentielles

```bash
# 1. Générer le client Prisma (à faire après chaque modification du schema)
npx prisma generate

# 2. Créer une migration (après avoir modifié le schema)
npx prisma migrate dev --name add-new-field

# 3. Appliquer les migrations en production
npx prisma migrate deploy

# 4. Réinitialiser la BDD (⚠️ efface toutes les données)
npx prisma migrate reset

# 5. Ouvrir Prisma Studio (interface graphique pour voir les données)
npx prisma studio

# 6. Vérifier l'état des migrations
npx prisma migrate status
```

#### Configuration Prisma personnalisée

**Fichier** : `prisma.config.ts`

```typescript
export default {
  schema: 'src/infrastructure/database/prisma/schema.prisma',
  migrations: 'src/infrastructure/database/prisma/migrations',
  seed: 'tsx src/infrastructure/database/prisma/seed.ts'
};
```

**Pourquoi ?** Par défaut, Prisma cherche `prisma/schema.prisma`. Ici, on personnalise le chemin pour respecter la Clean Architecture.

#### Types Prisma spéciaux

```typescript
// Prisma.Decimal : pour les prix et montants précis
const price = new Prisma.Decimal(12.75);

// Conversion Decimal → number
const priceNumber = price.toNumber();  // 12.75

// Include : récupérer les relations
await prisma.booking.findMany({
  include: { tickets: true }  // Charge aussi les tickets
});

// Where : filtrer
await prisma.booking.findMany({
  where: { userId: 'user-123' }
});

// Create avec relations
await prisma.booking.create({
  data: {
    userId: 'user-123',
    tickets: {
      create: [{ price: 12.75, ... }]  // Crée les tickets en même temps
    }
  }
});
```

---

### 📚 Swagger Documentation

#### Configuration Swagger

**Fichier** : `src/main.ts`

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('Booking Service API')
    .setDescription('RESTful API for cinema bookings')
    .setVersion('1.0.0')
    .addTag('Bookings', 'Booking management endpoints')
    .addTag('Tickets', 'Ticket management endpoints')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);  // Accessible à /docs
  
  await app.listen(3000);
}
```

#### Décorateurs Swagger

```typescript
@ApiTags('Bookings')  // Groupe dans Swagger
@Controller('bookings')
export class BookingController {
  
  @Post()
  @ApiOperation({ 
    summary: 'Create a new booking',
    description: 'Creates a new booking with tickets for a showtime'
  })
  @ApiBody({ type: CreateBookingRequestSwagger })
  @ApiResponse({ 
    status: 201, 
    description: 'Booking created successfully',
    type: BookingResponseSwagger 
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 401, description: 'Unauthorized user' })
  async create(@Body() request: CreateBookingRequest) {
    // ...
  }
}
```

#### Classes Swagger pour la documentation

```typescript
// src/presentation/dto/request/BookingRequest.swagger.ts

export class CreateBookingRequestSwagger {
  @ApiProperty({ description: 'User ID', example: 'user-123' })
  userId: string;
  
  @ApiProperty({ description: 'Showtime ID', example: 'show-456' })
  showtimeId: string;
  
  @ApiProperty({ 
    description: 'Array of seat IDs', 
    example: ['A1', 'A2'],
    type: [String]
  })
  seatIds: string[];
  
  @ApiProperty({ description: 'Total price', example: 25.50 })
  totalPrice: number;
}
```

**Pourquoi des classes séparées pour Swagger ?**
- Les classes Swagger sont décorées avec `@ApiProperty`
- Les DTOs métier n'ont pas besoin de ces décorateurs
- Séparation des responsabilités : documentation vs logique

---

## 💡 Exemples concrets {#exemples-concrets}

### Exemple 1 : Créer une réservation

#### 1. Requête HTTP

```bash
curl -X POST http://localhost:3000/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "showtimeId": "show-456",
    "seatIds": ["A1", "A2"],
    "totalPrice": 25.50,
    "tickets": [
      {
        "price": 12.75,
        "seatIds": ["A1"],
        "seatLabel": "Seat A1",
        "showtimeId": "show-456",
        "userId": "user-123"
      },
      {
        "price": 12.75,
        "seatIds": ["A2"],
        "seatLabel": "Seat A2",
        "showtimeId": "show-456",
        "userId": "user-123"
      }
    ]
  }'
```

#### 2. Flux complet

```
BookingController.create()
  ↓
BookingMapper.toCreateDto()
  ↓
CreateBookingUseCase.execute()
  ├─→ authService.validateUser('user-123')  ✅ OK
  ├─→ Booking.createBooking(...)            ✅ Crée l'entité
  └─→ bookingRepository.create(booking)
        ↓
      PrismaBookingRepository.create()
        ├─→ Transformation Entity → Prisma format
        ├─→ prisma.booking.create({ data: {...} })
        │     ↓
        │   PostgreSQL INSERT
        │     ↓
        ├─→ Prisma retourne les données insérées
        └─→ Transformation Prisma → Entity
              ↓
            Retour au Use Case
              ↓
            Retour au Controller
              ↓
            BookingMapper.toResponse()
              ↓
            HTTP 201 Created avec BookingResponse JSON
```

#### 3. Réponse

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "userId": "user-123",
  "showtimeId": "show-456",
  "status": "PENDING",
  "seatIds": ["A1", "A2"],
  "totalPrice": 25.50,
  "tickets": [
    {
      "id": "ticket-uuid-1",
      "price": 12.75,
      "seatIds": ["A1"],
      "seatLabel": "Seat A1",
      "showtimeId": "show-456",
      "userId": "user-123"
    },
    {
      "id": "ticket-uuid-2",
      "price": 12.75,
      "seatIds": ["A2"],
      "seatLabel": "Seat A2",
      "showtimeId": "show-456",
      "userId": "user-123"
    }
  ],
  "createdAt": "2026-02-05T15:30:00Z",
  "updatedAt": "2026-02-05T15:30:00Z"
}
```

---

### Exemple 2 : Confirmer une réservation

#### 1. Requête

```bash
curl -X PUT http://localhost:3000/bookings/a1b2c3d4-e5f6-7890-abcd-ef1234567890/confirm
```

#### 2. Flux

```
BookingController.confirm()
  ↓
ConfirmBookingUseCase.execute({ bookingId: 'a1b2c3...' })
  ├─→ bookingRepository.findById('a1b2c3...')
  │     ↓ Prisma SELECT
  │     ↓ Retourne Booking(status=PENDING)
  │
  ├─→ booking.updateStatus(BookingStatus.CONFIRMED)
  │     ↓ Règle métier : PENDING → CONFIRMED ✅
  │
  └─→ bookingRepository.update(booking)
        ↓ Prisma UPDATE
        ↓ SET status='CONFIRMED'
```

#### 3. Réponse

```json
{
  "message": "Booking confirmed successfully"
}
```

---

### Exemple 3 : Annuler une réservation (avec validation)

#### 1. Requête

```bash
curl -X PUT http://localhost:3000/bookings/a1b2c3d4-e5f6-7890-abcd-ef1234567890/cancel \
  -H "Content-Type: application/json" \
  -d '{ "userId": "user-123" }'
```

#### 2. Flux

```
BookingController.cancel()
  ↓
CancelBookingUseCase.execute({ bookingId: 'a1b2c3...', userId: 'user-123' })
  ├─→ bookingRepository.findById('a1b2c3...')
  │     ↓ Retourne Booking(userId='user-123', status='CONFIRMED')
  │
  ├─→ Vérification : booking.userId === dto.userId ?
  │     ✅ OK, c'est le propriétaire
  │
  ├─→ booking.updateStatus(BookingStatus.CANCELLED)
  │     ↓ Règle métier : CONFIRMED → CANCELLED ✅
  │
  └─→ bookingRepository.update(booking)
        ↓ UPDATE bookings SET status='CANCELLED'
```

#### 3. Cas d'erreur

Si un autre utilisateur essaye d'annuler :

```
userId='user-456' tente d'annuler
  ↓
booking.userId='user-123' !== userId='user-456'
  ↓
throw new Error('Unauthorized: You can only cancel your own bookings')
  ↓
HTTP 401 Unauthorized
```

---

## ❓ FAQ {#faq}

### 🤔 Pourquoi séparer Request DTO et Application DTO ?

**Request DTO** (Presentation) :
- Format HTTP spécifique
- Peut contenir des données de sécurité, headers, etc.
- Lié au framework web (NestJS)

**Application DTO** (Use Cases) :
- Format métier pur
- Indépendant du transport (HTTP, CLI, GraphQL...)
- Testable sans serveur web

**Exemple** :
```typescript
// Request DTO : vient du JSON HTTP
interface CreateBookingRequest {
  userId: string;
  showtimeId: string;
  // ...
}

// Application DTO : format métier
class CreateBookingDto {
  constructor(
    public readonly userId: string,
    public readonly showtimeId: string,
    // ...
  ) {}
}
```

---

### 🤔 Pourquoi des interfaces dans Domain ?

**Principe** : Le Domain définit "CE DONT IL A BESOIN" mais pas "COMMENT".

```typescript
// Domain définit le contrat
interface IBookingRepository {
  create(booking: Booking): Promise<Booking>;
}

// Infrastructure implémente COMMENT (avec Prisma)
class PrismaBookingRepository implements IBookingRepository {
  async create(booking: Booking) {
    return await this.prisma.booking.create({...});
  }
}
```

**Avantages** :
- ✅ Testable : on peut créer un `MockBookingRepository` pour les tests
- ✅ Flexible : on peut changer de BDD sans toucher au Domain
- ✅ Inversion de dépendance : Domain ne dépend pas de Infrastructure

---

### 🤔 C'est quoi la différence Entité vs DTO ?

| Entité | DTO |
|--------|-----|
| Contient la **logique métier** | Juste un **conteneur de données** |
| A des **méthodes** | Que des **propriétés** |
| Vit dans **Domain** | Vit dans **Application ou Presentation** |
| Exemple : `booking.updateStatus()` | Exemple : `CreateBookingDto` |

```typescript
// Entité (Domain) : logique métier
class Booking {
  updateStatus(status: BookingStatus) {
    if (this.status === BookingStatus.CANCELLED) {
      throw new Error('Cannot update cancelled booking');
    }
    this.status = status;
  }
}

// DTO (Application) : transport de données
class ConfirmBookingDto {
  constructor(public readonly bookingId: string) {}
}
```

---

### 🤔 Pourquoi Prisma.Decimal au lieu de number ?

**Problème avec `number`** :
```javascript
0.1 + 0.2 = 0.30000000000000004  // ❌ Imprécis !
```

**Solution avec `Decimal`** :
```typescript
new Prisma.Decimal('0.1').plus('0.2') = 0.3  // ✅ Précis !
```

Pour l'argent (prix, montants), on utilise **TOUJOURS** `Decimal` en base de données.

```typescript
// En BDD (Prisma)
totalPrice  Decimal  @db.Decimal(10, 2)  // 10 chiffres, 2 décimales

// En code
const price = new Prisma.Decimal(12.75);
const priceNumber = price.toNumber();  // Conversion si besoin
```

---

### 🤔 C'est quoi `onDelete: Cascade` ?

```prisma
model Ticket {
  bookingId  String?
  booking    Booking? @relation(..., onDelete: Cascade)
}
```

**Signification** : Si on supprime une `Booking`, tous ses `Ticket` sont **automatiquement supprimés**.

```typescript
await bookingRepository.delete('booking-123');
// → DELETE FROM tickets WHERE booking_id = 'booking-123'
// → DELETE FROM bookings WHERE id = 'booking-123'
```

Sans `Cascade`, il faudrait supprimer manuellement les tickets avant.

---

### 🤔 Pourquoi `@Inject('IBookingRepository')` ?

**Injection de dépendances** : NestJS crée et fournit automatiquement les instances.

```typescript
// Dans le Use Case
constructor(
  @Inject('IBookingRepository')
  private readonly bookingRepository: IBookingRepository
) {}

// Dans le Module
providers: [
  {
    provide: 'IBookingRepository',  // Token
    useClass: PrismaBookingRepository  // Implémentation
  }
]
```

**Ce qui se passe** :
1. NestJS voit `@Inject('IBookingRepository')`
2. Cherche dans les providers : `'IBookingRepository'` → `PrismaBookingRepository`
3. Crée une instance de `PrismaBookingRepository`
4. L'injecte dans le Use Case

---

### 🤔 Comment ajouter un nouveau Use Case ?

**Étapes** :

1. **Créer le DTO** : `src/application/uses-case/booking/myNewUseCase/MyNewDto.ts`
2. **Créer le Use Case** : `MyNewUseCase.ts`
3. **L'enregistrer** dans `BookingModule.providers`
4. **L'utiliser** dans le Controller

**Exemple** :

```typescript
// 1. DTO
export class GetBookingByStatusDto {
  constructor(public readonly status: BookingStatus) {}
}

// 2. Use Case
export class GetBookingByStatusUseCase {
  constructor(
    @Inject('IBookingRepository')
    private readonly repository: IBookingRepository
  ) {}
  
  async execute(dto: GetBookingByStatusDto): Promise<Booking[]> {
    const all = await this.repository.findAll();
    return all.filter(b => b.status === dto.status);
  }
}

// 3. Module
providers: [
  // ...
  GetBookingByStatusUseCase,
]

// 4. Controller
@Get('status/:status')
async findByStatus(@Param('status') status: BookingStatus) {
  const dto = new GetBookingByStatusDto(status);
  const bookings = await this.getBookingByStatusUseCase.execute(dto);
  return BookingMapper.toResponseArray(bookings);
}
```

---

### 🤔 Comment tester un Use Case ?

Créer un **mock repository** :

```typescript
// test/mocks/MockBookingRepository.ts
export class MockBookingRepository implements IBookingRepository {
  private bookings: Booking[] = [];
  
  async create(booking: Booking): Promise<Booking> {
    this.bookings.push(booking);
    return booking;
  }
  
  async findById(id: string): Promise<Booking | null> {
    return this.bookings.find(b => b.id === id) || null;
  }
  
  // ...
}

// test/CreateBookingUseCase.spec.ts
describe('CreateBookingUseCase', () => {
  it('should create a booking', async () => {
    // Arrange
    const mockRepo = new MockBookingRepository();
    const mockAuth = new MockAuthService();
    const useCase = new CreateBookingUseCase(mockRepo, mockAuth);
    
    const dto = new CreateBookingDto('user-123', 'show-456', ...);
    
    // Act
    const result = await useCase.execute(dto);
    
    // Assert
    expect(result.userId).toBe('user-123');
    expect(result.status).toBe(BookingStatus.PENDING);
  });
});
```

---

## 🚀 Commandes utiles

### Démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer PostgreSQL (Docker)
docker-compose up -d

# 3. Générer le client Prisma
npx prisma generate

# 4. Lancer les migrations
npx prisma migrate dev

# 5. (Optionnel) Peupler la BDD avec des données de test
npx prisma db seed

# 6. Démarrer l'application
npm run start:dev

# 7. Ouvrir Swagger
# → http://localhost:3000/docs
```

### Développement

```bash
# Compiler TypeScript
npm run build

# Mode watch (recompile automatiquement)
npm run start:dev

# Voir les données en BDD
npx prisma studio

# Créer une nouvelle migration
npx prisma migrate dev --name my-migration-name

# Vérifier l'état des migrations
npx prisma migrate status
```

---

## 📖 Récapitulatif final

### Le flux complet d'une requête

```
1. HTTP Request
   ↓
2. Controller (Presentation)
   - Reçoit le Request DTO
   - Valide le format HTTP
   ↓
3. Mapper
   - Transforme Request DTO → Application DTO
   ↓
4. Use Case (Application)
   - Orchestre la logique métier
   - Appelle les services et repositories
   ↓
5. Entity (Domain)
   - Applique les règles métier
   - Retourne un objet valide
   ↓
6. Repository (Infrastructure)
   - Transforme Entity → Prisma format
   - Sauvegarde en BDD avec Prisma
   - Transforme Prisma → Entity
   ↓
7. Retour au Use Case
   ↓
8. Retour au Controller
   ↓
9. Mapper
   - Transforme Entity → Response DTO
   ↓
10. HTTP Response JSON
```

### Les 4 couches et leurs responsabilités

| Couche | Responsabilité | Dépendances |
|--------|----------------|-------------|
| **Presentation** | HTTP, Routing, Mappers | → Application |
| **Application** | Use Cases, Orchestration | → Domain |
| **Domain** | Entités, Règles métier | → Aucune ❗ |
| **Infrastructure** | BDD, APIs externes | → Domain (interfaces) |

### Règles à respecter

✅ **Domain** ne dépend de RIEN  
✅ **Application** dépend de Domain uniquement  
✅ **Infrastructure** implémente les interfaces de Domain  
✅ **Presentation** dépend de Application et utilise les Mappers  

❌ Domain ne connaît pas Prisma  
❌ Use Case ne connaît pas les Controllers  
❌ Entity ne connaît pas les DTOs  

---

## 🎓 Conclusion

Vous avez maintenant une compréhension complète de l'architecture de ce projet :

1. ✅ **Clean Architecture** : Séparation en 4 couches claire
2. ✅ **Prisma** : ORM pour communiquer avec PostgreSQL
3. ✅ **Use Cases** : Logique métier isolée et testable
4. ✅ **Repositories** : Abstraction de l'accès aux données
5. ✅ **DTOs et Mappers** : Isolation entre couches
6. ✅ **Swagger** : Documentation API interactive

**Pour aller plus loin** :
- Lisez le code en suivant une requête HTTP
- Testez les endpoints dans Swagger (`/docs`)
- Créez un nouveau Use Case en suivant les exemples
- Explorez Prisma Studio pour voir les données

Bon développement ! 🚀
