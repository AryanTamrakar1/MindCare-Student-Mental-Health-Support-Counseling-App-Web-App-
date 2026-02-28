const Resource = require("../models/Resource");
const { awardPoints } = require("./gamificationController");

const addResource = async (req, res) => {
  try {
    const {
      title,
      link,
      type,
      category,
      estimatedTime,
      description,
      isPriority,
    } = req.body;

    const newResource = new Resource({
      title,
      link,
      type,
      category,
      estimatedTime,
      description,
      isPriority: isPriority || false,
    });

    await newResource.save();

    res
      .status(201)
      .json({ message: "Resource added successfully", resource: newResource });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add resource", error: error.message });
  }
};

const editResource = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      link,
      type,
      category,
      estimatedTime,
      description,
      isPriority,
    } = req.body;

    const updated = await Resource.findByIdAndUpdate(
      id,
      { title, link, type, category, estimatedTime, description, isPriority },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res
      .status(200)
      .json({ message: "Resource updated successfully", resource: updated });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update resource", error: error.message });
  }
};

const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Resource.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete resource", error: error.message });
  }
};

const getAllResources = async (req, res) => {
  try {
    const { category, type } = req.query;
    let filter = {};
    if (category) filter.category = category;
    if (type) filter.type = type;

    const resources = await Resource.find(filter).sort({ createdAt: -1 });
    const result = [];

    for (let i = 0; i < resources.length; i++) {
      const resource = resources[i];
      let helpfulCount = 0;
      let notHelpfulCount = 0;

      for (let j = 0; j < resource.reactions.length; j++) {
        if (resource.reactions[j].reaction === "helpful") {
          helpfulCount = helpfulCount + 1;
        } else {
          notHelpfulCount = notHelpfulCount + 1;
        }
      }

      const resourceData = {
        _id: resource._id,
        title: resource.title,
        link: resource.link,
        type: resource.type,
        category: resource.category,
        estimatedTime: resource.estimatedTime,
        description: resource.description,
        isPriority: resource.isPriority,
        helpfulCount: helpfulCount,
        notHelpfulCount: notHelpfulCount,
        bookmarkCount: resource.bookmarks.length,
        reactions: resource.reactions,
        bookmarks: resource.bookmarks,
        createdAt: resource.createdAt,
      };

      result.push(resourceData);
    }

    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch resources", error: error.message });
  }
};

const reactToResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { reaction } = req.body;
    const studentId = req.user._id;

    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    let existingIndex = -1;

    for (let i = 0; i < resource.reactions.length; i++) {
      if (resource.reactions[i].studentId.toString() === studentId.toString()) {
        existingIndex = i;
        break;
      }
    }

    if (existingIndex !== -1) {
      const existingReaction = resource.reactions[existingIndex].reaction;

      if (existingReaction === reaction) {
        const newReactions = [];
        for (let i = 0; i < resource.reactions.length; i++) {
          if (i !== existingIndex) {
            newReactions.push(resource.reactions[i]);
          }
        }
        resource.reactions = newReactions;
      } else {
        resource.reactions[existingIndex].reaction = reaction;
      }
    } else {
      resource.reactions.push({ studentId: studentId, reaction: reaction });
    }

    await resource.save();
    res
      .status(200)
      .json({ message: "Reaction updated", reactions: resource.reactions });
  } catch (error) {
    res.status(500).json({ message: "Failed to react", error: error.message });
  }
};

const toggleBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user._id;

    const resource = await Resource.findById(id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    let alreadyBookmarked = false;

    for (let i = 0; i < resource.bookmarks.length; i++) {
      if (resource.bookmarks[i].toString() === studentId.toString()) {
        alreadyBookmarked = true;
        break;
      }
    }

    if (alreadyBookmarked === true) {
      const newBookmarks = [];
      for (let i = 0; i < resource.bookmarks.length; i++) {
        if (resource.bookmarks[i].toString() !== studentId.toString()) {
          newBookmarks.push(resource.bookmarks[i]);
        }
      }
      resource.bookmarks = newBookmarks;
    } else {
      resource.bookmarks.push(studentId);
      await awardPoints(studentId.toString(), "resource");
      const allResources = await Resource.find();
      let bookmarkedCount = 0;
      for (let i = 0; i < allResources.length; i++) {
        for (let j = 0; j < allResources[i].bookmarks.length; j++) {
          if (
            allResources[i].bookmarks[j].toString() === studentId.toString()
          ) {
            bookmarkedCount = bookmarkedCount + 1;
            break;
          }
        }
      }

      if (bookmarkedCount === 5) {
        await awardPoints(studentId.toString(), "resource_5");
      }
    }

    await resource.save();
    res
      .status(200)
      .json({ message: "Bookmark updated", bookmarks: resource.bookmarks });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to bookmark", error: error.message });
  }
};

const getBookmarkedResources = async (req, res) => {
  try {
    const studentId = req.user._id;
    const allResources = await Resource.find().sort({ createdAt: -1 });

    const bookmarked = [];

    for (let i = 0; i < allResources.length; i++) {
      const resource = allResources[i];

      for (let j = 0; j < resource.bookmarks.length; j++) {
        if (resource.bookmarks[j].toString() === studentId.toString()) {
          bookmarked.push(resource);
          break;
        }
      }
    }

    res.status(200).json(bookmarked);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch bookmarks", error: error.message });
  }
};

module.exports = {
  addResource,
  editResource,
  deleteResource,
  getAllResources,
  reactToResource,
  toggleBookmark,
  getBookmarkedResources,
};
