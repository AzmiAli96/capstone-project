import prisma from "../db/prisma";
import { statusData } from "../types/status";

export const findStatus = async (search: string, skip: number, take: number, userId: number | null) => {
    const whereCondition: any = {
        OR: [
            { spembayaran: { contains: search, mode: "insensitive" } },
            { spengiriman: { contains: search, mode: "insensitive" } },
            { pengiriman: { no_spb: { contains: search, mode: "insensitive" } } },
            { pengiriman: { customer: { contains: search, mode: "insensitive" } } },
            { pengiriman: { tujuan: { contains: search, mode: "insensitive" } } },
        ],
    };

    if (userId) {
        whereCondition.pengiriman = { id_user: userId };
    }

    return await prisma.status.findMany({
        include: { pengiriman: { include: { user: true } } },
        where: whereCondition,
        orderBy: {
            pengiriman: { tanggal: 'desc' },
        },
        skip,
        take,
    });
};

export const countStatus = async (search: string, userId: number | null) => {
    const whereCondition: any = {
        OR: [
            { spembayaran: { contains: search, mode: "insensitive" } },
            { spengiriman: { contains: search, mode: "insensitive" } },
            { pengiriman: { no_spb: { contains: search, mode: "insensitive" } } },
            { pengiriman: { customer: { contains: search, mode: "insensitive" } } },
            { pengiriman: { tujuan: { contains: search, mode: "insensitive" } } },
        ],
    };

    if (userId) {
        whereCondition.pengiriman = { id_user: userId };
    }

    return await prisma.status.count({ where: whereCondition });
};


export const findStatusById = async (itemId: number) => {
    const status = await prisma.status.findUnique({
        where: {
            id: itemId,
        },
        include: { pengiriman: { include: { user: true } } },
    });

    return status;
}

export const editStatus = async (itemId: number, item: statusData) => {
    const status = await prisma.status.update({
        where: { id: itemId },
        data: {
            image: item.image,
            spembayaran: item.spembayaran,
            spengiriman: item.spengiriman,
            id_pengiriman: item.id_pengiriman,

        },
    });
    return status;
}

export const updateStatusImage = async (id: number, imagePath: string) => {
    return await prisma.status.update({
        where: { id },
        data: { image: imagePath },
    });
};

export const countStatusPem = async () => {
    const pending = await prisma.status.count({
        where: { spengiriman: "Pending" }
    });

    const jemput = await prisma.status.count({
        where: { spengiriman: "Jemput Barang" }
    });

    const menuju = await prisma.status.count({
        where: { spengiriman: "Menuju Tujuan" }
    });

    const belumBayar = await prisma.status.count({
        where: { spembayaran: "Belum dibayar" }
    });

    return {
        pending,
        jemput,
        menuju,
        belumBayar
    };
};

