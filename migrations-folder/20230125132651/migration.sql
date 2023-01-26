CREATE TABLE IF NOT EXISTS "albums" (
	"album_id" text PRIMARY KEY NOT NULL,
	"name" text,
	"location" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"album_logo" text,
	"user_id" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "photos" (
	"photo_id" text PRIMARY KEY NOT NULL,
	"unlocked_photo_url" text NOT NULL,
	"unlocked_thumbnail_url" text NOT NULL,
	"locked_photo_url" text NOT NULL,
	"locked_thumbnail_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_unlocked" boolean DEFAULT false NOT NULL,
	"album_id" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "sessions" (
	"session_id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"refresh_token" text NOT NULL,
	"expires_in" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
	"login" text NOT NULL,
	"password" text NOT NULL,
	"user_id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"full_name" text,
	"email" text
);

DO $$ BEGIN
 ALTER TABLE albums ADD CONSTRAINT albums_user_id_users_user_id_fk FOREIGN KEY ("user_id") REFERENCES users("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE photos ADD CONSTRAINT photos_album_id_albums_album_id_fk FOREIGN KEY ("album_id") REFERENCES albums("album_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE sessions ADD CONSTRAINT sessions_user_id_users_user_id_fk FOREIGN KEY ("user_id") REFERENCES users("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
