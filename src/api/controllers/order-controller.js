import {addOrder, listAllOrders} from "../models/order-model.js";


const getOrders = async (req, res) => {
    const result = await listAllOrders();
    if (result) {
        res.json(result)
    } else {
        res.sendStatus(404);
    }
}

const postOrder = async (req, res) => {
    const user = res.locals.user
    const result = await addOrder(req.body, user);
    if (result) {
        res.json(result)
    } else {
        res.sendStatus(404);
    }
}

export {postOrder, getOrders};