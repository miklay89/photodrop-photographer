import { pgTable, text, timestamp, InferModel } from "drizzle-orm-pg";

/* ################################################################################ */
// PHOTOGRAPHER API DB
/* ################################################################################ */

export const usersTable = pgTable("pd_users", {
  login: text("login").notNull(), // user login - should be only "letters and _"
  password: text("password").notNull(), // user hashed password
  userId: text("user_id").notNull().primaryKey(), // user id
  createdAt: timestamp("created_at").defaultNow().notNull(), // date of creation
  fullName: text("full_name"), // optional full name
  email: text("email"), // optional email
});

export const sessionsTable = pgTable("pd_sessions", {
  sessionId: text("session_id").notNull().primaryKey(), // session id
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.userId),
  refreshToken: text("refresh_token").notNull(),
  expiresIn: timestamp("expires_in").notNull(),
});

export const albumsTable = pgTable("pd_albums", {
  albumId: text("album_id").notNull().primaryKey(), // album id
  name: text("name"), // album name
  location: text("location"), // album location
  createdAt: timestamp("created_at").defaultNow().notNull(), // date of creation
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.userId), // ref to users
});

export const photosTable = pgTable("pd_photos", {
  photoId: text("photo_id").notNull().primaryKey(), // photo id
  unlockedPhotoUrl: text("unlocked_photo_url").notNull(), // url to unlocked photo
  unlockedThumbnailUrl: text("unlocked_thumbnail_url").notNull(), // url to unlocked thumbnail
  lockedPhotoUrl: text("locked_photo_url").notNull(), // url to locked photo with watermark
  lockedThumbnailUrl: text("locked_thumbnail_url").notNull(), // url to locked thumbnail with watermark
  createdAt: timestamp("created_at").defaultNow().notNull(), // date of creation
  albumId: text("album_id")
    .notNull()
    .references(() => albumsTable.albumId), // ref to album
  clients: text("clients"),
});

export type PDPSession = InferModel<typeof sessionsTable>;
export type PDPAlbum = InferModel<typeof albumsTable>;
export type PDPPhoto = InferModel<typeof photosTable>;
export type PDPUser = InferModel<typeof usersTable>;
