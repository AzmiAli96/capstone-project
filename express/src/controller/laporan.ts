import { Request, Response } from "express";
import { generateLaporan, getAllLaporan } from "../service/laporan";

export const LaporanController = async (req: Request, res: Response) => {
    try {
        const search = req.query.search?.toString() || "";
        const page = parseInt(req.query.page as string) || 1;
        const perPage = parseInt(req.query.perPage as string) || 10;

        const laporan = await getAllLaporan(search, page, perPage);

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

