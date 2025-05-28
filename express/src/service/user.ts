import { deleteUser, findUser, findUserById, loginUser, registerUser, updateUser, updateUserImage } from "../repository/user"
import bcrypt from 'bcrypt';
import { userData } from "../types/user";
import { response } from "express";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";



export const createUser = async (item: userData) => {

    const user = await registerUser(item);
    return user;
}

export const useUser = async (item: userData) => {
    const user = await loginUser(item);

    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(item.password, user.password);

    if (!isPasswordValid) {
        throw new Error("Wrong password");
    }

    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        alamat: user.alamat,
        no_hp: user.no_hp,
        role: user.role,
        image: user.image,
    }

    const secret = process.env.JWT_SECRET!;
    const expiresIn = 60 * 60 * 1;

    const token = jwt.sign(payload, secret, { expiresIn: expiresIn })

    return {
        user: payload,
        token: token
    };
};

export const getAllUser = async (search: string, page: number, perPage: number) => {
    const skip = (page - 1) * perPage;
    const { user, total } = await findUser(search, skip, perPage);
    return { user, total };
};

export const updateUserService = async (itemId: number, item: userData) => {
    const user = await updateUser(itemId, item);
    return user;
};

export const getUserById = async (itemId: number) => {
    const user = await findUserById(itemId);
    if (!user) {
        return response.status(400).send("user Not found");
    }
    return user;
}

export const deleteUserById = async (itemId: number) => {
    const user = await deleteUser(itemId);
    return user;
}

const uploadPath = path.join(process.cwd(), "uploads/users");

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

export const handleImageUpload = async (
    file: Express.Multer.File,
    id?: number
): Promise<{ imagePath: string }> => {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadPath, fileName);

    fs.writeFileSync(filePath, file.buffer);

    const imagePath = `/uploads/users/${fileName}`;

    if (id) {
        const user = await updateUserImage(id, imagePath);
        if (!user) {
            throw new Error("User tidak ditemukan.");
        }
    }

    return { imagePath };
};