import { countLaporan, findLaporanWithStatus, findStatusForLaporanByBulan, findStatusForLaporanByTanggal, upsertLaporanHarian } from "../repository/laporan";
import { LaporanData } from "../types/laporan";

export const getAllLaporan = async (search: string, page: number, perPage: number, userId: number | null) => {
    const skip = (page - 1) * perPage;

    const [data, total] = await Promise.all([
        findLaporanWithStatus(search, skip, perPage, userId),
        countLaporan(search, userId), // jika count juga perlu userId
    ]);

    return {
        data,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
    };
};


export const generateLaporan = async (tanggal: string, bb: number) => {
    return await upsertLaporanHarian(tanggal, bb);
};

export const getStatusByTanggal = async (tanggal: string, userId: number | null) => {
    const statusData = await findStatusForLaporanByTanggal(tanggal, userId);
    return statusData;
};

export const getStatusByBulan = async (bulan: number, tahun: number, userId: number | null) => {
    return await findStatusForLaporanByBulan(bulan, tahun, userId);
};
