-- AlterTable
ALTER TABLE "Pengiriman" ADD COLUMN     "id_ongkos" INTEGER,
ADD COLUMN     "jemput" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "tujuan" TEXT NOT NULL DEFAULT 'Unknown';

-- CreateTable
CREATE TABLE "Ongkos" (
    "id" SERIAL NOT NULL,
    "jemput" TEXT NOT NULL,
    "harga" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Ongkos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pengiriman" ADD CONSTRAINT "Pengiriman_id_ongkos_fkey" FOREIGN KEY ("id_ongkos") REFERENCES "Ongkos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
