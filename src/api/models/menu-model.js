import promisePool from "../../utils/database.js";

//Get all products listed by categories
const listAllProductsByCategory = async () => {
    const [rows] = await promisePool.query(`

        SELECT p.*, d.diet, c.category
        FROM products p
        LEFT JOIN product_categories pc ON p.id = pc.product_id
        LEFT JOIN categories c ON pc.category_id = c.id
        LEFT JOIN product_diets pd ON p.id = pd.product_id
        LEFT JOIN diets d ON pd.diet_id = d.id
    `);
    console.log('row', rows);
    if (rows.length === 0) {
        return false;
    }

    const productsByCategory = {};

    rows.forEach(row => {
        // Initialize category array if it doesn't exist
        if (!productsByCategory[row.category]) {
            productsByCategory[row.category] = [];
        }
        // Check if the product already exists in the category
        let existingProduct = productsByCategory[row.category].find(p => p.id === row.id);

        // If the product doesn't exist, create a new product object
        if (!existingProduct) {
            existingProduct = {
                id: row.id,
                name: row.name,
                description: row.description,
                price: row.price,
                filename: row.filename,
                diets: []
            };
            productsByCategory[row.category].push(existingProduct);
        }
        // Add diet to the product if it doesn't already exist
        if (row.diet && !existingProduct.diets.includes(row.diet)) {
            existingProduct.diets.push(row.diet);
        }
    });
    return productsByCategory;
};

//Finding product by id and its categories and diets
const findProductById = async (id) => {
    const [rows] = await promisePool.query(`

        SELECT p.*, d.diet, c.category
        FROM products p
        LEFT JOIN product_categories pc ON p.id = pc.product_id
        LEFT JOIN categories c ON pc.category_id = c.id
        LEFT JOIN product_diets pd ON p.id = pd.product_id
        LEFT JOIN diets d ON pd.diet_id = d.id
        WHERE p.id = ?`,
        [id]
    );
    console.log('row', rows);
    if (rows.length === 0) {
        return false;
    }
    const categories = []
    const diets = []

    //Adding multiple diets and category to a product
    rows.forEach(row  => {
        if  (row.category  && !categories.includes(row.category))  {
            categories.push(row.category);
        }
        if (row.diet  && !diets.includes(row.diet)) {
            diets.push(row.diet);
        }
    });
    return {
        id: rows[0].id,
        name: rows[0].name,
        description: rows[0].description,
        price: rows[0].price,
        filename: rows[0].filename,
        categories: categories,
        diets: diets
    };

};

//Adds product to db
const addProduct = async (product) => {
    const {name, description, price, filename,
        categories=[], diets=[]} = product;
    const connection = await promisePool.getConnection();
    try {
        await connection.beginTransaction();

        // Insert a new product into the products table
        const [productResult] = await connection.execute(`
        
        INSERT INTO products
        (name, description, price, filename)
        VALUES (?, ?, ?, ?)`,
        [name,  description,  price, filename]
        );

        const productId = productResult.insertId;

        //Insert categories into a product_categories table
        for (const categoryId of categories) {
            await connection.execute(`
        INSERT INTO product_categories
        (product_id, category_id)
        VALUES (?, ?)`,
        [productId, categoryId]);
        }

        //Insert diets into a product_diets table
        for (const dietId of diets) {
            await  connection.execute(`
        INSERT  INTO product_diets
        (product_id, diet_id)
        VALUES  (?,?)`,
        [productId, dietId]);
        }

        await connection.commit();

        return {success: true, productId};
    } catch (error) {
        await connection.rollback();
        console.error('Error adding product:', error);
        return {false: false, error};
    } finally {
        connection.release();
    }
};

const modifyProduct = async  (product, id) => {
    const {name, description, price, filename,
        categories=[], diets=[]} = product;
    const connection = await promisePool.getConnection();
    try {
        await connection.beginTransaction();

        await connection.execute(`
            UPDATE products
            SET name = ?,  description = ?, price = ?,  filename = ?
            WHERE id = ?`,
            [name,  description,  price, filename, id]
        );

        await connection.execute(`
            DELETE FROM product_categories 
            WHERE product_id = ?`,
            [id]
        );

        await connection.execute(`
            DELETE FROM product_diets 
            WHERE product_id = ?`,
            [id]
        );

        for (const categoryId of categories) {
        await connection.execute(`
            INSERT INTO product_categories 
            (product_id, category_id)
            VALUES (?,?)`,
            [id, categoryId]
        );
        }

        for (const dietId of diets) {
            await connection.execute(`
            INSERT INTO product_diets 
            (product_id, diet_id)
            VALUES (?,?)`,
                [id, dietId]
            );
        }

        await connection.commit();

        const [updatedProduct] = await connection.query(`
            SELECT * FROM products 
            WHERE id = ?`,
            [id]
        );

        if (updatedProduct[0].affectedRows === 0) {
            return false;
        }
        return updatedProduct[0];
    } catch (error) {
        await connection.rollback();
        console.error("Error modifying product:", error);
        return { false: false, error: error.message };
    } finally {
        connection.release();

    }
};

// Removing product and its relations to product_category & product_diet tables
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

export {listAllProductsByCategory, addProduct, modifyProduct, findProductById, removeProduct}