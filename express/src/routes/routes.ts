import express from "express";
import { AllWilayahController, createWilayahController, deleteWilayahController, getWilayahByIdController, updateWilayahController } from '../controller/wilayah';
import { checkAuthController, deleteUserController, getAllUserController, getUserByIdController, LoginController, LogoutController, RegisterController, updateUserController, uploadImage } from "../controller/user";
import { createOrderController, deleteOrderController, OrderByIdController, OrderController, updateOrderController, uploadImageOrder } from "../controller/order";
import { StatusByIdController, StatusController, updateStatusController, uploadImageStatus } from "../controller/status";
import { AllCostController, CostByIdController, createCostController, deleteCostController, updateCostController } from "../controller/cost";
import { accessValidation, roleAuthorization } from "../middleware/authmiddleware";
import multer from "multer";

const router = express.Router();
const upload = multer();


// Test Route 
router.get("/", (req, res) => {
    res.send("Berhasil Bro");
});

// Router untuk wilayah 
router.get('/wilayah', AllWilayahController);
router.get('/wilayah/:id', getWilayahByIdController);
router.post('/wilayah', createWilayahController);
router.put('/wilayah/:id', updateWilayahController);
router.delete('/wilayah/:id', deleteWilayahController);


// Router untuk cost 
router.get('/cost', AllCostController);
router.get('/cost/:id', CostByIdController);
router.post('/cost', createCostController);
router.put('/cost/:id', updateCostController);
router.delete('/cost/:id', deleteCostController);

// Router untuk Login 
router.post('/user/register', RegisterController);
router.post('/user/login', LoginController);
router.post('/logout', LogoutController);

// Router untuk user 
router.get('/check-auth', accessValidation, checkAuthController);
router.get("/user/", accessValidation, roleAuthorization("admin"), getAllUserController);
router.get("/user/:id", accessValidation, getUserByIdController);
router.put("/user/:id", accessValidation, updateUserController);
router.delete("/user/:id", accessValidation, deleteUserController);
router.post("/user/upload", upload.single("image"), uploadImage);

// Router untuk pengiriman/order
router.get('/order', OrderController);
router.get('/order/:id', OrderByIdController);
router.post('/order', createOrderController);
router.put('/order/:id', updateOrderController);
router.delete('/order/:id', deleteOrderController);
router.post("/order/upload", upload.single("image"), uploadImageOrder);

// Router untuk pengiriman/order
router.get('/status', StatusController);
router.get('/status/:id', StatusByIdController);
router.put('/status/:id', updateStatusController);
router.post("/status/upload", upload.single("image"), uploadImageStatus);



export default router;