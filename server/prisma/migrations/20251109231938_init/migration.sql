-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "pseudo" VARCHAR(40) NOT NULL,
    "age" INTEGER NOT NULL,
    "avatarKey" VARCHAR(40) NOT NULL,
    "settings" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "world" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "stars" INTEGER NOT NULL DEFAULT 0,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "attemptsCount" INTEGER NOT NULL DEFAULT 0,
    "lastPlayedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ErrorStat" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "skillKey" VARCHAR(40) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ErrorStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reward" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "badges" JSONB NOT NULL,
    "stickers" JSONB NOT NULL,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "samples" JSONB NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "LevelDef" (
    "id" TEXT NOT NULL,
    "world" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "game" TEXT NOT NULL,
    "skills" JSONB NOT NULL,

    CONSTRAINT "LevelDef_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Profile_pseudo_idx" ON "Profile"("pseudo");

-- CreateIndex
CREATE INDEX "Progress_profileId_idx" ON "Progress"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Progress_profileId_world_level_key" ON "Progress"("profileId", "world", "level");

-- CreateIndex
CREATE INDEX "ErrorStat_profileId_skillKey_idx" ON "ErrorStat"("profileId", "skillKey");

-- CreateIndex
CREATE UNIQUE INDEX "ErrorStat_profileId_skillKey_key" ON "ErrorStat"("profileId", "skillKey");

-- CreateIndex
CREATE UNIQUE INDEX "Reward_profileId_key" ON "Reward"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "LevelDef_world_index_key" ON "LevelDef"("world", "index");

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ErrorStat" ADD CONSTRAINT "ErrorStat_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
