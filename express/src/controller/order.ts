import express, { Request, Response } from 'express';
import { createOrder, deleteOrderById, getAllOrder, getOrderById, handleImageUploadOrder, updateOrderById } from '../service/order';
import { orderData } from '../types/order';

const router = express.Router();

// Menampilkan Data
export const OrderController = async (req: Request, res: Response) => {
    try {
        const search = req.query.search?.toString() || "";
        const page = parseInt(req.query.page as string) || 1;
        const perPage = parseInt(req.query.perPage as string) || 10;

        const order = await getAllOrder(search, page, perPage);

        res.send(order);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

export const OrderByIdController = async (req: Request, res: Response) => {
    try {
        const itemId = parseInt(req.params.id);
        const order = await getOrderById(itemId);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.send(order);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

// Create Data
export const createOrderController = async (req: Request, res: Response) => {
    try {
        const body = req.body;

        const item: orderData = {
            no_spb: body.no_spb,
            customer: body.customer,
            berat: parseInt(body.berat),
            koli: parseInt(body.koli),
            pembayaran: body.pembayaran,
            jemput: body.jemput,
            tujuan: body.tujuan,
            total: parseFloat(body.total),
            ket: body.ket,
            image: body.image,
            tanggal: body.tanggal,
            id_user: parseInt(body.id_user),
            id_wilayah: parseInt(body.id_wilayah),
            id_ongkos: parseInt(body.id_ongkos)
        };

        const order = await createOrder(item);

        res.send({
            data: order,
            message: "Create data success",
        });
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

export const updateOrderController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const body = req.body;

        if (
            !(
                body.no_spb &&
                body.berat &&
                body.koli &&
                body.pembayaran &&
                body.ket &&
                body.id_wilayah
            )
        ) {
            return res.status(400).send("Some fields are missing");
        }

        const item: orderData = {
            no_spb: body.no_spb,
            customer: body.customer || null,
            berat: parseInt(body.berat),
            koli: parseInt(body.koli),
            pembayaran: body.pembayaran,
            jemput: body.jemput || null,
            tujuan: body.tujuan,
            total: parseFloat(body.total),
            ket: body.ket,
            image: body.image,
            tanggal: body.tanggal,
            id_wilayah: parseInt(body.id_wilayah),
            id_ongkos: parseInt(body.id_ongkos)
        };

        const updatedOrder = await updateOrderById(Number(id), item);

        res.send({
            data: updatedOrder,
            message: "Update data success"
        });
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};



export const deleteOrderController = async (req: Request, res: Response) => {
    try {
        const itemId = parseInt(req.params.id);

        if (isNaN(itemId)) {
            return res.status(400).send("ID tidak valid");
        }

        const deleted = await deleteOrderById(itemId);

        res.send({
            message: "Data berhasil dihapus",
            deleted,
        });
    } catch (error: any) {
        res.status(400).send({ error: error.message });
    }
};

export const uploadImageOrder = async (req: Request, res: Response) => {
    try {
        const file = req.file;
        const id = req.body.id ? parseInt(req.body.id) : undefined;

        if (!file) {
            return res.status(400).json({ error: "Gambar harus disediakan." });
        }

        const { imagePath } = await handleImageUploadOrder(file, id);

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