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

  app.get<{ Querystring: {  chapter?: number,part_of_speech?: string, } }>(
    "/api/cards",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            chapter: {
              type: "number",
            },
            part_of_speech: {
              type: "string",
              enum: ["noun", "verb", "adjective", "preposition", "other"],
            },
          },
        },
      },
    },
    async (request, reply) => {
      const partOfSpeech = request.query.part_of_speech;
      const chapter = request.query.chapter;
      return words
        .filter((word) => !partOfSpeech || word.partOfSpeech === partOfSpeech)
        .filter((word) => !chapter || word.chapter === chapter)
        .map(wordToCard);
    },
  );

  app.get("/api/parts_of_speech", async (request, reply) => {
    const partsOfSpeech = Array.from(
      new Set(words.map((word) => word.partOfSpeech)),
    );
    return partsOfSpeech;
  });

  app.get("/api/chapters", async (request, reply) => {
    const chapters = Array.from(
      new Set(words.map((word) => word.chapter)),
    );
    return chapters;
  });

  return app;
}
