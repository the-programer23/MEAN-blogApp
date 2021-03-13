const express = require("express");
const protect = require("../middleware/check-auth")
const multer = require("../middleware/multer")
const PostController = require("../controllers/posts")

const router = express.Router();


router.post("", protect, multer, PostController.createPost);

router.get("", PostController.getPosts);

router.get("/:id", PostController.getPost);

router.put("/:id", protect, multer, PostController.updatePost);

router.delete("/:id", protect, PostController.deletePost);

module.exports = router;
