-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('AUTO', 'LIGHT', 'DARK');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "theme" "Theme" NOT NULL DEFAULT 'AUTO';
