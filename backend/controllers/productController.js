import { sql } from "../config/db.js";


// CRUD

export const getAllProducts = async (req, res) => {
    try {
        const products = await sql`
            SELECT * FROM products
            ORDER BY created_at DESC
        
        `;

        console.log("fetched products", products)
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.log("Error getAllProducts: ", error)
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getProduct = async (req, res) => {
    // Get a product
    
    const { id } = req.params;
    try {
        const product = await sql`SELECT * FROM products WHERE id = ${id}`

        return res.status(200).json({ success: true, data: product[0] });

    } catch (error) {
        console.log("Error getProducts: ", error)
        res.status(500).json({ success: false, message: error.message });
    }
};


export const createProdut = async (req, res) => {
    // Create a product
    const { name, price, image } = req.body;
    if (!name || !price || !image) {
        return res.status(400).json({ success: false, messag: "All fields are required" })
    }

    try {
        const newProduct = await sql`INSERT INTO products (name, price, image)
        VALUES (${name}, ${price}, ${image})
        RETURNING *`;

        console.log("New product added:", newProduct);
        return res.status(201).json({ success: true, data: newProduct[0] });
    } catch (error) {
        console.log("Error Create a product: ", error)
        res.status(500).json({ success: false, message: error.message });
    }
};


export const updateProduct = async (req, res) => {
    // Create a product
    const { id } = req.params;
    const { name, price, image } = req.body;

    try {
        const updateProduc = await sql`
        UPDATE products 
        SET name=${name}, price=${price}, image=${image} 
        WHERE id=${id}
        RETURNING *
        `;

        if (updateProduc.length === 0) {
            return res.status(404).json({
                seccess: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({ success: true, data: updateProduc[0] });

    } catch (error) {
        console.log("Error update a product: ", error)
        res.status(500).json({ success: false, message: error.message });
    }
};


export const deleteProduct = async (req, res) => {
    // Delete a product
    const { id } = req.params;

    try {
        const deleteProduct = await sql`
        DELETE FROM products WHERE id=${id} RETURNING *
        `;

        if (deleteProduct.length === 0) {
            return res.status(404).json({
                seccess: false,
                message: "Product not found"
            });
        }

        res.status(200).json({ seccess: true, data: deleteProduct[0] });

    } catch (error) {
        console.log("Error update a product: ", error)
        res.status(500).json({ success: false, message: error.message });
    }
};
