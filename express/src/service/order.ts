import { response } from "express";
import { countOrder, deleteOrder, editOrder, findOrder, findOrderById, insertOrder, updateOrderImage } from "../repository/order";
import { orderData } from "../types/order";
import path from "path";
import fs from "fs";

export const getAllOrder = async (search: string, page: number, perPage: number) => {
    const skip = (page - 1) * perPage;

    const [data, total] = await Promise.all([
        findOrder(search, skip, perPage),
        countOrder(search),
    ]);

    return {
        data,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
    };
};

export const getOrderById = async (itemId: number) => {
    const order = await findOrderById(itemId);
    return order;
}

export const createOrder = async (item: orderData) => {
    const order = await insertOrder(item)
    return order;
}

export const updateOrderById = async (itemId: number, item: orderData) => {
    const order = await editOrder(itemId, item);
    return order;
}

export const deleteOrderById = async (itemId: number) => {
    const order = await deleteOrder(itemId);
    return order;
}

const uploadPath = path.join(process.cwd(), "uploads/order");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

export const handleImageUploadOrder = async (
    file: Express.Multer.File,
    id?: number
): Promise<{ imagePath: string }> => {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadPath, fileName);

    fs.writeFileSync(filePath, file.buffer);

    const imagePath = `/uploads/order/${fileName}`;

    if (id) {
        const order = await updateOrderImage(id, imagePath);
        if (!order) {
            throw new Error("Order tidak ditemukan.");
        }
    }

    return { imagePath };
};