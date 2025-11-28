-- DropIndex
DROP INDEX "Platform_externalId_idx";

-- CreateIndex
CREATE INDEX "Platform_nContests_idx" ON "Platform"("nContests");

-- CreateIndex
CREATE INDEX "Platform_nAccounts_idx" ON "Platform"("nAccounts");
