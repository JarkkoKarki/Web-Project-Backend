import {addOrder, listAllMyOrders, listAllOrders} from "../models/order-model.js";


const getOrders = async (req, res) => {
    const user = res.locals.user
    if (user.role !== 'admin'  ||  user.role !== 'employee'  )  {
        return res.status(401).json({ message: "Unauthorized: user not authenticated" });
    }
    const result = await listAllOrders();
    if (result) {
        res.json(result)
    } else {
        res.sendStatus(404);
    }
}

const getMyOrders = async(req, res) => {
    if (!res.locals.user) {
        return res.status(401).json({ message: "Unauthorized: user not authenticated" });
    }
    const user = res.locals.user
    console.log(user.address)
    console.log(user.user_address);
    const result = await listAllMyOrders(user);
    if (result) {
        res.json(result || [])
    } else {
        res.json(404);
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

export {postOrder, getOrders, getMyOrders};