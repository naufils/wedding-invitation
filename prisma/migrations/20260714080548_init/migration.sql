-- CreateEnum
CREATE TYPE "WeddingStatus" AS ENUM ('draft', 'published');

-- CreateEnum
CREATE TYPE "AttendingStatus" AS ENUM ('yes', 'no', 'maybe');

-- CreateEnum
CREATE TYPE "MediaFileType" AS ENUM ('image', 'video');

-- CreateEnum
CREATE TYPE "DriveSyncStatus" AS ENUM ('pending', 'synced', 'failed');

-- CreateEnum
CREATE TYPE "UploadedBy" AS ENUM ('couple', 'guest');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "auth_provider" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weddings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "subdomain_slug" TEXT NOT NULL,
    "couple_names" JSONB NOT NULL,
    "wedding_date" TIMESTAMP(3) NOT NULL,
    "theme_config" JSONB NOT NULL,
    "status" "WeddingStatus" NOT NULL DEFAULT 'draft',
    "drive_folder_id" TEXT,
    "drive_refresh_token" TEXT,
    "payment_status" TEXT NOT NULL DEFAULT 'unpaid',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weddings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "venue_name" TEXT NOT NULL,
    "venue_address" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "dress_code" TEXT,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rsvps" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "guest_name" TEXT NOT NULL,
    "phone_or_email" TEXT NOT NULL,
    "attending_status" "AttendingStatus" NOT NULL,
    "event_ids" TEXT[],
    "guest_count" INTEGER NOT NULL,
    "dietary_notes" TEXT,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rsvps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_uploads" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "uploaded_by_guest_name" TEXT NOT NULL,
    "file_type" "MediaFileType" NOT NULL,
    "storage_key" TEXT NOT NULL,
    "drive_file_id" TEXT,
    "drive_sync_status" "DriveSyncStatus" NOT NULL DEFAULT 'pending',
    "file_size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_photos" (
    "id" TEXT NOT NULL,
    "wedding_id" TEXT NOT NULL,
    "storage_key" TEXT NOT NULL,
    "caption" TEXT,
    "order_index" INTEGER NOT NULL,
    "uploaded_by" "UploadedBy" NOT NULL,

    CONSTRAINT "gallery_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "weddings_subdomain_slug_key" ON "weddings"("subdomain_slug");

-- AddForeignKey
ALTER TABLE "weddings" ADD CONSTRAINT "weddings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_uploads" ADD CONSTRAINT "media_uploads_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_photos" ADD CONSTRAINT "gallery_photos_wedding_id_fkey" FOREIGN KEY ("wedding_id") REFERENCES "weddings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
