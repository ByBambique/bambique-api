import { pgTable, uuid, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { events } from './events';

export const venues = pgTable('venues', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  city: varchar('city', { length: 100 }),
  direction: text('direction'),
  country: varchar('country', { length: 100 }),
  hasSector: boolean('has_sector').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const sectors = pgTable('sectors', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id')
    .references(() => events.id, { onDelete: 'cascade' })
    .notNull(),
  venueId: uuid('venue_id').references(() => venues.id, {
    onDelete: 'set null',
  }),
  name: varchar('name', { length: 100 }).notNull(),
  hasSeats: boolean('has_seats').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const seats = pgTable('seats', {
  id: uuid('id').defaultRandom().primaryKey(),
  sectorId: uuid('sector_id')
    .references(() => sectors.id, { onDelete: 'cascade' })
    .notNull(),
  row: varchar('row', { length: 50 }).notNull(),
  col: varchar('col', { length: 50 }).notNull(),
  isFree: boolean('is_free').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Venue = typeof venues.$inferSelect;
export type NewVenue = typeof venues.$inferInsert;

export type Sector = typeof sectors.$inferSelect;
export type NewSector = typeof sectors.$inferInsert;

export type Seat = typeof seats.$inferSelect;
export type NewSeat = typeof seats.$inferInsert;
