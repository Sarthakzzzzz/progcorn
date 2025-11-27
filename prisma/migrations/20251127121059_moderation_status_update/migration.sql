-- CreateEnum
CREATE TYPE "ResourceStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "status" "ResourceStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "Resource_status_idx" ON "Resource"("status");
