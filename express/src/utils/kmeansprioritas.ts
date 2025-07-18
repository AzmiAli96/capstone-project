import prisma from "../db/prisma";
// Import KMeans
const { kmeans } = require("ml-kmeans");


export const calculateKMeansPriority = async (item: {
    berat: number;
    id_wilayah: number;
    id_ongkos: number | null;
}) => {
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
        p.id_ongkos ?? -1, // Gunakan -1 jika null
    ]);

    const k = 3;

    if (dataset.length < k) {
        throw new Error(`Jumlah data pengiriman kurang dari jumlah cluster (${k}).`);
    }

    const totalList: number[] = pengirimanData.map((p) => Number(p.total));

    const kmeansResult = kmeans(dataset, k);

    if (!kmeansResult.centroids || kmeansResult.centroids.length === 0) {
        throw new Error("KMeans gagal menghasilkan centroid.");
    }
    if (kmeansResult.clusters.length !== totalList.length) {
        throw new Error("Jumlah cluster dan data total tidak cocok.");
    }

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

    const avgClusterTotal =
        totalList.filter((_, i) => kmeansResult.clusters[i] === predictedCluster)
            .reduce((a, b) => a + b, 0) /
        kmeansResult.clusters.filter((c: number) => c === predictedCluster).length;

    return {
        prioritas,
        rekomendasi_total: Math.round(avgClusterTotal),
    };
};