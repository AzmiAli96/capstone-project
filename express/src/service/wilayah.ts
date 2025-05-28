// service layer bertujuan untuk handle business logic


import { response } from "express";
import { deleteWilayah, editWilayah, findWilayah, findWilayahById, insertWilayah } from "../repository/wilayah";
import { WilayahData } from "../types/wilayah";

export const getAllWilayah = async (search: string, page: number, perPage: number) => {
    const skip = (page - 1) * perPage;
    const wilayah = await findWilayah(search, skip, perPage);
    return wilayah;
};

export const getWilayahById = async (itemId: number) => {
    const wilayah = await findWilayahById(itemId);
    if (!wilayah) {
        return response.status(400).send("Wilayah Not found");
    }
    return wilayah;
}

export const createWilayah = async (item: WilayahData) => {
    const wilayah = await insertWilayah(item)
    return wilayah;
}

export const updateWilayahById = async (itemId: number, item: WilayahData) => {
    const wilayah = await editWilayah(itemId, item);
    return wilayah;
}

export const deleteWilayahById = async (itemId: number) => {
    const wilayah = await deleteWilayah(itemId);
    return wilayah;
}