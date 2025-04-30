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
        res.status(201).json({ message: 'Order created', orderId: result.orderId });
    } else {
        res.status(404).json({ error: 'Failed to add order' });
    }
}

export {postOrder, getOrders};