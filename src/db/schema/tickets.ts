import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  numeric,
  date,
  timestamp,
} from 'drizzle-orm/pg-core';
import { events } from './events';
import { venues, sectors } from './venues';
import { users } from './users';
import { performanceStatusEnum } from './enums';

export const performances = pgTable('performances', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id')
    .references(() => events.id, { onDelete: 'cascade' })
    .notNull(),
  venueId: uuid('venue_id').references(() => venues.id, {
    onDelete: 'set null',
  }),
  name: varchar('name', { length: 255 }).notNull(),
  date: date('date').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }),
  duration: integer('duration'), // duration in minutes
  status: performanceStatusEnum('status').notNull().default('scheduled'),
  startAt: timestamp('start_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const ticketTypes = pgTable('ticket_types', {
  id: uuid('id').defaultRandom().primaryKey(),
  functionId: uuid('function_id')
    .references(() => performances.id, { onDelete: 'cascade' })
    .notNull(),
  sectorId: uuid('sector_id').references(() => sectors.id, {
    onDelete: 'set null',
  }),
  type: varchar('type', { length: 100 }),
  quantity: integer('quantity').default(0),
  price: numeric('price', { precision: 10, scale: 2 }).notNull().default('0.00'),
  desc: text('desc'),
  startAt: timestamp('start_at'),
  finishAt: timestamp('finish_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  ticketId: uuid('ticket_id')
    .references(() => ticketTypes.id, { onDelete: 'cascade' })
    .notNull(),
  count: integer('count').notNull().default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Performance = typeof performances.$inferSelect;
export type NewPerformance = typeof performances.$inferInsert;

export type TicketType = typeof ticketTypes.$inferSelect;
export type NewTicketType = typeof ticketTypes.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
