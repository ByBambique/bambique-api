import { relations } from 'drizzle-orm';
import { users, organizations, organizers, follows } from './users';
import { events, eventConcerts, eventConventions, eventParties, likes } from './events';
import { venues, sectors, seats } from './venues';
import { performances, ticketTypes, orders } from './tickets';

// Users Relations
export const usersRelations = relations(users, ({ many }) => ({
  organizerProfiles: many(organizers),
  follows: many(follows),
  likes: many(likes),
  orders: many(orders),
}));

// Organizations Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  organizers: many(organizers),
  followers: many(follows),
  events: many(events),
}));

// Organizers Relations
export const organizersRelations = relations(organizers, ({ one }) => ({
  user: one(users, {
    fields: [organizers.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [organizers.organizationId],
    references: [organizations.id],
  }),
}));

// Follows Relations
export const followsRelations = relations(follows, ({ one }) => ({
  user: one(users, {
    fields: [follows.userId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [follows.organizationId],
    references: [organizations.id],
  }),
}));

// Events Relations
export const eventsRelations = relations(events, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [events.orgId],
    references: [organizations.id],
  }),
  concertDetails: one(eventConcerts, {
    fields: [events.id],
    references: [eventConcerts.eventId],
  }),
  conventionDetails: one(eventConventions, {
    fields: [events.id],
    references: [eventConventions.eventId],
  }),
  partyDetails: one(eventParties, {
    fields: [events.id],
    references: [eventParties.eventId],
  }),
  likes: many(likes),
  performances: many(performances),
  sectors: many(sectors),
}));

// Event Subtypes Relations
export const eventConcertsRelations = relations(eventConcerts, ({ one }) => ({
  event: one(events, {
    fields: [eventConcerts.eventId],
    references: [events.id],
  }),
}));

export const eventConventionsRelations = relations(eventConventions, ({ one }) => ({
  event: one(events, {
    fields: [eventConventions.eventId],
    references: [events.id],
  }),
}));

export const eventPartiesRelations = relations(eventParties, ({ one }) => ({
  event: one(events, {
    fields: [eventParties.eventId],
    references: [events.id],
  }),
}));

// Likes Relations
export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  event: one(events, {
    fields: [likes.eventId],
    references: [events.id],
  }),
}));

// Venues Relations
export const venuesRelations = relations(venues, ({ many }) => ({
  performances: many(performances),
  sectors: many(sectors),
}));

// Sectors Relations
export const sectorsRelations = relations(sectors, ({ one, many }) => ({
  event: one(events, {
    fields: [sectors.eventId],
    references: [events.id],
  }),
  venue: one(venues, {
    fields: [sectors.venueId],
    references: [venues.id],
  }),
  seats: many(seats),
  ticketTypes: many(ticketTypes),
}));

// Seats Relations
export const seatsRelations = relations(seats, ({ one }) => ({
  sector: one(sectors, {
    fields: [seats.sectorId],
    references: [sectors.id],
  }),
}));

// Performances Relations
export const performancesRelations = relations(performances, ({ one, many }) => ({
  event: one(events, {
    fields: [performances.eventId],
    references: [events.id],
  }),
  venue: one(venues, {
    fields: [performances.venueId],
    references: [venues.id],
  }),
  ticketTypes: many(ticketTypes),
}));

// Ticket Types Relations
export const ticketTypesRelations = relations(ticketTypes, ({ one, many }) => ({
  performance: one(performances, {
    fields: [ticketTypes.functionId],
    references: [performances.id],
  }),
  sector: one(sectors, {
    fields: [ticketTypes.sectorId],
    references: [sectors.id],
  }),
  orders: many(orders),
}));

// Orders Relations
export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  ticketType: one(ticketTypes, {
    fields: [orders.ticketId],
    references: [ticketTypes.id],
  }),
}));
