import express from "express";
import { getAllProducts, getProduct, createProdut, updateProduct, deleteProduct } from "../controllers/productController.js";


// Definimos un objeto para manejar las rutas con express
const router = express.Router();


router.get("/", getAllProducts);

router.get("/:id", getProduct);

router.post("/", createProdut);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);



export default router;





