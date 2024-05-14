# poc-discord-backend

## Project Description

### API Route Information

- **Discord OAuth Callback**
    * Exchange the token from the body for tokens
    * Get the user info from the Discord API
    * Save/update the user info to the database
    * Create one big JWT with the access/refresh tokens
    * Encrypt the JWT token with a secret key ("jose" package)
    * Send the JWT to the client
- **Get User Info**
    * Get the user info from the database
    * Send the user info to the client
- **Get User Guilds**
    * Get the user guilds from the Discord API
    * Add a field to check if the bot is in the guild
    * Send the user guilds to the client
- **Specific Guild**
    * Get the guild by ID from the database
    * Get custom guild commands from database
    * Add commands to the guild object
    * Remove commands from the guild object
    * Modify/Update commands from the guild object

### Discord Bot Information [WIP]

- **On Ready**
    * Send a message to the Socket.IO that the bot is ready
- **On Any Event**
    * Send the event to the Socket.IO

### Logger Information (Winston) [WIP]

- **Log to the Database**
    * Save the log to the database
    * Columns: ID, Level, Message, Timestamp, Stacktrace:(optional)
- **Log to Socket.IO**
    * Send the log to the Socket.IO
    * Event: Log

### Database Information

- **MySQL (MariaDB/SQLite)**
- Create a table for the user info
    * Columns: ID (Discord ID), Username, Global Name, Avatar, Oauth Refresh Token
- Create a table for the logs
    * Columns: ID, Level, Message, Timestamp, Stacktrace (optional)
- Create a table for the roles
    * Columns: ID, Name
- Create a pivot table for the user roles
    * Columns: User ID, Role ID
- Create a table for the bot guilds
    * Columns: ID, Name, Icon (optional), Prefix, Language
- Create a table for the guild commands
    * Columns: ID, Guild ID, Command, Response (JSON)


## Project Structure

```
/
│
├── src/                            # Source files
|   |
│   ├── bot/                        # Discord bot
│   │   ├── index.ts                # Initializes the bot
│   │   ├── base/                   # Directory for the base classes
│   │   │   └── BaseCommand.ts      # Base command class
│   │   │   └── BaseEvent.ts        # Base event class
│   │   ├── commands/               # Directory for build-in commands
│   │   │   └── ...                 # Command handlers
│   │   └── events/                 # Directory for build-in commands
│   │       └── ...                 # Event handlers
|   |
│   ├── config/                     # Config files (ENV Parsers)
│   │   ├── index.ts                # Rexports all config files
│   │   ├── db.config.ts            # Database configuration
│   │   ├── discord.config.ts       # Discord configuration
│   │   ├── jwt.config.ts           # JWT configuration
│   │   └── server.config.ts        # Server configuration
|   |
│   ├── database/                   # Database connection and models
│   │   ├── index.ts                # Database connection setup (Connection and models)
│   │   └── models/                 # Database models
│   │       ├── User.ts             # User model
│   │       ├── Log.ts              # Log model
│   │       ├── Role.ts             # Role model
│   │       ├── Guild.ts            # Guild model
│   │       └── Command.ts          # Command model
|   |
│   ├── server/                     # Setup all the server configurations
│   │   ├── server.ts               # Initializes the Express server
│   │   ├── socket.ts               # Initializes the Socket.IO server
|   |   ├── swagger.ts              # Initializes the Swagger UI
│   │   ├── middleware/             # Middleware functions
│   │   │   └── auth.ts             # Authentication middleware
│   │   └── routes/                 # API routes
│   │       ├── api/                # API routes
│   │       │   ├── auth.ts         # Authentication routes
│   │       │   ├── guilds.ts       # Guild routes
│   │       │   └── users.ts        # User routes
│   │       └── index.ts            # Rexports all routes
|   |   
│   ├── swagger/                    # Swagger schemas
│   │   └── schemas.ts              # Swagger schemas
|   |
│   └── utils/                      # Utility functions
|       ├── jwt.ts                  # JWT utilities
|       └── vm.ts                   # Virtual machine utilities
|
├── index.ts                        # Entry point
│
├── .env.example                    # Environment variables example
├── .gitignore                      # Files and directories to ignore
├── .dockerignore                   # Files and directories to ignore in Docker
├── Dockerfile                      # Dockerfile for building the Docker image
├── package.json                    # Project dependencies and scripts
└── tsconfig.json                   # TypeScript configuration

```