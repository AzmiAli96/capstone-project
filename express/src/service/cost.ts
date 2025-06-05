// service layer bertujuan untuk handle business logic


import { response } from "express";
import { countOngkos, deleteOngkos, editOngkos, findOngkos, findOngkosById, insertOngkos } from "../repository/cost";
import { OngkosData } from "../types/cost";

export const getAllOngkos = async (search: string, page: number, perPage: number) => {
    const skip = (page - 1) * perPage;
    const [data, total] = await Promise.all([
        findOngkos(search, skip, perPage),
        countOngkos(search),
    ]);
    return {
        data,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
    };
};

export const getOngkosById = async (itemId: number) => {
    const ongkos = await findOngkosById(itemId);
    if (!ongkos) {
        return response.status(400).send("Ongkos Not found");
    }
    return ongkos;
}

export const createOngkos = async (item: OngkosData) => {
    const ongkos = await insertOngkos(item)
    return ongkos;
}

export const updateOngkosById = async (itemId: number, item: OngkosData) => {
    const ongkos = await editOngkos(itemId, item);
    return ongkos;
}

export const deleteOngkosById = async (itemId: number) => {
    const ongkos = await deleteOngkos(itemId);
    return ongkos;
}