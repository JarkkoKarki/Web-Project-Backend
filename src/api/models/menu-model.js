import promisePool from "../../utils/database.js";

/**
 * Retrieves all products listed by categories and diets in both languages (English and Finnish).
 * This function also merges the categories and diets into the product object.
 *
 * @returns {Array|false} - An array of products, each including categories and diets, or `false` if no products are found.
 */

//Get all products listed by categories
const listAllProductsBothLanguages = async () => {
  const [rows] = await promisePool.query(`

        SELECT p.*,
               p.*,
               d.id AS d_id,
               d.diet AS d_diet,
               c.id AS c_id,
               c.category AS c_category
        FROM products p
                 LEFT JOIN product_categories pc ON p.id = pc.product_id
                 LEFT JOIN categories c ON pc.category_id = c.id
                 LEFT JOIN product_diets pd ON p.id = pd.product_id
                 LEFT JOIN diets d ON pd.diet_id = d.id
    `);
  // console.log("row", rows);
  if (rows.length === 0) {
    return false;
  }

  const products = [];

  rows.forEach((row) => {
    // Find if product already exists in the list
    let existingProduct = products.find((p) => p.id === row.id);

    // If the product doesn't exist, create a new product object
    if (!existingProduct) {
      existingProduct = {
        id: row.id,
        name_fi: row.name_fi,
        name_en: row.name_en,
        desc_fi: row.desc_fi,
        desc_en: row.desc_en,
        price: row.price,
        filename: row.filename,
        categories: [],
        diets: [],
      };
      products.push(existingProduct);
    }

    // Add category to the product if it doesn't already exist
    if (
      row.c_id &&
      !existingProduct.categories.some((c) => c.id === row.c_id)
    ) {
      existingProduct.categories.push({
        id: row.c_id,
        name: row.c_category,
      });
    }

    // Add diet to the product if it doesn't already exist
    if (row.d_id && !existingProduct.diets.some((d) => d.id === row.d_id)) {
      existingProduct.diets.push({
        id: row.d_id,
        name: row.d_diet,
      });
    }
  });
  console.log(products);
  return products;
};

/**
 * Retrieves all products listed by categories and diets in a specified language (default is English).
 *
 * @param {string} lang - The language to fetch product names and descriptions in ('en' or 'fi').
 * @returns {Array|false} - An array of products, each including categories and diets, or `false` if no products are found.
 */

//Get all products listed by categories
const listAllProducts = async (lang = "en") => {
  const [rows] = await promisePool.query(`

        SELECT p.*, d.diet, c.category
        FROM products p
                 LEFT JOIN product_categories pc ON p.id = pc.product_id
                 LEFT JOIN categories c ON pc.category_id = c.id
                 LEFT JOIN product_diets pd ON p.id = pd.product_id
                 LEFT JOIN diets d ON pd.diet_id = d.id
    `);
  // console.log("row", rows);
  if (rows.length === 0) {
    return false;
  }

  const products = [];

  rows.forEach((row) => {
    // Find if product already exists in the list
    let existingProduct = products.find((p) => p.id === row.id);

    // If the product doesn't exist, create a new product object
    if (!existingProduct) {
      existingProduct = {
        id: row.id,
        name: lang === "fi" ? row.name_fi : row.name_en,
        description: lang === "fi" ? row.desc_fi : row.desc_en,
        price: row.price,
        filename: row.filename,
        categories: [],
        diets: [],
      };
      products.push(existingProduct);
    }

    // Add category to the product if it doesn't already exist
    if (row.category && !existingProduct.categories.includes(row.category)) {
      existingProduct.categories.push(row.category);
    }

    // Add diet to the product if it doesn't already exist
    if (row.diet && !existingProduct.diets.includes(row.diet)) {
      existingProduct.diets.push(row.diet);
    }
  });
  return products;
};

/**
 * Finds a product by its ID, along with its associated categories and diets.
 *
 * @param {number} id - The ID of the product to fetch.
 * @returns {Object|false} - The product object with its categories and diets, or `false` if no product is found.
 */

//Finding product by id and its categories and diets
const findProductById = async (id) => {
  const [rows] = await promisePool.query(
    `

        SELECT p.*, d.diet, c.category
        FROM products p
        LEFT JOIN product_categories pc ON p.id = pc.product_id
        LEFT JOIN categories c ON pc.category_id = c.id
        LEFT JOIN product_diets pd ON p.id = pd.product_id
        LEFT JOIN diets d ON pd.diet_id = d.id
        WHERE p.id = ?`,
    [id]
  );
  // console.log("row", rows);
  if (rows.length === 0) {
    return false;
  }
  const categories = [];
  const diets = [];

  //Adding multiple diets and category to a product
  rows.forEach((row) => {
    if (row.category && !categories.includes(row.category)) {
      categories.push(row.category);
    }
    if (row.diet && !diets.includes(row.diet)) {
      diets.push(row.diet);
    }
  });
  return {
    id: rows[0].id,
    name_fi: rows[0].name_fi,
    name_en: rows[0].name_en,
    desc_fi: rows[0].desc_fi,
    desc_en: rows[0].desc_en,
    price: rows[0].price,
    filename: rows[0].filename,
    categories: categories,
    diets: diets,
  };
};

/**
 * Adds a new product to the database along with its categories and diets.
 *
 * @param {Object} product - The product object to add, including name, description, price, etc.
 * @returns {Object} - An object containing the success status and the inserted product's ID.
 * @throws {Error} - Throws an error if any part of the insertion fails.
 */

//Adds product to db
const addProduct = async (product) => {
  const {
    name_fi,
    name_en,
    desc_fi,
    desc_en,
    price,
    filename,
    categories = [],
    diets = [],
  } = product;
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    // Insert a new product into the products table
    const [productResult] = await connection.execute(
      `
        
        INSERT INTO products
        (name_fi,name_en, desc_fi, desc_en, price, filename)
        VALUES (?, ?, ?, ?,?,?)`,
      [name_fi, name_en, desc_fi, desc_en, price, filename]
    );

    const productId = productResult.insertId;

    //Insert categories into a product_categories table
    for (const categoryId of categories) {
      await connection.execute(
        `
        INSERT INTO product_categories
        (product_id, category_id)
        VALUES (?, ?)`,
        [productId, categoryId]
      );
    }

    //Insert diets into a product_diets table
    for (const dietId of diets) {
      await connection.execute(
        `
        INSERT  INTO product_diets
        (product_id, diet_id)
        VALUES  (?,?)`,
        [productId, dietId]
      );
    }

    await connection.commit();

    return { success: true, productId };
  } catch (error) {
    await connection.rollback();
    console.error("Error Adding product:", error);
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Modifies an existing product by its ID, updating its details and associated categories/diets.
 *
 * @param {Object} product - The product object containing the fields to update.
 * @param {number} id - The ID of the product to modify.
 * @returns {Object|false} - The updated product if successful, or `false` if no product was modified.
 * @throws {Error} - Throws an error if the product is not found or modification fails.
 */

const modifyProduct = async (product, id) => {
  const {
    name_fi,
    name_en,
    desc_fi,
    desc_en,
    price,
    filename,
    categories = [],
    diets = [],
  } = product;
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    const [productRows] = await connection.execute(
      `
        SELECT * FROM products 
        WHERE id = ?`,
      [id]
    );

    if (productRows.affectedRows === 0) {
      throw new Error("Product not found");
    }

    const original = productRows[0];

    // Check if the values are empty. If empty replace them with the old product values
    const updatedNameFi = name_fi || original.name_fi;
    const updatedNameEn = name_en || original.name_en;
    const updatedDescFi = desc_fi || original.desc_fi;
    const updatedDescEn = desc_en || original.desc_en;
    const updatedPrice = price || original.price;
    const updatedFilename = filename || original.filename;

    await connection.execute(
      `
            UPDATE products
            SET name_fi = ?, name_en = ?, desc_fi = ?, desc_en = ?,price = ?,  filename = ?
            WHERE id = ?`,
      [
        updatedNameFi,
        updatedNameEn,
        updatedDescFi,
        updatedDescEn,
        updatedPrice,
        updatedFilename,
        id,
      ]
    );

    await connection.execute(
      `
            DELETE FROM product_categories 
            WHERE product_id = ?`,
      [id]
    );

    await connection.execute(
      `
            DELETE FROM product_diets 
            WHERE product_id = ?`,
      [id]
    );

    for (const categoryId of categories) {
      await connection.execute(
        `
            INSERT INTO product_categories 
            (product_id, category_id)
            VALUES (?,?)`,
        [id, categoryId]
      );
    }

    for (const dietId of diets) {
      await connection.execute(
        `
            INSERT INTO product_diets 
            (product_id, diet_id)
            VALUES (?,?)`,
        [id, dietId]
      );
    }

    await connection.commit();

    const [updatedProduct] = await connection.query(
      `
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
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Removes a product and its associated categories and diets from the database.
 *
 * @param {number} id - The ID of the product to remove.
 * @returns {boolean} - `true` if the product was successfully removed, or `false` if no product was deleted.
 * @throws {Error} - Throws an error if the removal process fails.
 */

// Removing product and its relations to product_category & product_diet tables
const removeProduct = async (id) => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.execute(
      `
                    DELETE
                    FROM product_diets
                    WHERE product_id = ?`,
      [id]
    );
    await connection.execute(
      `
                    DELETE
                    FROM product_categories
                    WHERE product_id = ?`,
      [id]
    );
    const [rows] = await connection.execute(
      `
                    DELETE
                    FROM products
                    WHERE id = ?`,
      [id]
    );
    console.log("rows", rows);
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

export {
  listAllProductsBothLanguages,
  listAllProducts,
  addProduct,
  modifyProduct,
  findProductById,
  removeProduct,
};
