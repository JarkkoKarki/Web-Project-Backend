import promisePool from "../../utils/database.js";

//Get all products listed by categories
const listAllProductsBothLanguages = async () => {
  const [rows] = await promisePool.query(`

        SELECT p.*,
               d.id AS d_id,
               d.name AS d_name,
               c.id AS c_id,
               c.category AS c_name
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
    if (row.c_id && !existingProduct.categories.some(c => c.id === row.c_id)) {
      existingProduct.categories.push({
        id: row.c_id,
        name: row.c_name
      });
    }

    // Add diet to the product if it doesn't already exist
    if (row.d_id && !existingProduct.diets.some(d => d.id === row.d_id)) {
      existingProduct.diets.push({
        id: row.d_id,
        name: row.d_name
      });
    }
  });
  return products;
};

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
