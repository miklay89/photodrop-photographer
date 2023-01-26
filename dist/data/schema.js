"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.photosTable = exports.albumsTable = exports.sessionsTable = exports.usersTable = void 0;
const drizzle_orm_pg_1 = require("drizzle-orm-pg");
exports.usersTable = (0, drizzle_orm_pg_1.pgTable)("users", {
    login: (0, drizzle_orm_pg_1.text)("login").notNull(),
    password: (0, drizzle_orm_pg_1.text)("password").notNull(),
    userId: (0, drizzle_orm_pg_1.text)("user_id").notNull().primaryKey(),
    createdAt: (0, drizzle_orm_pg_1.timestamp)("created_at").defaultNow().notNull(),
    fullName: (0, drizzle_orm_pg_1.text)("full_name"),
    email: (0, drizzle_orm_pg_1.text)("email"), // optional email
});
exports.sessionsTable = (0, drizzle_orm_pg_1.pgTable)("sessions", {
    sessionId: (0, drizzle_orm_pg_1.text)("session_id").notNull().primaryKey(),
    userId: (0, drizzle_orm_pg_1.text)("user_id")
        .notNull()
        .references(() => exports.usersTable.userId),
    refreshToken: (0, drizzle_orm_pg_1.text)("refresh_token").notNull(),
    expiresIn: (0, drizzle_orm_pg_1.timestamp)("expires_in").notNull(),
});
exports.albumsTable = (0, drizzle_orm_pg_1.pgTable)("albums", {
    albumId: (0, drizzle_orm_pg_1.text)("album_id").notNull().primaryKey(),
    name: (0, drizzle_orm_pg_1.text)("name"),
    location: (0, drizzle_orm_pg_1.text)("location"),
    createdAt: (0, drizzle_orm_pg_1.timestamp)("created_at").defaultNow().notNull(),
    albumLogo: (0, drizzle_orm_pg_1.text)("album_logo"),
    userId: (0, drizzle_orm_pg_1.text)("user_id")
        .notNull()
        .references(() => exports.usersTable.userId), // ref to users
});
exports.photosTable = (0, drizzle_orm_pg_1.pgTable)("photos", {
    photoId: (0, drizzle_orm_pg_1.text)("photo_id").notNull().primaryKey(),
    unlockedPhotoUrl: (0, drizzle_orm_pg_1.text)("unlocked_photo_url").notNull(),
    unlockedThumbnailUrl: (0, drizzle_orm_pg_1.text)("unlocked_thumbnail_url").notNull(),
    lockedPhotoUrl: (0, drizzle_orm_pg_1.text)("locked_photo_url").notNull(),
    lockedThumbnailUrl: (0, drizzle_orm_pg_1.text)("locked_thumbnail_url").notNull(),
    createdAt: (0, drizzle_orm_pg_1.timestamp)("created_at").defaultNow().notNull(),
    isUnlocked: (0, drizzle_orm_pg_1.boolean)("is_unlocked").notNull().default(false),
    albumId: (0, drizzle_orm_pg_1.text)("album_id")
        .notNull()
        .references(() => exports.albumsTable.albumId), // ref to album
});
