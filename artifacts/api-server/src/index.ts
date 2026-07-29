import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];

// Fall back to 3000 when the host (e.g. cPanel Passenger) doesn't inject PORT
// before the process starts. The actual value is overridden at runtime anyway.
const port = rawPort ? Number(rawPort) : 3000;

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
