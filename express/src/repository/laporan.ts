import prisma from "../db/prisma";
import { LaporanData } from "../types/laporan";

export const findLaporan = async (search: string, skip: number, take: number) => {
    const laporan = await prisma.laporan.findMany({
        include: { status: true },
        skip,
        take,
    });
    return laporan;
}

export const countLaporan = async (search: string) => {
    return prisma.laporan.count({
        where: {
            OR: [
                // { tanggal: { contains: search, mode: "insensitive" } },
            ],
        },
    });
};

export const upsertLaporanHarian = async (tanggalInput: string, bb: number) => {
    const tanggal = new Date(tanggalInput);
    tanggal.setHours(0, 0, 0, 0);

    const endOfDay = new Date(tanggal);
    endOfDay.setHours(23, 59, 59, 999);

    const statuses = await prisma.status.findMany({
        where: {
            pengiriman: {
                tanggal: {
                    gte: tanggal,
                    lte: endOfDay
                }
            }
        },
        include: {
            pengiriman: true
        }
    });

    const totalKredit = statuses
        .filter(s => s.pengiriman?.pembayaran === "kredit")
        .reduce((sum, s) => sum + Number(s.pengiriman?.total || 0), 0);

    const totalDebit = statuses
        .filter(s => s.pengiriman?.pembayaran === "debit")
        .reduce((sum, s) => sum + Number(s.pengiriman?.total || 0), 0);

    // const totalBersih = statuses.reduce((sum, s) => sum + Number(s.pengiriman?.total || 0), 0);
    const totalBersih = statuses
        .filter(s => s.spembayaran === "Lunas")
        .reduce((sum, s) => sum + Number(s.pengiriman?.total || 0), 0);

    const existing = await prisma.laporan.findFirst({
        where: {
            tanggal: {
                gte: tanggal,
                lte: endOfDay
            }
        }
    });

    if (existing) {
        return prisma.laporan.update({
            where: { id: existing.id },
            data: {
                bb,
                tkredit: totalKredit,
                tdebit: totalDebit,
                tbersih: totalBersih
            }
        });
    } else {
        return prisma.laporan.create({
            data: {
                tanggal,
                bb,
                tkredit: totalKredit,
                tdebit: totalDebit,
                tbersih: totalBersih,
                id_status: statuses[0]?.id ?? 1
            }
        });
    }
};
