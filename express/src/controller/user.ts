import express, { NextFunction, Request, Response } from 'express';
import { createUser, deleteUserById, getAllUser, getCustomerUserCount, getUserById, handleImageUpload, updateUserService, useUser } from '../service/user';
import jwt from "jsonwebtoken";
import { accessValidation, roleAuthorization } from '../middleware/authmiddleware';

const router = express.Router();


export const RegisterController = async (req: Request, res: Response) => {
  try {
    const item = req.body;
    const user = await createUser(item);

    res.status(201).send({
      data: user,
      message: "Register Success",
    });
  } catch (error: any) {
    if (error.message === "Email sudah terdaftar") {
      return res.status(409).json({ message: error.message });
    }
    res.status(400).json({ message: error.message || "Bad Request" });
  }
};


export const LoginController = async (req: Request, res: Response) => {
  try {
    const item = req.body;
    const { user, token } = await useUser(item);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      domain: "gemilangcargo.com",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      user,
      token,
      message: "Login Success",
    });
  } catch (error: any) {
    res.status(400).send({ message: error.message });
  }
};

export const checkAuthController = async (req: Request, res: Response) => {
  const validationRequest = req as any;
  const userData = validationRequest.userData;

  try {

    res.status(200).json({
      user: userData,
      message: "Authenticated"
    });
  } catch (error: any) {
    res.status(401).send({ message: "Unauthorized" });
  }
};

// Route untuk logout
export const LogoutController = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout success" });
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const itemId = parseInt(req.params.id);
    const data = req.body;

    const updatedUser = await updateUserService(itemId, data);
    res.send(updatedUser);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

export const getAllUserController = async (req: Request, res: Response) => {
  try {
    const search = req.query.search?.toString() || "";
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 10;

    const { user, total } = await getAllUser(search, page, perPage);

    res.json({ data: user, total });
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const itemId = parseInt(req.params.id);
    const user = await getUserById(itemId);

    res.send(user);
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const itemId = parseInt(req.params.id);
    await deleteUserById(itemId);

    res.send("data success delete");
  } catch (error: any) {
    res.status(400).send(error.message);
  }
};

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const id = req.body.id ? parseInt(req.body.id) : undefined;

    if (!file) {
      return res.status(400).json({ error: "Gambar harus disediakan." });
    }

    const { imagePath } = await handleImageUpload(file, id);

    return res.status(200).json({
      message: "Gambar berhasil diunggah.",
      data: imagePath,
    });
  } catch (error: any) {
    console.error("Error:", error);
    return res.status(500).json({ error: `Terjadi kesalahan: ${error.message}` });
  }
};

export const getCustomerUserCountController = async (req: Request, res: Response) => {
  try {
    const count = await getCustomerUserCount();
    res.json({ count });
  } catch (error: any) {
    res.status(500).json({ message: "Error fetching customer count" });
  }
};

export default router;