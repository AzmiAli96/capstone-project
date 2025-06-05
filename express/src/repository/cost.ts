// berkomunikasi dengan database

import prisma from "../db/prisma";
import { OngkosData } from "../types/cost";

export const findOngkos = async (search: string, skip: number, take: number) => {
    const ongkos = await prisma.ongkos.findMany({
        where: {
            OR: [
                { jemput: { contains: search, mode: "insensitive" } },
            ],
        },
        skip,
        take,
    });
    return ongkos;
}

export const countOngkos = async (search: string) => {
    const ongkos = await prisma.ongkos.count({
        where: {
            OR: [
                { jemput: { contains: search, mode: "insensitive" } },
            ],
        }
    });
    return ongkos;
}

export const findOngkosById = async (itemId: number) => {
    const ongkos = await prisma.ongkos.findUnique({
        where: {
            id: itemId,
        },
    });

    return ongkos;
}

export const insertOngkos = async (item: OngkosData) => {
    const ongkos = await prisma.ongkos.create({
        data: {
            jemput: item.jemput,
            harga: item.harga,  
        },
    });
    return ongkos;
}

export const editOngkos = async (itemId: number, item: OngkosData) => {
    const ongkos = await prisma.ongkos.update({
        where: { id: itemId },
        data: {
            jemput: item.jemput,
            harga: item.harga,  
        },
    });
    return ongkos;
}

export const deleteOngkos = async (itemId: number) => {
    await prisma.ongkos.delete({
        where: {
            id: itemId,
        },
    });
}