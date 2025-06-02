import { countLaporan, findLaporan, upsertLaporanHarian } from "../repository/laporan";
import { LaporanData } from "../types/laporan";

export const getAllLaporan = async (search: string, page: number, perPage: number) => {
    const skip = (page - 1) * perPage;

    const [data, total] = await Promise.all([
        findLaporan(search, skip, perPage),
        countLaporan(search),
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