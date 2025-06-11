import { Request, Response } from "express";
import { generateLaporan, getAllLaporan, getStatusByBulan, getStatusByTanggal } from "../service/laporan";

export const LaporanController = async (req: Request, res: Response) => {
    try {
        const search = req.query.search?.toString() || "";
        const page = parseInt(req.query.page as string) || 1;
        const perPage = parseInt(req.query.perPage as string) || 10;

        const userId = (req as any).user?.id || null; // pastikan token decode menyimpan id di req.user

        const laporan = await getAllLaporan(search, page, perPage, userId);

        res.send(laporan);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

export const createOrUpdateLaporan = async (req: Request, res: Response) => {
    try {
        const { tanggal, bb } = req.body;

        if (!tanggal || bb === undefined) {
            return res.status(400).json({ error: "Tanggal dan bb wajib diisi" });
        }

        const laporan = await generateLaporan(tanggal, Number(bb));

        res.status(200).json({
            message: "Laporan harian berhasil disimpan",
            data: laporan
        });
    } catch (error) {
        console.error("Gagal menyimpan laporan harian:", error);
        res.status(500).json({ error: "Gagal menyimpan laporan harian" });
    }
};

export const LaporanHarianController = async (req: Request, res: Response) => {
    try {
        const tanggal = req.query.tanggal?.toString();
        if (!tanggal) return res.status(400).send("Tanggal wajib diisi");

        const userId = (req as any).user?.id || null;

        const data = await getStatusByTanggal(tanggal, userId);

        res.send(data);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

export const LaporanBulananController = async (req: Request, res: Response) => {
    try {
        const bulan = parseInt(req.query.bulan as string);
        const tahun = parseInt(req.query.tahun as string);

        if (!bulan || !tahun) {
            return res.status(400).send("Bulan dan tahun wajib diisi");
        }

        const userId = (req as any).user?.id || null;

        const data = await getStatusByBulan(bulan, tahun, userId);

        res.send(data);
    } catch (error: any) {
        res.status(500).send(error.message);
    }
};