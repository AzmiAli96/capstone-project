import express, { Request, Response } from 'express';
import { getAllstatus, getStatusById, handleImageUploadStatus, updateStatusById } from '../service/status';
import jwt from "jsonwebtoken";

const router = express.Router();

// Menampilkan Data
export const StatusController = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).send("Unauthorized");

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        const userId = decoded.id;  

        const search = req.query.search?.toString() || "";
        const page = parseInt(req.query.page as string) || 1;
        const perPage = parseInt(req.query.perPage as string) || 10;
         const userOnly = req.query.userOnly === "true";

        const status = await getAllstatus(search, page, perPage, userOnly ? userId : null);

        res.send(status);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

export const StatusByIdController = async (req: Request, res: Response) => {
    try {
        const itemId = parseInt(req.params.id);
        const status = await getStatusById(itemId);

        res.send(status);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

export const updateStatusController = async (req: Request, res: Response) => {
    try {
        const itemId = parseInt(req.params.id);
        const item = req.body;

        if (!
            (item.spembayaran &&
                item.spengiriman
            )
        ) {
            return res.status(400).send("Some Field are missing");
        }

        const status = await updateStatusById(itemId, item);

        res.send({
            data: status,
            message: "Update data success",
        });

    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

export const uploadImageStatus = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const id = req.body.id ? parseInt(req.body.id) : undefined;

    if (!file) {
      return res.status(400).json({ error: "Gambar harus disediakan." });
    }

    const { imagePath } = await handleImageUploadStatus(file, id);

    return res.status(200).json({
      message: "Gambar berhasil diunggah.",
      data: imagePath,
    });
  } catch (error: any) {
    console.error("Error:", error);
    return res.status(500).json({ error: `Terjadi kesalahan: ${error.message}` });
  }
};

export default router;