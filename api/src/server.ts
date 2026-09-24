import Fastify from 'fastify';
import cors from '@fastify/cors';
import { eq } from 'drizzle-orm';
import { db } from './db/client.js';
import { cards } from './db/schema.js';

const app = Fastify({
    logger: true,
});

await app.register(cors, {
    origin: '*',
});

app.post('/api/cards', async (request, reply) => {
    const { front, back } = request.body as { front: string; back: string };
    const id = crypto.randomUUID();
    const [newCard] = await db.insert(cards).values({ id, front, back }).returning();
    return newCard;
});

app.get('/api/cards', async (request, reply) => {
    const result = await db.select().from(cards);
    return result;
});

app.get('/api/cards/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const result = await db
        .select()
        .from(cards)
        .where(eq(cards.id, id))
        .limit(1);

    if (result.length === 0) {
        return reply.code(404).send({ message: 'Card not found' });
    }

    return result[0];
});

const port = Number(process.env.PORT ?? 3000);

try {
    await app.listen({
        host: '0.0.0.0',
        port,
    });
} catch (error) {
    app.log.error(error);
    process.exit(1);
}
