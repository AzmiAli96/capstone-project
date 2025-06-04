// berkomunikasi dengan database

import prisma from "../db/prisma";
import bcrypt from 'bcrypt';
import { userData } from "../types/user";

export const registerUser = async (item: userData) => {
    const hashedPassword = await bcrypt.hash(item.password, 10);

    const user = await prisma.user.create({
        data: {
            name: item.name,
            email: item.email,
            password: hashedPassword,
            alamat: item.alamat,
            role: item.role,
            no_hp: item.no_hp,
            image: item.image
        },
    });
    return user;
}

export const findUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: { email }
    });
};

export const loginUser = async (item: userData) => {
    const user = await prisma.user.findUnique({
        where: {
            email: item.email,
        },
    });
    return user;
}

export const updateUser = async (itemId: number, item: userData) => {
    const updatedUser = await prisma.user.update({
        where: { id: itemId },
        data: {
            name: item.name,
            email: item.email,
            password: item.password
                ? await bcrypt.hash(item.password, 10)
                : undefined, // hanya update kalau password diisi
            alamat: item.alamat,
            role: item.role,
            no_hp: item.no_hp,
            image: item.image,
        },
    });
    return updatedUser;
};

export const findUser = async (search: string, skip: number, take: number) => {
    const user = await prisma.user.findMany({
        where: {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { alamat: { contains: search, mode: "insensitive" } },
                { role: { contains: search, mode: "insensitive" } },
                { no_hp: { contains: search, mode: "insensitive" } },
            ],
        },
        skip,
        take,
    });

    const total = await prisma.user.count({
        where: {
            OR: [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { role: { contains: search, mode: "insensitive" } },
            ],
        },
    });
    return { user, total };
}

export const findUserById = async (itemId: number) => {
    const user = await prisma.user.findUnique({
        where: {
            id: itemId,
        },
    });

    return user;
}


export const deleteUser = async (itemId: number) => {
    await prisma.user.delete({
        where: {
            id: itemId,
        },
    });
}

export const updateUserImage = async (id: number, imagePath: string) => {
    return await prisma.user.update({
        where: { id },
        data: { image: imagePath },
    });
};
