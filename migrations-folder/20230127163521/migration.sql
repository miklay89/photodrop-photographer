CREATE TABLE IF NOT EXISTS "pd_albums" (
	"album_id" text PRIMARY KEY NOT NULL,
	"name" text,
	"location" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "pd_client_selfies" (
	"selfie_id" text PRIMARY KEY NOT NULL,
	"selfie_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "pd_clients_photos" (
	"client_id" text NOT NULL,
	"photo_id" text NOT NULL,
	"is_unlocked" boolean DEFAULT false NOT NULL
);

CREATE TABLE IF NOT EXISTS "pd_clients" (
	"client_id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"phone" text NOT NULL,
	"selfie_id" text,
	"email" text,
	"full_name" text
);

CREATE TABLE IF NOT EXISTS "pd_photos" (
	"photo_id" text PRIMARY KEY NOT NULL,
	"unlocked_photo_url" text NOT NULL,
	"unlocked_thumbnail_url" text NOT NULL,
	"locked_photo_url" text NOT NULL,
	"locked_thumbnail_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"album_id" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "pd_sessions" (
	"session_id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"refresh_token" text NOT NULL,
	"expires_in" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "pd_users" (
	"login" text NOT NULL,
	"password" text NOT NULL,
	"user_id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"full_name" text,
	"email" text
);

DO $$ BEGIN
 ALTER TABLE pd_albums ADD CONSTRAINT pd_albums_user_id_pd_users_user_id_fk FOREIGN KEY ("user_id") REFERENCES pd_users("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE pd_clients_photos ADD CONSTRAINT pd_clients_photos_client_id_pd_clients_client_id_fk FOREIGN KEY ("client_id") REFERENCES pd_clients("client_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE pd_clients_photos ADD CONSTRAINT pd_clients_photos_photo_id_pd_photos_photo_id_fk FOREIGN KEY ("photo_id") REFERENCES pd_photos("photo_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE pd_clients ADD CONSTRAINT pd_clients_selfie_id_pd_client_selfies_selfie_id_fk FOREIGN KEY ("selfie_id") REFERENCES pd_client_selfies("selfie_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE pd_photos ADD CONSTRAINT pd_photos_album_id_pd_albums_album_id_fk FOREIGN KEY ("album_id") REFERENCES pd_albums("album_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE pd_sessions ADD CONSTRAINT pd_sessions_user_id_pd_users_user_id_fk FOREIGN KEY ("user_id") REFERENCES pd_users("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
