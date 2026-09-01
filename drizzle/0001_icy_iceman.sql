CREATE TYPE "public"."gender" AS ENUM('male', 'female', 'other');--> statement-breakpoint
CREATE TYPE "public"."music_genre" AS ENUM('pop', 'rock', 'electronic', 'reggaeton', 'hip_hop', 'trap', 'latin', 'jazz', 'classical', 'cumbia', 'salsa', 'bachata', 'indie', 'metal', 'rnb', 'folk', 'punk', 'techno', 'house', 'other');--> statement-breakpoint
ALTER TABLE "event_concerts" ALTER COLUMN "genre" SET DATA TYPE "public"."music_genre"[] USING "genre"::"public"."music_genre"[];--> statement-breakpoint
ALTER TABLE "event_parties" ALTER COLUMN "genre" SET DATA TYPE "public"."music_genre"[] USING "genre"::"public"."music_genre"[];--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "gender" "gender";