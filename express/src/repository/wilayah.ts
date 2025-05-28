// berkomunikasi dengan database

import prisma from "../db/prisma";
import { WilayahData } from "../types/wilayah";

export const findWilayah = async (search: string, skip: number, take: number) => {
    const wilayah = await prisma.wilayah.findMany({
        where: {
            OR: [
                { provinsi: { contains: search, mode: "insensitive" } },
                { wilayah: { contains: search, mode: "insensitive" } },
            ],
        },
        skip,
        take,
    });
    return wilayah;
}

export const findWilayahById = async (itemId: number) => {
    const wilayah = await prisma.wilayah.findUnique({
        where: {
            id: itemId,
        },
    });

    return wilayah;
}

export const insertWilayah = async (item: WilayahData) => {
    const wilayah = await prisma.wilayah.create({
        data: {
            provinsi: item.provinsi,
            wilayah: item.wilayah,
            harga: item.harga,  
        },
    });
    return wilayah;
}

export const editWilayah = async (itemId: number, item: WilayahData) => {
    const wilayah = await prisma.wilayah.update({
        where: { id: itemId },
        data: {
            provinsi: item.provinsi,
            wilayah: item.wilayah,
            harga: item.harga, 
        },
    });
    return wilayah;
}

export const deleteWilayah = async (itemId: number) => {
    await prisma.wilayah.delete({
        where: {
            id: itemId,
        },
    });
}