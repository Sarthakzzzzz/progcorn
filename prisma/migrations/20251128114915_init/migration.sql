-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "bio" TEXT,
    "imageUrl" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "approvedAt" DATETIME,
    "approvedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME,
    CONSTRAINT "Resource_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Resource_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ResourceTag" (
    "resourceId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    PRIMARY KEY ("resourceId", "tagId"),
    CONSTRAINT "ResourceTag_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ResourceTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Upvote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Upvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Upvote_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CollectionItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "collectionId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "addedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CollectionItem_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CollectionItem_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reason" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Report_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdminAction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetId" TEXT,
    "meta" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdminAction_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "url" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Contest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "externalId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "platform" TEXT,
    "resourceId" INTEGER,
    "host" TEXT,
    "startAt" DATETIME NOT NULL,
    "endAt" DATETIME,
    "duration" INTEGER,
    "nProblems" INTEGER,
    "nStatistics" INTEGER,
    "parsedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE INDEX "Resource_createdAt_idx" ON "Resource"("createdAt");

-- CreateIndex
CREATE INDEX "Resource_categoryId_idx" ON "Resource"("categoryId");

-- CreateIndex
CREATE INDEX "Resource_status_idx" ON "Resource"("status");

-- CreateIndex
CREATE INDEX "ResourceTag_tagId_idx" ON "ResourceTag"("tagId");

-- CreateIndex
CREATE INDEX "Upvote_resourceId_idx" ON "Upvote"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Upvote_userId_resourceId_key" ON "Upvote"("userId", "resourceId");

-- CreateIndex
CREATE INDEX "Comment_resourceId_idx" ON "Comment"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "CollectionItem_collectionId_resourceId_key" ON "CollectionItem"("collectionId", "resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Contest_externalId_key" ON "Contest"("externalId");

-- CreateIndex
CREATE INDEX "Contest_startAt_idx" ON "Contest"("startAt");
