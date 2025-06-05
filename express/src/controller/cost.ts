// layer untuk handle request dan response

import express, { Request, Response } from 'express';
import { createOngkos, deleteOngkosById, getAllOngkos, getOngkosById, updateOngkosById } from '../service/cost';

const router = express.Router();

// Menampilkan Data
export const AllCostController = async (req: Request, res: Response) => {
    try {
        const search = req.query.search?.toString() || "";
        const page = parseInt(req.query.page as string) || 1;
        const perPage = parseInt(req.query.perPage as string) || 10;

        const ongkos = await getAllOngkos(search, page, perPage);

        res.send(ongkos);
    } catch (error: any) {
        res.status(400).send(error.message);
    }

};

export const CostByIdController = async (req: Request, res: Response) => {
    try {
        const itemId = parseInt(req.params.id);
        const ongkos = await getOngkosById(itemId);

        res.send(ongkos);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};


// Create Data
export const createCostController = async (req: Request, res: Response) => {
    try {
        const item = req.body;
        const ongkos = await createOngkos(item);

        res.send({
            data: ongkos,
            message: "Create data success",
        });
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

// update Data
export const updateCostController = async (req: Request, res: Response) => {
    try {
        const itemId = parseInt(req.params.id);
        const item = req.body;

        if (!
            (item.jemput &&
                item.harga
            )
        ) {
            return res.status(400).send("Some Field are missing");
        }

        const ongkos = await updateOngkosById(itemId, item);

        res.send({
            data: ongkos,
            message: "Update data success",
        });

    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

// Delete Data
export const deleteCostController = async (req: Request, res: Response) => {
    try {
        const itemId = req.params.id;

        await deleteOngkosById(parseInt(itemId));

        res.send("data success delete")
    } catch (error: any) {
        res.status(400).send(error.message);
    }
};

export default router;