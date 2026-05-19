-- AlterTable
ALTER TABLE "TestExecution" ADD COLUMN "actor" TEXT;
ALTER TABLE "TestExecution" ADD COLUMN "commitMessage" TEXT;
ALTER TABLE "TestExecution" ADD COLUMN "repository" TEXT;
ALTER TABLE "TestExecution" ADD COLUMN "workflowName" TEXT;
