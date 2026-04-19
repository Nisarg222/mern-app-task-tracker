const Task = require("../models/task.model.js");

module.exports.createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body; // Remove userId from here
    const { id: userId } = req.user; // Get userId from authenticated user (rename to id if needed)

    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      owner: userId, // Add this to store the user ID in the database
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.getTasks = async (req, res) => {
  try {
    const { id: userId } = req.user; // Get userId from authenticated user
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter query
    let filter = { owner: userId };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort query
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Pagination
    const skip = (page - 1) * limit;
    const tasks = await Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(filter);

    res.status(200).json({
      tasks,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.getTaskById = async (req, res) => {
  try {
    const { id: userId } = req.user; // Get userId from authenticated user
    const task = await Task.findOne({ _id: req.params.id, owner: userId }); // Ensure task belongs to user
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.updateTask = async (req, res) => {
  try {
    const { id: userId } = req.user; // Get userId from authenticated user
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: userId }, // Ensure task belongs to user
      req.body,
      { new: true }, // Return the updated task
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.deleteTask = async (req, res) => {
  try {
    const { id: userId } = req.user; // Get userId from authenticated user
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: userId,
    }); // Ensure task belongs to user
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
