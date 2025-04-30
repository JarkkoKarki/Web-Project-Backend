import promisePool from "../../utils/database.js";


const listAllOrders = async () => {
    const [rows] = await promisePool.query(`
    SELECT * FROM orders`);
    return rows
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

export {addOrder, listAllOrders};