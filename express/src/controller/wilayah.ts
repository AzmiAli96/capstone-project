// layer untuk handle request dan response

import express, { Request, Response } from 'express';
import { createWilayah, deleteWilayahById, getAllWilayah, getTotalWilayah, getWilayahById, updateWilayahById } from '../service/wilayah'; // mengambil prismaclient dari folder db

const router = express.Router();

// Menampilkan Data
export const AllWilayahController = async (req: Request, res: Response) => {
    try {
        const search = req.query.search?.toString() || "";
        const page = parseInt(req.query.page as string) || 1;
        const perPage = parseInt(req.query.perPage as string) || 10;

        const wilayah = await getAllWilayah(search, page, perPage);

        res.send( wilayah );
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

export const getWilayahByIdController = async (req: Request, res: Response) => {
    try {
        const itemId = parseInt(req.params.id);
        const wilayah = await getWilayahById(itemId);

        res.send(wilayah);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};


// Create Data
export const createWilayahController = async (req: Request, res: Response) => {
    try {
        const item = req.body;
        const wilayah = await createWilayah(item);

        res.send({
            data: wilayah,
            message: "Create data success",
        });
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

// update Data
export const updateWilayahController = async (req: Request, res: Response) => {
    try {
        const itemId = parseInt(req.params.id);
        const item = req.body;

        if (!
            (item.provinsi &&
                item.wilayah &&
                item.harga
            )
        ) {
            return res.status(400).send("Some Field are missing");
        }

        const wilayah = await updateWilayahById(itemId, item);

        res.send({
            data: wilayah,
            message: "Update data success",
        });

    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

// Delete Data
export const deleteWilayahController = async (req: Request, res: Response) => {
    try {
        const itemId = req.params.id;

        await deleteWilayahById(parseInt(itemId));

        res.send("data success delete")
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

export const WilayahCountController = async (req: Request, res: Response) => {
  try {
    const count = await getTotalWilayah();
    res.send({ count });
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
};

export default router;