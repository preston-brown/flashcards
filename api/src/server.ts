import Fastify from "fastify";
import cors from "@fastify/cors";
import { readFile } from "node:fs/promises";

import { Word, wordToCard } from "./models/word-card.js";

const app = Fastify({
  logger: true,
});

await app.register(cors, {
  origin: "*",
});

const raw = await readFile(
  new URL("../../scripts/data.json", import.meta.url),
  "utf8",
);
const words: Word[] = JSON.parse(raw);

app.get("/api/cards", async (request, reply) => {
  return words.map(wordToCard);
});

const port = Number(process.env.PORT ?? 3000);

try {
  await app.listen({
    host: "0.0.0.0",
    port,
  });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
