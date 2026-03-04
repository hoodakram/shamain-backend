import express from "express";
import Product from "../models/product.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../cloudinary.js";

const router = express.Router();

// Cloudinary Storage Config
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    console.log("Uploading file:", file.originalname);
    cb(null, true);
  }
});

// CREATE PRODUCT
router.post("/", (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("Multer/Cloudinary upload error:", err.message);
      return res.status(400).json({ message: `Upload failed: ${err.message}` });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log("=== Product Creation Request ===");
    console.log("File:", req.file ? `${req.file.originalname} (${req.file.size} bytes, URL: ${req.file.path})` : "No file");
    console.log("Body:", JSON.stringify(req.body, null, 2));

    const { name, price, category, description, sizes } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    // Parse sizes correctly: client may send JSON string of array of objects
    let parsedSizes = [];
    if (sizes) {
      try {
        const raw = JSON.parse(sizes);
        // If items are strings, convert to object with stock 0
        parsedSizes = raw.map((item) => {
          if (typeof item === "string") {
            return { size: item, stock: 0 };
          }
          // assume already {size, stock}
          return item;
        });
      } catch (e) {
        console.warn("Failed to parse sizes, ignoring", e);
      }
    }

    const product = new Product({
      name,
      price,
      category,
      description,
      image: req.file.path, // ✅ Cloudinary URL
      sizes: parsedSizes,
    });

    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error("Product creation error:", error.message);
    console.error("Full error:", error);
    res.status(500).json({ message: error.message });
  }
});

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE PRODUCT
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;