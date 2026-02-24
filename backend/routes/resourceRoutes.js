const express = require("express");
const router = express.Router();
const {
  addResource,
  editResource,
  deleteResource,
  getAllResources,
  reactToResource,
  toggleBookmark,
  getBookmarkedResources,
} = require("../controllers/resourceController");

const { protect } = require("../controllers/authController");

function adminOnly(req, res, next) {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
}



router.get("/", protect, getAllResources);
router.get("/bookmarks", protect, getBookmarkedResources);

router.post("/", protect, adminOnly, addResource);
router.put("/:id", protect, adminOnly, editResource);

router.delete("/:id", protect, adminOnly, deleteResource);

router.post("/:id/react", protect, reactToResource);

router.post("/:id/bookmark", protect, toggleBookmark);

module.exports = router;