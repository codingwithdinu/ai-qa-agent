-- AlterTable
ALTER TABLE "TestExecution" ADD COLUMN "branch" TEXT;
ALTER TABLE "TestExecution" ADD COLUMN "buildNumber" TEXT;
ALTER TABLE "TestExecution" ADD COLUMN "commitHash" TEXT;
ALTER TABLE "TestExecution" ADD COLUMN "environment" TEXT;
ALTER TABLE "TestExecution" ADD COLUMN "provider" TEXT;
