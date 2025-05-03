import promisePool from "../../utils/database.js";

//List all orders and also products
const listAllOrders = async (lang = 'en') => {
    const connection = await promisePool.getConnection();
    try {
        await connection.beginTransaction();

        const [rows] = await promisePool.query(`
        SELECT * FROM orders
        `);

        const orders = [];

        for (const order of rows) {
            const [productRows] = await connection.query(`
                SELECT op.product_id,
                op.quantity,
                p.name_${lang} AS name,
                p.desc_${lang} AS description
                FROM order_products op
                JOIN products p ON op.product_id = p.id
                WHERE op.order_id = ?`,
                [order.id]);

            orders.push({
                orderId: order.id,
                address: order.user_address,
                deliveryAddress: order.address,
                orderDate: order.order_date,
                status: order.status,
                products: productRows
            });
        }

        await connection.commit();

        return orders.length > 0 ? orders : [];

    } catch (e) {
        await connection.rollback();
        console.error("Error getting all orders:", e);
        throw e;
    } finally {
        connection.release();
    }
};

//Gets all orders by user
const listAllMyOrders = async (user, lang) => {
    const connection = await promisePool.getConnection();
    try {
        await connection.beginTransaction();

        //get all rows from the order table
        const [orderResults] = await promisePool.query(`
        SELECT *
        FROM orders
        WHERE user_id = ?`,
        [user.user_id]);

        const orders = []

        console.log("Orders found:", orderResults);

        //Join all rows from the product table to the order_products where
        // order.id  match from the previous query
        for (const order of orderResults) {
            const [productRows] = await connection.query(`
            SELECT op.product_id,
            op.quantity,
            p.name_${lang} AS name,
            p.desc_${lang} AS description,
            p.price
            FROM order_products op
            JOIN products p ON op.product_id = p.id
            WHERE op.order_id = ?`,
            [order.id]
            );

            orders.push({
                orderId: order.id,
                address: order.user_address,
                orderDate: order.order_date,
                status: order.status,
                totalPrice: order.total_price,
                products: productRows // List of product objects
            });
        }

        await connection.commit();
        if (orders.length === 0) {
            return false
        } else {
            return orders
        }

    } catch (e) {
        await connection.rollback();
        console.error("Error getting user orders:", e);
        throw e;
    } finally {
        connection.release();
    }
}

//Add order
const addOrder = async (order, user) => {
    const {total_price, products = []} = order;
    const connection = await promisePool.getConnection();
    try {
        await connection.beginTransaction();

        //check how many same product id's appear on the products list
        const productCounts = {};
        for (const productId of products) {
            productCounts[productId] = (productCounts[productId] || 0) + 1;
        }

        //Add values to the order table
        const [result] = await connection.execute(`
        INSERT INTO orders 
        (user_id, user_address, total_price)
        VALUES (?, ?, ?)`,
        [user.user_id, user.address, total_price]);

        //Get the table id from previous query
        const orderId = result.insertId;

        //Insert values to the order_products table
        for (const [productId, quantity] of Object.entries(productCounts)) {
            await connection.execute(`
                INSERT INTO order_products (order_id, product_id, quantity)
                VALUES (?, ?, ?)`,
                [orderId, parseInt(productId), quantity]
            );
        }

        await connection.commit();

        if (result.affectedRows  === 0) {
            return false;
        }
        return {orderId};

    } catch (e) {
        await connection.rollback();
        console.error("Error Adding Order:", e);
        throw e;
    } finally {
        connection.release();
    }
}

//For changing order status
const modifyOrder = async (order, id) => {
    const [result] = await promisePool.query(
        `UPDATE orders 
         SET ? 
         WHERE id = ?`,
         [order, id]
    );
    console.log(result);
    if (result.affectedRows === 0) {
        return false
    }
    return result;
}

export {addOrder, listAllOrders, listAllMyOrders, modifyOrder};