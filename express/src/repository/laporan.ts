import prisma from "../db/prisma";
import { LaporanData } from "../types/laporan";

export const findLaporanWithStatus = async (search: string, skip: number, take: number) => {
    let tanggalFilter = undefined;

    // Cek apakah search adalah format tanggal (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(search)) {
        const parsedDate = new Date(search);
        tanggalFilter = {
            gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
            lt: new Date(parsedDate.setHours(24, 0, 0, 0)),
        };
    }

    return await prisma.laporan.findMany({
        include: { status: true },
        where: {
            ...(tanggalFilter && { tanggal: tanggalFilter }),
        },
        orderBy: {
            tanggal: "desc",
        },
        skip,
        take,
    });
};

export const countLaporan = async (search: string) => {
    let tanggalFilter = undefined;

    if (/^\d{4}-\d{2}-\d{2}$/.test(search)) {
        const parsedDate = new Date(search);
        tanggalFilter = {
            gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
            lt: new Date(parsedDate.setHours(24, 0, 0, 0)),
        };
    }

    return await prisma.laporan.count({
        where: {
            ...(tanggalFilter && { tanggal: tanggalFilter }),
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
            tanggal: {
                gte: tanggal,
                lte: endOfDay,
            },
        },
        include: {
            pengiriman: true,
        },
    });

    const totalKredit = statuses
        .filter((s) => s.pengiriman?.pembayaran === "kredit")
        .reduce((sum, s) => sum + Number(s.pengiriman?.total || 0), 0);

    const totalDebit = statuses
        .filter((s) => s.pengiriman?.pembayaran === "debit")
        .reduce((sum, s) => sum + Number(s.pengiriman?.total || 0), 0);

    const totalBersih = statuses
        .filter((s) => s.spembayaran.toLowerCase() === "lunas")
        .reduce((sum, s) => sum + Number(s.pengiriman?.total || 0), 0);

    const existing = await prisma.laporan.findFirst({
        where: {
            tanggal: {
                gte: tanggal,
                lte: endOfDay,
            },
        },
    });

    if (existing) {
        return prisma.laporan.update({
            where: { id: existing.id },
            data: {
                bb,
                tkredit: totalKredit,
                tdebit: totalDebit,
                tbersih: totalBersih,
            },
        });
    } else {
        return prisma.laporan.create({
            data: {
                tanggal,
                bb,
                tkredit: totalKredit,
                tdebit: totalDebit,
                tbersih: totalBersih,
                id_status: statuses[0]?.id ?? 1,
            },
        });
    }
};

export const findStatusForLaporanByTanggal = async (tanggal: string, userId: number | null) => {
    const parsedDate = new Date(tanggal);
    const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

    return await prisma.status.findMany({
        where: {
            tanggal: {
                gte: startOfDay,
                lte: endOfDay,
            },
            ...(userId && {
                pengiriman: {
                    id_user: userId,
                },
            }),
        },
        include: {
            pengiriman: {
                include: {
                    user: true,
                    wilayah: true,
                    ongkos: true,
                },
            },
            laporan: true, // kalau ingin menampilkan data laporan jika ada
        },
        orderBy: {
            tanggal: "asc",
        },
    });
};

// repositories/laporanRepository.ts
export const findStatusForLaporanByBulan = async (bulan: number, tahun: number, userId: number | null) => {
    const startDate = new Date(tahun, bulan - 1, 1);
    const endDate = new Date(tahun, bulan, 0, 23, 59, 59, 999); // hari terakhir bulan

    return await prisma.status.findMany({
        where: {
            tanggal: {
                gte: startDate,
                lte: endDate,
            },
            ...(userId && {
                pengiriman: {
                    id_user: userId,
                },
            }),
        },
        include: {
            pengiriman: {
                include: {
                    user: true,
                    wilayah: true,
                    ongkos: true,
                },
            },
            laporan: true,
        },
        orderBy: {
            tanggal: "asc",
        },
    });
};
