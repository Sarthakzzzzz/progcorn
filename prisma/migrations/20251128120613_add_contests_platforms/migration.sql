-- CreateTable
CREATE TABLE "Platform" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "externalId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "short" TEXT,
    "nAccounts" INTEGER,
    "nContests" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Platform_externalId_key" ON "Platform"("externalId");

-- CreateIndex
CREATE INDEX "Platform_externalId_idx" ON "Platform"("externalId");
