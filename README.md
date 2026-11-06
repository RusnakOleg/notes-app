## Running the application

The whole application (database, API and web client) runs in Docker, so you don't need to install .NET, Node.js or PostgreSQL.

### Step 1: Install the required tools

1. **Git**: https://git-scm.com/downloads
2. **Docker Desktop**: https://www.docker.com/products/docker-desktop/

Accept the default settings during installation. Restart your computer afterwards and make sure Docker Desktop is running (the whale icon in the system tray should be steady, not animated).

### Step 2: Clone the repository

Open a terminal (PowerShell on Windows) and run:

```bash
git clone https://github.com/RusnakOleg/notes-app.git
```

### Step 3: Start the application

In the project folder (**notes-app**), run:

```bash
docker compose up --build
```

The first start takes a few minutes because the images have to be downloaded and built. Wait until you see this line in the logs:

### Step 4: Open it in the browser

| What | Address |
|---|---|
| Web application | http://localhost:3000 |
| API (Swagger UI) | http://localhost:5000/swagger |

## Stopping the application

Press `Ctrl+C` in the terminal, or run in the project folder:

```bash
docker compose down
```

Your notes are kept in a Docker volume and will still be there on the next start.
To stop the application **and delete all data** (clean start):

```bash
docker compose down -v
```

## Running the end-to-end test

The application must be running (see Step 3). The test needs Node.js 22+. In a new terminal, from the project folder:

```bash
cd frontend
npm install
npx playwright install chromium
npm run test:e2e
```

To open the HTML report: `npx playwright show-report`.

## Troubleshooting

- **`failed to connect to the docker API`**: Docker Desktop is not running. Start it and wait until it is ready.
- **`port is already allocated`**: another program uses port 3000, 5000 or 5432. Stop it.
