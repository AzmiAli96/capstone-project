import { response } from "express";
import { countStatus, countStatusPem, editStatus, findStatus, findStatusById, updateStatusImage } from "../repository/status";
import { statusData } from "../types/status";
import path from "path";
import fs from "fs";


export const getAllstatus = async (search: string, page: number, perPage: number, userId: number | null) => {
    const skip = (page - 1) * perPage;
    const [data, total] = await Promise.all([
        findStatus(search, skip, perPage, userId),
        countStatus(search, userId),
    ]);
    return {
        data,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
    };
};

export const getStatusById = async (itemId: number) => {
    const status = await findStatusById(itemId);
    if (!status) {
        return response.status(400).send("Status Not found");
    }
    return status;
}

export const updateStatusById = async (itemId: number, item: statusData) => {
    const status = await editStatus(itemId, item);
    return status;
}

const uploadPath = path.join(process.cwd(), "uploads/pembayaran");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

export const handleImageUploadStatus = async (
    file: Express.Multer.File,
    id?: number
): Promise<{ imagePath: string }> => {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadPath, fileName);

    fs.writeFileSync(filePath, file.buffer);

    const imagePath = `/uploads/pembayaran/${fileName}`;

    if (id) {
        const status = await updateStatusImage(id, imagePath);
        if (!status) {
            throw new Error("status tidak ditemukan.");
        }
    }

    return { imagePath };
};

export const countTotalStatus = async () => {
  return countStatusPem();
};
