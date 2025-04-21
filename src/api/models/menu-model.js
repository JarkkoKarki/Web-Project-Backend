import promisePool from "../../utils/database.js";

const listAllProducts = async () => {
    const [rows] = await promisePool.query(`
        SELECT *
        FROM products`
    );
    console.log('row', rows);
    return rows;
};

const findProductById = async (id) => {
    const [rows] = await promisePool.query(`
        SELECT *
        from products
        where products.id = ?,` [id]
    );
    console.log('row', rows);
    if (rows.length === 0) {
        return false;
    }
    return rows;
};

const addProduct = async (product) => {
    const {name, description, price, picture} = product;
    const sql = `
        INSERT INTO products
        (name, description, price, picture)
        VALUES (?, ?, ?, ?)`;

    const params = [name, description, price, picture];
    const rows = await promisePool.query(sql, params);
    console.log('rows', rows);
    if (rows[0] === 0) {
        return false;
    }
    return rows;
};

const modifyProduct = async  (product, id) => {
    const sql = promisePool.format(`
          UPDATE products
          SET ?
          WHERE id = ?`,
        [product, id]
    );
    const rows = await promisePool.execute(sql);
    console.log('rows', rows);
    if (rows[0].affectedRows === 0) {
        return false;
    }
    return rows[0];
};

const removeProduct = async (id) => {
    const connection = await promisePool.getConnection();
    try {
        await connection.beginTransaction();

        await connection.execute(`
                    DELETE
                    FROM product_diets
                    WHERE product_id = ?`,
                    [id]
        );
        await connection.execute(`
                    DELETE
                    FROM product_categories
                    WHERE product_id = ?`,
                    [id]
        );
        const [rows] = await connection.execute(`
                    DELETE
                    FROM products
                    WHERE id = ?`,
                    [id]
        );
        console.log('rows', rows);
        if (rows.affectedRows === 0) {
            return false;
        }
        await connection.commit();
        return true;
    } catch (error) {
        await connection.rollback();
    } finally {
        connection.release();
    }
};

export {listAllProducts, addProduct, modifyProduct, findProductById, removeProduct}