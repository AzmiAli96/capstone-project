// service layer bertujuan untuk handle business logic


import { response } from "express";
import { countAllWilayah, countWilayah, deleteWilayah, editWilayah, findWilayah, findWilayahById, insertWilayah } from "../repository/wilayah";
import { WilayahData } from "../types/wilayah";

export const getAllWilayah = async (search: string, page: number, perPage: number) => {
    const skip = (page - 1) * perPage;

    const [data, total] = await Promise.all([
        findWilayah(search, skip, perPage),
        countWilayah(search),
    ]);
    return {
        data,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
    };
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

export const getTotalWilayah = async () => {
  return countAllWilayah();
};
