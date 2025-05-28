import prisma from "../db/prisma";
import { orderData } from "../types/order";

export const findOrder = async (search: string, skip: number, take: number) => {
    const order = await prisma.pengiriman.findMany({
        include: { user: true, wilayah: true, ongkos: true },
        where: {
            OR: [
                { customer: { contains: search, mode: "insensitive" } },
                { jemput: { contains: search, mode: "insensitive" } },
                { tujuan: { contains: search, mode: "insensitive" } },
                { user: { name: { contains: search, mode: "insensitive" } } },
                { wilayah: { wilayah: { contains: search, mode: "insensitive" } } },
                { ongkos: { jemput: { contains: search, mode: "insensitive" } } },
            ],
        },
        orderBy: {
            tanggal: 'desc',
        },
        skip,
        take,
    });
    return order;
}

export const countOrder = async (search: string) => {
    return prisma.pengiriman.count({
        where: {
            OR: [
                { customer: { contains: search, mode: "insensitive" } },
                { jemput: { contains: search, mode: "insensitive" } },
                { tujuan: { contains: search, mode: "insensitive" } },
                { user: { name: { contains: search, mode: "insensitive" } } },
                { wilayah: { wilayah: { contains: search, mode: "insensitive" } } },
                { ongkos: { jemput: { contains: search, mode: "insensitive" } } },
            ],
        },
    });
};


export const findOrderById = async (itemId: number) => {
    const order = await prisma.pengiriman.findUnique({
        where: {
            id: itemId,
        },
        include: { user: true, wilayah: true }
    });
    return order;
}

export const insertOrder = async (item: orderData) => {
    const wilayah = await prisma.wilayah.findUnique({
        where: { id: item.id_wilayah }
    });

    if (!wilayah) {
        throw new Error("Wilayah tidak ditemukan");
    }

    if (item.berat < 500 && (item.id_ongkos || item.jemput)) {
        throw new Error("Jemput dan ongkos hanya boleh diisi jika berat minimal 500 kilogram");
    }

    let total = Number(item.berat) * Number(wilayah.harga);
    let jemputValue = "Antar Sendiri";
    let idOngkosValue: number | null = null;

    if (item.berat >= 500 && item.id_ongkos) {
        const ongkos = await prisma.ongkos.findUnique({
            where: { id: item.id_ongkos }
        });

        if (!ongkos) {
            throw new Error("Ongkos tidak ditemukan");
        }

        // Hasil total(berat * wilayah) ditambah ongkos 
        total += Number(ongkos.harga);
        jemputValue = ongkos.jemput.trim() || "Antar Sendiri";
        idOngkosValue = item.id_ongkos;
    } else if (item.id_ongkos) {
        // Kalau berat < 500 tapi id_ongkos tetap dikirim, anggap tidak valid
        throw new Error("id_ongkos hanya boleh dikirim jika berat >= 500");
    }

    // Kemudian di bagian create:
    const order = await prisma.pengiriman.create({
        data: {
            no_spb: item.no_spb,
            customer: item.customer || null,
            berat: item.berat,
            koli: item.koli,
            pembayaran: item.pembayaran,
            jemput: jemputValue,
            tujuan: item.tujuan,
            total: total,
            ket: item.ket,
            image: item.image || null,
            tanggal: item.tanggal ? new Date(item.tanggal) : undefined,
            id_user: item.id_user!,
            id_wilayah: item.id_wilayah,
            id_ongkos: idOngkosValue
        },
    });

    // Buat status awal
    await prisma.status.create({
        data: {
            spengiriman: "Pending",
            spembayaran: "Belum dibayar",
            id_pengiriman: order.id,
        },
    });

    return {
        ...order,
        wilayah: wilayah.wilayah,
        jemput: jemputValue || null
    };
};

export const editOrder = async (itemId: number, item: orderData) => {
    const wilayah = await prisma.wilayah.findUnique({
        where: { id: item.id_wilayah },
    });

    if (!wilayah) {
        throw new Error("Wilayah tidak ditemukan");
    }

    // Validasi berat untuk layanan jemput
    if (item.berat < 500 && (item.id_ongkos || item.jemput)) {
        throw new Error("Jemput dan ongkos hanya boleh diisi jika berat minimal 500 kilogram");
    }

    let total = Number(item.berat) * Number(wilayah.harga);
    let jemputValue = "Antar Sendiri";
    let idOngkosValue: number | null = null;

    if (item.berat >= 500 && item.id_ongkos) {
        const ongkos = await prisma.ongkos.findUnique({
            where: { id: item.id_ongkos },
        });

        if (!ongkos) {
            throw new Error("Ongkos tidak ditemukan");
        }

        total += Number(ongkos.harga);
        jemputValue = ongkos.jemput.trim() || "Antar Sendiri";
        idOngkosValue = item.id_ongkos;
    } else if (item.id_ongkos) {
        throw new Error("id_ongkos hanya boleh dikirim jika berat >= 500");
    }

    const order = await prisma.pengiriman.update({
        where: { id: itemId },
        data: {
            no_spb: item.no_spb,
            customer: item.customer || null,
            berat: item.berat,
            koli: item.koli,
            pembayaran: item.pembayaran,
            total: total,
            ket: item.ket,
            jemput: jemputValue,
            tujuan: item.tujuan,
            image: item.image || null,
            tanggal: item.tanggal ? new Date(item.tanggal) : undefined,
            id_user: item.id_user,
            id_wilayah: item.id_wilayah,
            id_ongkos: item.id_ongkos || null,
        },
    });

    return {
        ...order,
        wilayah: wilayah.wilayah,
        jemput: jemputValue,
    };
};


export const deleteOrder = async (itemId: number) => {
    await prisma.status.deleteMany({
        where: {
            id_pengiriman: itemId,
        },
    });

    await prisma.pengiriman.delete({
        where: {
            id: itemId,
        },
    });
};

export const updateOrderImage = async (id: number, imagePath: string) => {
    return await prisma.pengiriman.update({
        where: { id },
        data: { image: imagePath },
    });
};