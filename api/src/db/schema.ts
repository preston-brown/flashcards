import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const cards = sqliteTable('card', {
  id: text('id').primaryKey(),
  front: text('front').notNull(),
  back: text('back').notNull(),
  passCount: integer('pass_count').notNull().default(0),
  failCount: integer('fail_count').notNull().default(0),
});

export const cardTags = sqliteTable('card_tag', {
  id: text('id').primaryKey(),
  key: text('key').notNull(),
  value: text('value').notNull(),
  cardId: text('card_id').notNull().references(() => cards.id, {onDelete: 'cascade'}),
})