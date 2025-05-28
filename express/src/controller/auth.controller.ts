import { Request, Response } from "express";

export const test = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({ message: "Sukses" })
    } catch (error) {
        return res.status(500).json({ message: "Intenal server error" })
    }
}