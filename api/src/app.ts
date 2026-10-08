import Fastify from "fastify";
import cors from "@fastify/cors";
import { readFile } from "node:fs/promises";

import { Word, wordToCard } from "./models/word-card.js";

export async function buildApp() {
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

  app.get<{ Querystring: { part_of_speech?: string } }>(
    "/api/cards",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            part_of_speech: {
              type: "string",
              enum: ["noun", "verb", "adjective", "preposition"],
            },
          },
        },
      },
    },
    async (request, reply) => {
      const partOfSpeech = request.query.part_of_speech;
      return words
        .filter((word) => !partOfSpeech || word.partOfSpeech === partOfSpeech)
        .map(wordToCard);
    },
  );

  app.get("/api/parts_of_speech", async (request, reply) => {
    const partsOfSpeech = Array.from(
      new Set(words.map((word) => word.partOfSpeech)),
    );
    return partsOfSpeech;
  });

  return app;
}
