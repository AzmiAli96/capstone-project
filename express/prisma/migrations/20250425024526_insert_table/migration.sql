-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "no_hp" VARCHAR(12) NOT NULL,
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wilayah" (
    "id" SERIAL NOT NULL,
    "provinsi" TEXT NOT NULL,
    "wilayah" TEXT NOT NULL,
    "harga" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Wilayah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengiriman" (
    "id" SERIAL NOT NULL,
    "berat" INTEGER NOT NULL,
    "koli" INTEGER NOT NULL,
    "pembayaran" TEXT NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "ket" TEXT NOT NULL,
    "image" TEXT,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_user" INTEGER NOT NULL,
    "id_wilayah" INTEGER NOT NULL,

    CONSTRAINT "Pengiriman_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Status" (
    "id" SERIAL NOT NULL,
    "image" TEXT,
    "spembayaran" TEXT NOT NULL,
    "spengiriman" TEXT NOT NULL,
    "id_pengiriman" INTEGER NOT NULL,

    CONSTRAINT "Status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Laporan" (
    "id" SERIAL NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bb" DECIMAL(65,30) NOT NULL,
    "tkredit" DECIMAL(65,30) NOT NULL,
    "tdebit" DECIMAL(65,30) NOT NULL,
    "tbersih" DECIMAL(65,30) NOT NULL,
    "id_status" INTEGER NOT NULL,

    CONSTRAINT "Laporan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Pengiriman" ADD CONSTRAINT "Pengiriman_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pengiriman" ADD CONSTRAINT "Pengiriman_id_wilayah_fkey" FOREIGN KEY ("id_wilayah") REFERENCES "Wilayah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Status" ADD CONSTRAINT "Status_id_pengiriman_fkey" FOREIGN KEY ("id_pengiriman") REFERENCES "Pengiriman"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Laporan" ADD CONSTRAINT "Laporan_id_status_fkey" FOREIGN KEY ("id_status") REFERENCES "Status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
