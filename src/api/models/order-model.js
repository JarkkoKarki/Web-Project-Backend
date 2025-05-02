import promisePool from "../../utils/database.js";


const listAllOrders = async () => {
    const [rows] = await promisePool.query(`
    SELECT * FROM orders`);
    return rows
}

const listAllMyOrders = async (user) => {
    const connection = await promisePool.getConnection();
    try {
        await connection.beginTransaction();

        const [orderResults] = await promisePool.query(`
        SELECT *
        FROM orders
        WHERE user_id = ?`,
        [user.user_id]);

        const orders = []

        for (const order of orderResults) {
            const [productRows] = await connection.query(`
            SELECT op.product_id,
            op.quantity,
            p.name,
            p.description,
            p.price
            FROM order_products op
            JOIN products p ON op.product_id = p.id
            WHERE op.order_id = ?`,
            [order.order_id]
            );

            orders.push({
                order_id: order.order_id,
                order_date: order.order_date,
                status: order.status,
                total_price: order.total_price,
                products: productRows
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


const addOrder = async (order, user) => {
    const {total_price, products = []} = order;
    const connection = await promisePool.getConnection();
    try {
        await connection.beginTransaction();

        const productCounts = {};
        for (const productId of products) {
            productCounts[productId] = (productCounts[productId] || 0) + 1;
        }

        const [result] = await connection.execute(`
        INSERT INTO orders 
        (user_id, total_price)
        VALUES (?, ?)`,
        [user.user_id, total_price]);

        const orderId = result.insertId;

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

export {addOrder, listAllOrders, listAllMyOrders};