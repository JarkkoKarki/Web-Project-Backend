import {addProduct, findProductById, listAllProducts, modifyProduct, removeProduct} from "../models/menu-model.js";


const getProduct = async (req, res) => {
    const result = await listAllProducts();
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
    const result = await addProduct(req.body);
    if (result) {
        res.json(result);
    } else {
        res.sendStatus(404);
    }
};

const putProduct = async (req, res) => {
    const result = await modifyProduct(req.body, req.params.id);
    res.json(result);
};

const deleteProduct = async (req, res) => {
    const result = await removeProduct(req.params.id)
    if (result) {
        res.json(result);
    } else {
        res.sendStatus(404);
    }
};

export {getProduct, postProduct, putProduct, getProductById, deleteProduct}