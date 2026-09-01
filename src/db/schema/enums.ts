import { pgEnum } from 'drizzle-orm/pg-core';

export const eventCategoryEnum = pgEnum('event_category', [
  'concert',
  'convention',
  'party',
  'theater',
  'sports',
  'festival',
  'other',
]);

export const eventStatusEnum = pgEnum('event_status', [
  'draft',
  'published',
  'cancelled',
  'completed',
]);

export const performanceStatusEnum = pgEnum('performance_status', [
  'scheduled',
  'in_progress',
  'completed',
  'cancelled',
  'postponed',
]);

export const genderEnum = pgEnum('gender', ['male', 'female', 'other']);

export const musicGenreEnum = pgEnum('music_genre', [
  'pop',
  'rock',
  'electronic',
  'reggaeton',
  'hip_hop',
  'trap',
  'latin',
  'jazz',
  'classical',
  'cumbia',
  'salsa',
  'bachata',
  'indie',
  'metal',
  'rnb',
  'folk',
  'punk',
  'techno',
  'house',
  'other',
]);

export const userRoleEnum = pgEnum('user_role', ['super_admin', 'admin', 'organizer', 'user']);
