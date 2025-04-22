import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sharp from "sharp";
import multer from "multer";
dotenv.config();

export const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // Max file size: 10 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      const error = new Error("Only image files are allowed!");
      error.status = 400;
      cb(error, false);
    }
  },
});

export const uploadFields = upload.fields([
  { name: "profilePicture", maxCount: 1 },
]);

export const createThumbnail = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("No file uploaded");
      error.status = 400;
      return next(error);
    }

    console.log("Uploaded file path:", req.file.path);

    let extension = "jpg";
    if (req.file.mimetype === "image/png") {
      extension = "png";
    }

    const thumbnailPath = `${req.file.path}_thumb.${extension}`;
    await sharp(req.file.path).resize(100, 100).toFile(thumbnailPath);

    console.log("Thumbnail created at:", thumbnailPath);

    req.file.thumbnailPath = thumbnailPath;
    next();
  } catch (error) {
    console.error("Error in createThumbnail:", error);
    next(error);
  }
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Authorization Header:", authHeader);
  console.log("Token:", token);

  if (!token) {
    const error = new Error("Unauthorized: No token provided");
    error.status = 401;
    return next(error);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      const error = new Error("Forbidden: Invalid token");
      error.status = 403;
      return next(error);
    }

    res.locals.user = user;
    console.log("Decoded User:", user);
    next();
  });
};

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

export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
};
