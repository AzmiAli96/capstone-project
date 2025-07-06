import { response } from "express";
import { countAllOrder, countOrder, countOrderPerMonth, deleteOrder, editOrder, findOrder, findOrderById, findOrderNoSPB, insertOrder, updateOrderImage } from "../repository/order";
import { orderData } from "../types/order";
import path from "path";
import fs from "fs";
const rootPath = path.resolve(__dirname, "../../"); // naik 2 folder dari dist/
const uploadPath = path.join(rootPath, "uploads/order");

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

export const findOrderByNoSPB = async (no_spb: string) => {
    const order = await findOrderNoSPB(no_spb);
    return order
};

export const getTotalOrder = async () => {
  return countAllOrder();
};

export const getOrderPerMonth = async () => {
  const rawData = await countOrderPerMonth();

  const grouped: Record<string, number> = {};

  rawData.forEach((item) => {
    const date = new Date(item.tanggal);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    if (!grouped[key]) grouped[key] = 0;
    grouped[key] += item._count.id;
  });

  return Object.entries(grouped)
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([bulan, jumlah]) => ({
      bulan,
      jumlah,
    }));
};