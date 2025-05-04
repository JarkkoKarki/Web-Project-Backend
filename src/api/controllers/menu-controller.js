import {
    addProduct,
    findProductById,
    listAllProducts,
    listAllProductsBothLanguages,
    modifyProduct,
    removeProduct
} from "../models/menu-model.js";


const getProductsBothLanguages = async (req, res) => {
    const result = await listAllProductsBothLanguages();
    res.json(result);
};

const getProduct = async (req, res) => {
    const lang = req.params.lang === 'fi' ? 'fi' : 'en';
    const result = await listAllProducts(lang);
    res.json(result);
};

const getProductById = async (req, res) => {
    const result = await findProductById(req.params.id)
    if (result) {
        res.json(result);
    } else {
        res.sendStatus(404);
    }
};

const postProduct = async (req, res) => {
    try {
        console.log(req.filename)
        req.body.filename = req.file?.thumbnailPath || "uploads/default.png";
        console.log(req.body.filename)
        const result = await addProduct(req.body);
        if (result) {
            res.status(201).json({
                message: "Product added successfully",
                result,
            });
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error("Error in postProduct:", error);
        res.status(500).json({error: "Internal Server Error"});
    }
};

const putProduct = async (req, res) => {
    try {
        if (req.file) {
            req.body.filename = req.file?.thumbnailPath || "uploads/default.png";
        }
        const result = await modifyProduct(req.body, req.params.id);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({message: "Product not found"})
        }
    } catch (error) {
        console.error("Error in putProduct:", error);
        res.status(500).json({error: "Internal Server Error"})
    }
};

const deleteProduct = async (req, res) => {
    const result = await removeProduct(req.params.id)
    if (result) {
        res.status(200).json({message: "Product deleted successfully"});
    } else {
        res.sendStatus(404);
    }
};

export {
    getProductsBothLanguages,
    getProduct,
    postProduct,
    putProduct,
    getProductById,
    deleteProduct,
}