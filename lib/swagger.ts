import { createSwaggerSpec } from "next-swagger-doc";

export function getApiDocs() {
  return createSwaggerSpec({
    apiFolder: "app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Golden View API",
        version: "1.0.0",
        description:
          "API per la piattaforma Golden View — scopri i migliori spot per tramonto e alba.",
      },
      servers: [
        {
          url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
          description:
            process.env.NODE_ENV === "production" ? "Production" : "Development",
        },
      ],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: "next-auth.session-token",
            description: "Sessione NextAuth (impostata automaticamente al login)",
          },
        },
        schemas: {
          // ── Spot ──────────────────────────────────────────────
          Spot: {
            type: "object",
            properties: {
              id: { type: "string", example: "clxyz1234" },
              name: { type: "string", example: "Tramonto sul Lago di Como" },
              slug: { type: "string", example: "tramonto-sul-lago-di-como" },
              description: {
                type: "string",
                nullable: true,
                example: "Vista spettacolare dal promontorio nord.",
              },
              images: {
                type: "array",
                items: { type: "string", format: "uri" },
                example: ["https://utfs.io/f/abc123.jpg"],
              },
              latitude: { type: "number", nullable: true, example: 46.005 },
              longitude: { type: "number", nullable: true, example: 9.257 },
              address: { type: "string", nullable: true, example: "Via Lungolago 1" },
              place: { type: "string", nullable: true, example: "Como, Italia" },
              public: { type: "boolean", example: true },
              active: { type: "boolean", example: true },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
              userId: { type: "string", nullable: true },
              user: {
                nullable: true,
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string", nullable: true },
                  email: { type: "string", nullable: true },
                },
              },
            },
          },
          SpotWithDistance: {
            allOf: [
              { $ref: "#/components/schemas/Spot" },
              {
                type: "object",
                properties: {
                  distance: {
                    type: "number",
                    description: "Distanza in metri dallo spot (Haversine)",
                    example: 1234.5,
                  },
                },
              },
            ],
          },
          Pagination: {
            type: "object",
            properties: {
              page: { type: "integer", example: 1 },
              limit: { type: "integer", example: 10 },
              total: { type: "integer", example: 42 },
              totalPages: { type: "integer", example: 5 },
              hasNext: { type: "boolean", example: true },
              hasPrev: { type: "boolean", example: false },
            },
          },
          // ── Auth ──────────────────────────────────────────────
          User: {
            type: "object",
            properties: {
              id: { type: "string", example: "clxyz5678" },
              name: { type: "string", nullable: true, example: "Marco Rossi" },
              email: { type: "string", format: "email", example: "marco@example.com" },
            },
          },
          // ── Errors ────────────────────────────────────────────
          Error: {
            type: "object",
            properties: {
              error: { type: "string", example: "Messaggio di errore" },
            },
          },
        },
      },
      paths: {
        // ────────────────────────────────────────────────────────
        //  SPOT
        // ────────────────────────────────────────────────────────
        "/api/spot": {
          get: {
            tags: ["Spot"],
            summary: "Lista spot",
            description:
              "Restituisce una lista paginata di spot con filtri opzionali. Gli utenti non autenticati vedono solo gli spot pubblici. Gli admin vedono tutto.",
            parameters: [
              {
                name: "page",
                in: "query",
                schema: { type: "integer", default: 1 },
                description: "Numero di pagina",
              },
              {
                name: "limit",
                in: "query",
                schema: { type: "integer", default: 10 },
                description: "Risultati per pagina",
              },
              {
                name: "search",
                in: "query",
                schema: { type: "string" },
                description: "Ricerca full-text su nome, descrizione, indirizzo",
              },
              {
                name: "active",
                in: "query",
                schema: { type: "boolean" },
                description: "Filtra per stato attivo/inattivo",
              },
              {
                name: "public",
                in: "query",
                schema: { type: "boolean" },
                description: "Filtra per visibilità pubblica",
              },
              {
                name: "place",
                in: "query",
                schema: { type: "string" },
                description: "Filtra per luogo (es. 'Como')",
              },
            ],
            responses: {
              200: {
                description: "Lista spot con paginazione",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        spots: {
                          type: "array",
                          items: { $ref: "#/components/schemas/Spot" },
                        },
                        pagination: { $ref: "#/components/schemas/Pagination" },
                      },
                    },
                  },
                },
              },
              500: {
                description: "Errore interno del server",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" },
                  },
                },
              },
            },
          },
          post: {
            tags: ["Spot"],
            summary: "Crea spot",
            description: "Crea un nuovo spot. Richiede ruolo **ADMIN**.",
            security: [{ cookieAuth: [] }],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["name", "images"],
                    properties: {
                      name: { type: "string", example: "Tramonto sul Lago di Como" },
                      description: { type: "string", nullable: true },
                      images: {
                        type: "array",
                        items: { type: "string", format: "uri" },
                        example: ["https://utfs.io/f/abc.jpg"],
                      },
                      latitude: { type: "number", nullable: true, example: 46.005 },
                      longitude: { type: "number", nullable: true, example: 9.257 },
                      address: { type: "string", nullable: true },
                      place: { type: "string", nullable: true, example: "Como, Italia" },
                      public: { type: "boolean", default: true },
                      active: { type: "boolean", default: true },
                    },
                  },
                },
              },
            },
            responses: {
              201: {
                description: "Spot creato",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Spot" },
                  },
                },
              },
              400: {
                description: "Dati non validi",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" },
                  },
                },
              },
              401: {
                description: "Non autenticato",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" },
                  },
                },
              },
              403: {
                description: "Accesso negato (non admin)",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" },
                  },
                },
              },
            },
          },
          delete: {
            tags: ["Spot"],
            summary: "Elimina spot",
            description: "Elimina uno spot per ID. Richiede ruolo **ADMIN**.",
            security: [{ cookieAuth: [] }],
            parameters: [
              {
                name: "id",
                in: "query",
                required: true,
                schema: { type: "string" },
                description: "ID dello spot da eliminare",
              },
            ],
            responses: {
              200: {
                description: "Spot eliminato",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: { type: "string", example: "Spot cancellato correttamente" },
                      },
                    },
                  },
                },
              },
              400: {
                description: "ID mancante",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" },
                  },
                },
              },
              401: { description: "Non autenticato" },
              403: { description: "Accesso negato (non admin)" },
              404: {
                description: "Spot non trovato",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" },
                  },
                },
              },
            },
          },
        },
        "/api/spot/{slug}": {
          get: {
            tags: ["Spot"],
            summary: "Dettaglio spot",
            description:
              "Restituisce un singolo spot tramite slug. Gli spot non pubblici sono visibili solo all'admin.",
            parameters: [
              {
                name: "slug",
                in: "path",
                required: true,
                schema: { type: "string" },
                example: "tramonto-sul-lago-di-como",
              },
            ],
            responses: {
              200: {
                description: "Dettaglio spot",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Spot" },
                  },
                },
              },
              403: {
                description: "Spot non pubblico",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" },
                  },
                },
              },
              404: {
                description: "Spot non trovato",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" },
                  },
                },
              },
            },
          },
        },
        "/api/spot/nearby": {
          get: {
            tags: ["Spot"],
            summary: "Spot vicini",
            description:
              "Restituisce gli spot ordinati per distanza rispetto alle coordinate fornite. La distanza è calcolata con la formula di Haversine (no PostGIS necessario).",
            parameters: [
              {
                name: "latitude",
                in: "query",
                required: true,
                schema: { type: "number" },
                example: 45.464,
              },
              {
                name: "longitude",
                in: "query",
                required: true,
                schema: { type: "number" },
                example: 9.19,
              },
              {
                name: "page",
                in: "query",
                schema: { type: "integer", default: 1 },
              },
              {
                name: "limit",
                in: "query",
                schema: { type: "integer", default: 10 },
              },
              {
                name: "active",
                in: "query",
                schema: { type: "boolean" },
              },
              {
                name: "public",
                in: "query",
                schema: { type: "boolean" },
              },
            ],
            responses: {
              200: {
                description: "Lista spot con distanza",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        spots: {
                          type: "array",
                          items: { $ref: "#/components/schemas/SpotWithDistance" },
                        },
                        pagination: { $ref: "#/components/schemas/Pagination" },
                      },
                    },
                  },
                },
              },
              400: {
                description: "Latitudine o longitudine mancanti / non valide",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" },
                  },
                },
              },
            },
          },
        },
        // ────────────────────────────────────────────────────────
        //  AUTH
        // ────────────────────────────────────────────────────────
        "/api/auth/register": {
          post: {
            tags: ["Auth"],
            summary: "Registrazione",
            description: "Crea un nuovo account utente con email e password.",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                      name: { type: "string", example: "Marco Rossi" },
                      email: { type: "string", format: "email", example: "marco@example.com" },
                      password: {
                        type: "string",
                        minLength: 8,
                        example: "password123",
                      },
                    },
                  },
                },
              },
            },
            responses: {
              201: {
                description: "Utente creato",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        user: { $ref: "#/components/schemas/User" },
                      },
                    },
                  },
                },
              },
              400: { description: "Dati non validi" },
              409: {
                description: "Email già registrata",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" },
                  },
                },
              },
            },
          },
        },
        "/api/auth/forgot-password": {
          post: {
            tags: ["Auth"],
            summary: "Richiesta reset password",
            description:
              "Invia un'email con link di reset password (valido 1 ora) tramite Resend.",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["email"],
                    properties: {
                      email: { type: "string", format: "email", example: "marco@example.com" },
                    },
                  },
                },
              },
            },
            responses: {
              200: {
                description: "Email inviata",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: { type: "string", example: "Email inviata con successo!" },
                      },
                    },
                  },
                },
              },
              400: {
                description: "Account creato con social login (no password)",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" },
                  },
                },
              },
              404: {
                description: "Email non trovata",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" },
                  },
                },
              },
            },
          },
        },
        "/api/auth/reset-password": {
          post: {
            tags: ["Auth"],
            summary: "Valida token reset password",
            description:
              "Verifica che il token di reset sia valido e non scaduto. Restituisce l'userId associato.",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["token"],
                    properties: {
                      token: {
                        type: "string",
                        description: "Token in chiaro (ricevuto via email)",
                        example: "a1b2c3d4...",
                      },
                    },
                  },
                },
              },
            },
            responses: {
              200: {
                description: "Token valido",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        userId: { type: "string", example: "clxyz5678" },
                      },
                    },
                  },
                },
              },
              400: {
                description: "Token non valido o scaduto",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" },
                  },
                },
              },
            },
          },
          put: {
            tags: ["Auth"],
            summary: "Reset password",
            description:
              "Imposta la nuova password. Richiede token valido e userId. Il token viene invalidato dopo l'uso.",
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["password", "userId", "token"],
                    properties: {
                      password: {
                        type: "string",
                        minLength: 8,
                        example: "nuovaPassword123",
                      },
                      userId: { type: "string", example: "clxyz5678" },
                      token: { type: "string", example: "a1b2c3d4..." },
                    },
                  },
                },
              },
            },
            responses: {
              200: {
                description: "Password aggiornata",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        message: {
                          type: "string",
                          example: "Password aggiornata correttamente",
                        },
                      },
                    },
                  },
                },
              },
              400: {
                description: "Token non valido, scaduto o userId non corrispondente",
                content: {
                  "application/json": {
                    schema: { $ref: "#/components/schemas/Error" },
                  },
                },
              },
            },
          },
        },
        // ────────────────────────────────────────────────────────
        //  UPLOADTHING
        // ────────────────────────────────────────────────────────
        "/api/uploadthing": {
          post: {
            tags: ["Upload"],
            summary: "Upload immagini",
            description:
              "Endpoint gestito da Uploadthing per il caricamento di immagini (max 4MB, max 5 file). Richiede autenticazione.",
            security: [{ cookieAuth: [] }],
            requestBody: {
              content: {
                "multipart/form-data": {
                  schema: {
                    type: "object",
                    properties: {
                      files: {
                        type: "array",
                        items: { type: "string", format: "binary" },
                        description: "Immagini da caricare (max 5, max 4MB ciascuna)",
                      },
                    },
                  },
                },
              },
            },
            responses: {
              200: {
                description: "Upload completato — restituisce gli URL dei file caricati",
              },
              401: { description: "Non autenticato" },
            },
          },
        },
        "/api/uploadthing/delete": {
          post: {
            tags: ["Upload"],
            summary: "Elimina file",
            description: "Elimina un file da Uploadthing tramite fileKey. Richiede ruolo **ADMIN**.",
            security: [{ cookieAuth: [] }],
            requestBody: {
              required: true,
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    required: ["fileKey"],
                    properties: {
                      fileKey: {
                        type: "string",
                        description: "Chiave del file su Uploadthing",
                        example: "abc123def456.jpg",
                      },
                    },
                  },
                },
              },
            },
            responses: {
              200: {
                description: "File eliminato",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean", example: true },
                      },
                    },
                  },
                },
              },
              400: { description: "fileKey mancante" },
              401: { description: "Non autenticato" },
              403: { description: "Accesso negato (non admin)" },
            },
          },
        },
      },
      tags: [
        { name: "Spot", description: "Gestione degli spot (luoghi tramonto/alba)" },
        { name: "Auth", description: "Autenticazione, registrazione e reset password" },
        { name: "Upload", description: "Upload e gestione file tramite Uploadthing" },
      ],
    },
  });
}
