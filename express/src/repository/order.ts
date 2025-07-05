import prisma from "../db/prisma";
import { orderData } from "../types/order";
import { calculateKMeansPriority } from "../utils/kmeansprioritas";


export const findOrder = async (search: string, skip: number, take: number) => {
    const order = await prisma.pengiriman.findMany({
        include: { user: true, wilayah: true, ongkos: true },
        where: {
            OR: [
                { customer: { contains: search, mode: "insensitive" } },
                { jemput: { contains: search, mode: "insensitive" } },
                { tujuan: { contains: search, mode: "insensitive" } },
                { no_spb: { contains: search, mode: "insensitive" } },
                { prioritas: { contains: search, mode: "insensitive" } },
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
                { no_spb: { contains: search, mode: "insensitive" } },
                { prioritas: { contains: search, mode: "insensitive" } },
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

    if (!wilayah) throw new Error("Wilayah tidak ditemukan");

    if (item.berat < 500 && (item.id_ongkos || item.jemput)) {
        throw new Error("Jemput dan ongkos hanya boleh diisi jika berat minimal 500 kilogram");
    }

    let total = Number(item.berat) * Number(wilayah.harga);
    let jemputValue = "Terima Kantor";
    let idOngkosValue: number | null = null;

    if (item.berat >= 500 && item.id_ongkos) {
        const ongkos = await prisma.ongkos.findUnique({
            where: { id: item.id_ongkos }
        });

        if (!ongkos) throw new Error("Ongkos tidak ditemukan");

        total += Number(ongkos.harga);
        jemputValue = ongkos.jemput.trim() || "Terima Kantor";
        idOngkosValue = item.id_ongkos;
    } else if (item.id_ongkos) {
        throw new Error("id_ongkos hanya boleh dikirim jika berat >= 500");
    }

    const { prioritas, rekomendasi_total } = await calculateKMeansPriority({
        berat: item.berat,
        id_wilayah: item.id_wilayah,
        id_ongkos: item.id_ongkos ?? null
    });


    const order = await prisma.pengiriman.create({
        data: {
            no_spb: item.no_spb,
            customer: item.customer || null,
            berat: item.berat,
            koli: item.koli,
            pembayaran: item.pembayaran,
            jemput: jemputValue,
            tujuan: item.tujuan,
            prioritas: prioritas,
            total: total,
            ket: item.ket,
            image: item.image || null,
            tanggal: item.tanggal ? new Date(item.tanggal) : undefined,
            id_user: item.id_user!,
            id_wilayah: item.id_wilayah,
            id_ongkos: idOngkosValue
        },
    });

    await prisma.status.create({
        data: {
            spengiriman: "Pending",
            spembayaran: "Belum dibayar",
            tanggal: new Date(),
            id_pengiriman: order.id,
        },
    });

    return {
        ...order,
        wilayah: wilayah.wilayah,
        jemput: jemputValue || null,
        rekomendasi_total,
        prioritas,
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
    let jemputValue = "Terima Kantor";
    let idOngkosValue: number | null = null;

    if (item.berat >= 500 && item.id_ongkos) {
        const ongkos = await prisma.ongkos.findUnique({
            where: { id: item.id_ongkos },
        });

        if (!ongkos) {
            throw new Error("Ongkos tidak ditemukan");
        }

        total += Number(ongkos.harga);
        jemputValue = ongkos.jemput.trim() || "Terima Kantor";
        idOngkosValue = item.id_ongkos;
    } else if (item.id_ongkos) {
        throw new Error("id_ongkos hanya boleh dikirim jika berat >= 500");
    }

    const { kmeans } = require("ml-kmeans");

    const pengirimanData = await prisma.pengiriman.findMany({
        select: {
            berat: true,
            id_wilayah: true,
            id_ongkos: true,
            total: true,
        },
    });

    const dataset: number[][] = pengirimanData.map((p) => [
        p.berat,
        p.id_wilayah,
        p.id_ongkos ?? -1,
    ]);
    const totalList: number[] = pengirimanData.map((p) => Number(p.total));

    const k = 3;
    if (dataset.length < k) {
        throw new Error(`Jumlah data pengiriman kurang dari jumlah cluster (${k})`);
    }

    const kmeansResult = kmeans(dataset, k);

    const newData = [item.berat, item.id_wilayah, item.id_ongkos ?? -1];
    const euclideanDistance = (a: number[], b: number[]) =>
        Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0));

    let predictedCluster = 0;
    let minDistance = Infinity;

    kmeansResult.centroids.forEach((c: any, idx: number) => {
        const centroid = Array.isArray(c) ? c : c.centroid;
        const dist = euclideanDistance(newData, centroid);
        if (dist < minDistance) {
            minDistance = dist;
            predictedCluster = idx;
        }
    });

    const clusterAverages = Array(k)
        .fill(0)
        .map((_, clusterId) => {
            const totalInCluster = totalList.filter(
                (_, idx) => kmeansResult.clusters[idx] === clusterId
            );
            const avg =
                totalInCluster.length > 0
                    ? totalInCluster.reduce((a, b) => a + b, 0) / totalInCluster.length
                    : 0;
            return { clusterId, average: avg };
        });

    clusterAverages.sort((a, b) => b.average - a.average);

    const clusterToPriority = new Map<number, string>();
    clusterAverages.forEach((c, idx) => {
        if (idx === 0) clusterToPriority.set(c.clusterId, "Tinggi");
        else if (idx === 1) clusterToPriority.set(c.clusterId, "Sedang");
        else clusterToPriority.set(c.clusterId, "Rendah");
    });

    const prioritas = clusterToPriority.get(predictedCluster) || "Rendah";

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
            prioritas: prioritas,
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
        prioritas,
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

export const findOrderNoSPB = async (no_spb: string) => {
    if (!no_spb || no_spb.trim() === "") return null;
    return await prisma.pengiriman.findUnique({
        where: { no_spb }
    });
};

export const countAllOrder = async () => {
    return prisma.pengiriman.count();
};

export const countOrderPerMonth = async () => {
    const result = await prisma.pengiriman.groupBy({
        by: ["tanggal"],
        _count: { id: true },
    });

    return result;
};


