# Booking Service API

API REST pour la gestion des réservations de cinéma suivant les principes de Clean Architecture.

## 📋 Endpoints

### **Bookings**

#### Créer une réservation
```http
POST /bookings
Content-Type: application/json

{
  "userId": "user-123",
  "showtimeId": "show-456",
  "seatIds": ["A1", "A2"],
  "totalPrice": 25.50,
  "tickets": [
    {
      "id": "ticket-1",
      "price": 12.75,
      "seatIds": ["A1"],
      "seatLabel": "Seat A1",
      "showtimeId": "show-456",
      "userId": "user-123"
    }
  ]
}
```

#### Récupérer toutes les réservations
```http
GET /bookings
```

#### Récupérer une réservation par ID
```http
GET /bookings/:id
```

#### Récupérer les réservations d'un utilisateur
```http
GET /bookings/user/:userId
```

#### Mettre à jour une réservation
```http
PUT /bookings/:id
Content-Type: application/json

{
  "status": "CONFIRMED",
  "seatIds": ["A1", "A2"]
}
```

#### Confirmer une réservation
```http
PUT /bookings/:id/confirm
```

#### Annuler une réservation
```http
PUT /bookings/:id/cancel
Content-Type: application/json

{
  "userId": "user-123"
}
```

#### Rembourser une réservation
```http
PUT /bookings/:id/refund
Content-Type: application/json

{
  "userId": "user-123"
}
```

#### Supprimer une réservation
```http
DELETE /bookings/:id
Content-Type: application/json

{
  "userId": "user-123"
}
```

---

### **Tickets**

#### Créer un ticket
```http
POST /tickets
Content-Type: application/json

{
  "price": 12.75,
  "seatIds": ["A1"],
  "seatLabel": "Seat A1",
  "showtimeId": "show-456",
  "userId": "user-123",
  "bookingId": "booking-789"
}
```

#### Récupérer tous les tickets
```http
GET /tickets
```

#### Récupérer un ticket par ID
```http
GET /tickets/:id
```

#### Récupérer les tickets d'une réservation
```http
GET /tickets/booking/:bookingId
```

#### Mettre à jour un ticket
```http
PUT /tickets/:id
Content-Type: application/json

{
  "userId": "user-123",
  "price": 15.00,
  "seatIds": ["B2"],
  "seatLabel": "Seat B2"
}
```

#### Supprimer un ticket
```http
DELETE /tickets/:id
Content-Type: application/json

{
  "userId": "user-123"
}
```

---

## 🏗️ Architecture

```
src/
├── domain/                    # Couche Domaine (logique métier pure)
│   ├── entities/              # Entités métier
│   ├── value-objects/         # Objets valeur
│   └── repositories/          # Interfaces des repositories
│
├── application/               # Couche Application (cas d'usage)
│   └── uses-case/
│       ├── booking/           # Use cases Booking
│       └── ticket/            # Use cases Ticket
│
├── infrastructure/            # Couche Infrastructure
│   ├── database/
│   │   ├── prisma/            # Schema et migrations
│   │   └── repository/        # Implémentations Prisma
│   └── adapters/
│       └── external/          # Adaptateurs services externes
│
└── presentation/              # Couche Présentation
    ├── controllers/           # Controllers NestJS
    └── BookingModule.ts       # Module d'injection de dépendances
```

## 🔄 Workflow typique

1. **Client** → Envoie une requête HTTP
2. **Controller** → Valide et délègue au Use Case
3. **Use Case** → Exécute la logique métier
4. **Repository** → Accède à la base de données
5. **Response** → Retourne au client

## 🔐 Sécurité

- Validation du propriétaire pour les actions sensibles (cancel, delete, refund)
- Validation des transitions d'état (PENDING → CONFIRMED → CANCELLED → REFUNDED)

## 📦 Dépendances

- NestJS (Framework)
- Prisma (ORM)
- PostgreSQL (Base de données)
- uuid (Génération d'IDs)

## ⚠️ TODO

- [ ] Implémenter le vrai service Auth (remplacer MockAuthService)
- [ ] Ajouter des guards NestJS pour l'authentification
- [ ] Implémenter les services Cinema et Movie
- [ ] Ajouter la validation avec class-validator
- [ ] Ajouter des intercepteurs pour les logs
- [ ] Implémenter les events asynchrones
- [ ] Ajouter le cache Redis
