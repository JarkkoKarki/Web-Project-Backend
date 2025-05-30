import promisePool from "../../utils/database.js";

/**
 * Fetches all orders from the database along with their associated products.
 * The product names and descriptions are retrieved in the specified language.
 *
 * @param {string} [lang="en"] - The language for product names and descriptions.
 * @returns {Array} - A list of all orders, each containing products and other details.
 * @throws {Error} - Throws an error if there is a failure during the database operation.
 */

const listAllOrders = async (lang = "en") => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await promisePool.query(`
        SELECT * FROM orders
      `);

    const orders = [];

    for (const order of rows) {
      const [productRows] = await connection.query(
        `
          SELECT op.product_id,
                 op.quantity,
                 op.name_${lang} AS name,
                 op.desc_${lang} AS description,
                 op.price
          FROM order_products op
          WHERE op.order_id = ?
          `,
        [order.id]
      );

      orders.push({
        orderId: order.id,
        sessionId: order.session_id, // Include session_id in the response
        address: order.user_address,
        email: order.user_email,
        phone: order.user_phone,
        additionalInfo: order.additional_info,
        deliveryAddress: order.address,
        total_price: order.total_price,
        orderDate: order.order_date,
        status: order.status,
        products: productRows,
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

/**
 * Fetches all orders for a specific user, identified by `user.user_id`,
 * along with their associated products. Product names and descriptions are retrieved in the specified language.
 *
 * @param {Object} user - The user object containing `user_id` property.
 * @param {string} lang - The language for product names and descriptions.
 * @returns {Array|false} - An array of orders for the user or `false` if no orders are found.
 * @throws {Error} - Throws an error if the database operation fails.
 */

const listAllMyOrders = async (user, lang) => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    const [orderResults] = await promisePool.query(
      `
          SELECT *
          FROM orders
          WHERE user_id = ?
        `,
      [user.user_id]
    );

    const orders = [];

    console.log("Orders found:", orderResults);

    for (const order of orderResults) {
      const [productRows] = await connection.query(
        `
          SELECT op.product_id,
                 op.quantity,
                 op.name_${lang} AS name,
                 op.desc_${lang} AS description,
                op.price
          FROM order_products op
          WHERE op.order_id = ?
          `,
        [order.id]
      );

      orders.push({
        orderId: order.id,
        sessionId: order.session_id, // Include session_id here as well
        address: order.user_address,
        email: order.user_email,
        phone: order.user_phone,
        additionalInfo: order.additional_info,
        orderDate: order.order_date,
        status: order.status,
        totalPrice: order.total_price,
        products: productRows,
      });
    }

    await connection.commit();
    if (orders.length === 0) {
      return false;
    } else {
      return orders;
    }
  } catch (e) {
    await connection.rollback();
    console.error("Error getting user orders:", e);
    throw e;
  } finally {
    connection.release();
  }
};

/**
 * Adds a new order to the database, including the order details and the associated products.
 *
 * @param {Object} order - The order object containing the following properties:
 *   - `user_id`: The ID of the user placing the order.
 *   - `user_address`: The address for the order.
 *   - `total_price`: The total price of the order.
 *   - `products`: Array of products with `id` and `quantity`.
 *   - `session_id`: The session ID for the order.
 *   - `user_email`: The email of the user placing the order.
 *   - `user_phone`: The phone number of the user.
 *   - `additional_info`: Any additional information for the order.
 * @returns {Object} - Returns an object with `orderId` if the order is successfully created.
 * @throws {Error} - Throws an error if required fields are missing or there is an issue with the database operation.
 */

const addOrder = async (order) => {
  const {
    user_id,
    user_address,
    total_price,
    products,
    session_id,
    user_email,
    user_phone,
    additional_info,
  } = order;

  if (!user_id) {
    throw new Error("Missing user ID for order.");
  }
  if (!user_address) {
    throw new Error("Missing user address for order.");
  }
  if (!total_price) {
    throw new Error("Missing total price for order.");
  }
  if (!products || products.length === 0) {
    throw new Error("No products provided for order.");
  }

  const invalidProducts = products.filter(
    (product) => !product.id || !product.quantity
  );
  if (invalidProducts.length > 0) {
    throw new Error(
      "One or more products are missing valid IDs or quantities."
    );
  }

  const connection = await promisePool.getConnection();
  await connection.beginTransaction();

  try {
    const [result] = await connection.query(
      "INSERT INTO orders (user_id, user_address, total_price, session_id, user_email, user_phone, additional_info) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        user_id,
        user_address,
        total_price,
        session_id || null,
        user_email || null,
        user_phone || null,
        additional_info || null,
      ]
    );

    if (result.affectedRows === 0) {
      throw new Error("Order insertion failed, no rows affected.");
    }

    const orderId = result.insertId;

    const productIds = products.map((p) => p.id);
    const [dbProducts] = await connection.query(
      `SELECT id, name_fi, name_en, desc_fi, desc_en, price FROM products WHERE id IN (?)`,
      [productIds]
    );

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    const orderProductValues = products.map((p) => {
      const dbProd = productMap.get(p.id);
      if (!dbProd)
        throw new Error(`Product with ID ${p.id} not found in database.`);
      return [
        orderId,
        p.id,
        p.quantity,
        dbProd.name_fi,
        dbProd.name_en,
        dbProd.desc_fi,
        dbProd.desc_en,
        dbProd.price,
      ];
    });

    if (orderProductValues.length === 0) {
      throw new Error("No valid products to insert.");
    }

    await connection.query(
      `INSERT INTO order_products 
        (order_id, product_id, quantity, name_fi, name_en, desc_fi, desc_en, price)
       VALUES ?`,
      [orderProductValues]
    );
    await connection.commit();
    return { orderId };
  } catch (error) {
    await connection.rollback();
    throw new Error(`Error creating order: ${error.message}`);
  } finally {
    connection.release();
  }
};

/**
 * Updates the details of an existing order identified by `id`.
 *
 * @param {Object} order - The order object containing fields to be updated.
 * @param {number} id - The ID of the order to modify.
 * @returns {Object|false} - The updated result if successful, or `false` if no rows were affected.
 * @throws {Error} - Throws an error if the database operation fails.
 */

const modifyOrder = async (order, id) => {
  const [result] = await promisePool.query(
    `UPDATE orders 
         SET ? 
         WHERE id = ?`,
    [order, id]
  );
  console.log(result);
  if (result.affectedRows === 0) {
    return false;
  }
  return result;
};

/**
 * Updates the session ID of an existing order identified by `orderId`.
 *
 * @param {number} orderId - The ID of the order.
 * @param {string} sessionId - The new session ID to set for the order.
 * @returns {boolean} - `true` if the session ID was updated successfully, `false` if no rows were affected.
 * @throws {Error} - Throws an error if the database operation fails.
 */

const updateOrderSessionId = async (orderId, sessionId) => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `UPDATE orders SET session_id = ? WHERE id = ?`,
      [sessionId, orderId] // Update the session_id in the order
    );

    await connection.commit();

    if (result.affectedRows === 0) {
      return false;
    }
    return true;
  } catch (e) {
    await connection.rollback();
    console.error("Error updating order session_id:", e);
    throw e;
  } finally {
    connection.release();
  }
};

export {
  addOrder,
  listAllOrders,
  listAllMyOrders,
  modifyOrder,
  updateOrderSessionId,
};
