-- AlterTable
ALTER TABLE "Message" ADD CONSTRAINT "Message_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "Message_id_key";
