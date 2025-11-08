
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const dataController = require('../controllers/dataController');

// Set up storage config for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // destination folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // unique file name
  }
});

const upload = multer({ storage });

// Routes
router.get('/', dataController.getAllData);
router.post('/', upload.single('image'), dataController.createData); // 👈 allows image upload

module.exports = router;
