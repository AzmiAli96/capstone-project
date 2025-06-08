import prisma from "../db/prisma";
import { LaporanData } from "../types/laporan";

export const findLaporanWithStatus = async (search: string, skip: number, take: number, userId: number | null) => {
    return await prisma.laporan.findMany({
        include: {
            status: {
                include: {
                    pengiriman: {
                        include: {
                            user: true,
                            wilayah: true,
                            ongkos: true,
                        },
                    },
                },
            },
        },
        where: {
            OR: [
                {
                    status: {
                        pengiriman: {
                            no_spb: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                },
                {
                    status: {
                        pengiriman: {
                            customer: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                },
                {
                    status: {
                        pengiriman: {
                            tujuan: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                },
                {
                    status: {
                        pengiriman: {
                            user: {
                                name: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        },
                    },
                },
            ],
            ...(userId
                ? {
                    status: {
                        pengiriman: {
                            id_user: userId,
                        },
                    },
                }
                : {}),
        },
        orderBy: {
            tanggal: "desc",
        },
        skip,
        take,
    });
};




export const countLaporan = async (search: string, userId: number | null) => {
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
            ...(userId && {
                status: {
                    pengiriman: {
                        id_user: userId,
                    },
                },
            }),
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
