import { pgTable, uuid, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { organizations, users } from './users';
import { eventCategoryEnum, eventStatusEnum, musicGenreEnum } from './enums';

export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  orgId: uuid('org_id')
    .references(() => organizations.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  desc: text('desc').notNull(),
  flyer: text('flyer').notNull(),
  category: eventCategoryEnum('category').notNull().default('concert'),
  status: eventStatusEnum('status').notNull().default('draft'),
  countLikes: integer('count_likes').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const eventConcerts = pgTable('event_concerts', {
  eventId: uuid('event_id')
    .references(() => events.id, { onDelete: 'cascade' })
    .primaryKey(),
  genre: musicGenreEnum('genre').array(),
  artist: varchar('artist', { length: 255 }),
  seat: varchar('seat', { length: 100 }),
  sector: varchar('sector', { length: 100 }),
});

export const eventConventions = pgTable('event_conventions', {
  eventId: uuid('event_id')
    .references(() => events.id, { onDelete: 'cascade' })
    .primaryKey(),
  genre: varchar('genre', { length: 100 }).notNull(),
  theme: varchar('theme', { length: 255 }).notNull(),
});

export const eventParties = pgTable('event_parties', {
  eventId: uuid('event_id')
    .references(() => events.id, { onDelete: 'cascade' })
    .primaryKey(),
  theme: varchar('theme', { length: 255 }),
  genre: musicGenreEnum('genre').array(),
  isFrequently: boolean('is_frequently').default(false).notNull(),
  days: varchar('days', { length: 100 }),
});

export const likes = pgTable('likes', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  eventId: uuid('event_id')
    .references(() => events.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export type EventConcert = typeof eventConcerts.$inferSelect;
export type NewEventConcert = typeof eventConcerts.$inferInsert;

export type EventConvention = typeof eventConventions.$inferSelect;
export type NewEventConvention = typeof eventConventions.$inferInsert;

export type EventParty = typeof eventParties.$inferSelect;
export type NewEventParty = typeof eventParties.$inferInsert;

export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;
