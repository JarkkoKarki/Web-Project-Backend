import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sharp from "sharp";
import multer from "multer";
import fs from "fs";
dotenv.config();

/**
 * Middleware for file uploads using Multer.
 * Validates that only JPEG and PNG files are uploaded and limits file size to 10 MB.
 */

export const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Only .jpeg and .png files are allowed"), false);
    }
  },
});

/**
 * Middleware for handling multiple file uploads, specifically for profile pictures and other files.
 * Allows maximum 1 profile picture and 1 file.
 */

export const uploadFields = upload.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "file", maxCount: 1 },
]);

/**
 * Creates a thumbnail (100x100) of the uploaded image and deletes the original file.
 * Updates the `req.file` object with the new thumbnail path.
 *
 * @param {Object} req - The request object containing the uploaded file.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */

export const createThumbnail = async (req, res, next) => {
  try {
    if (!req.file) {
      console.log("No file uploaded, skipping thumbnail creation.");
      return next();
    }

    if (
      req.file.mimetype !== "image/jpeg" &&
      req.file.mimetype !== "image/png"
    ) {
      const error = new Error("Unsupported file format");
      error.status = 400;
      return next(error);
    }

    console.log("Uploaded file details:", req.file);

    let extension = "jpg";
    if (req.file.mimetype === "image/png") {
      extension = "png";
    }

    const thumbnailPath = `${req.file.path}_thumb.${extension}`;
    await sharp(req.file.path).resize(100, 100).toFile(thumbnailPath);

    console.log("Thumbnail created at:", thumbnailPath);

    // poistetaan vanha kuva
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting original file:", err);
      } else {
        console.log("Original file deleted:", req.file.path);
      }
    });

    req.file.thumbnailPath = thumbnailPath;
    // päivitetään tiedostosijainti
    req.file.path = thumbnailPath;
    next();
  } catch (error) {
    console.error("Error in createThumbnail:", error);
    next(error);
  }
};

/**
 * Creates a larger menu thumbnail (400x400) of the uploaded image and deletes the original file.
 * Updates the `req.file` object with the new thumbnail path.
 *
 * @param {Object} req - The request object containing the uploaded file.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */

export const createMenuThumbnail = async (req, res, next) => {
  try {
    if (!req.file) {
      console.log("No file uploaded, skipping thumbnail creation.");
      return next();
    }

    if (
      req.file.mimetype !== "image/jpeg" &&
      req.file.mimetype !== "image/png"
    ) {
      const error = new Error("Unsupported file format");
      error.status = 400;
      return next(error);
    }

    console.log("Uploaded file details:", req.file);

    let extension = "jpg";
    if (req.file.mimetype === "image/png") {
      extension = "png";
    }

    const thumbnailPath = `${req.file.path}_thumb.${extension}`;

    await sharp(req.file.path).resize(400, 400).toFile(thumbnailPath);

    console.log("Menu thumbnail created at:", thumbnailPath);

    // poistetaan vanha kuva
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting original file:", err);
      } else {
        console.log("Original file deleted:", req.file.path);
      }
    });

    req.file.thumbnailPath = thumbnailPath;
    // päivitetään tiedostosijainti
    req.file.path = thumbnailPath;
    next();
  } catch (error) {
    console.error("Error in createMenuThumbnail:", error);
    next(error);
  }
};

/**
 * Middleware to authenticate the user's token.
 * Verifies JWT token from the Authorization header.
 *
 * @param {Object} req - The request object containing the Authorization header.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {Error} - Throws error if the token is invalid or missing.
 */

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Authorization Header:", authHeader);
  console.log("Token:", token);

  if (!token) {
    const error = new Error("Unauthorized: No token provided");
    error.status = 401;
    console.log(" authenticatokenia kutsuttu", error);
    return next(error);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("JWT Verification Error:", err);
      const error = new Error("Forbidden: Invalid token");
      error.status = 403;
      return next(error);
    }

    res.locals.user = user;
    console.log("Decoded User:", user);
    next();
  });
};

/**
 * Middleware to check if the logged-in user is authorized to access a resource.
 * Verifies if the user ID in the request matches the logged-in user's ID or if the user is an admin.
 *
 * @param {Object} req - The request object containing the user ID to check.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {Error} - Throws an error if the user is not authorized.
 */

export const checkUserOwnership = (req, res, next) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const loggedInUserId = res.locals.user?.user_id;
    const { role } = res.locals.user || {};

    if (!loggedInUserId) {
      const error = new Error("User not authenticated");
      error.status = 401;
      return next(error);
    }

    if (userId !== loggedInUserId && role !== "admin") {
      const error = new Error("You are not authorized to access this resource");
      error.status = 403;
      return next(error);
    }

    next();
  } catch (error) {
    console.error("Error in checkUserOwnership:", error);
    next(error);
  }
};

/**
 * Middleware to check if the logged-in user has an admin role.
 * Verifies the user's role from the JWT token.
 *
 * @param {Object} req - The request object containing the Authorization header.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {Error} - Throws an error if the user is not an admin or if the token is invalid.
 */

export const checkAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    next();
  } catch (error) {
    console.error("Error in checkAdmin middleware:", error);
    res.status(403).json({ error: "Forbidden: Invalid token" });
  }
};

/**
 * Middleware for handling 404 errors when a route is not found.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */

export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

/**
 * Global error handler middleware for handling errors.
 *
 * @param {Object} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */

export const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
};
