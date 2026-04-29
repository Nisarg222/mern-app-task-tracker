const { Op } = require("sequelize");
const { Task } = require("../models/index");

const ALLOWED_SORT_FIELDS = ["createdAt", "updatedAt", "title", "status", "dueDate"];

module.exports.createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const { id: userId } = req.user;

    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      owner: userId,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.getTasks = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const safeSort = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : "createdAt";
    const safeOrder = sortOrder === "asc" ? "ASC" : "DESC";

    const where = { owner: userId };
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { rows: tasks, count: total } = await Task.findAndCountAll({
      where,
      order: [[safeSort, safeOrder]],
      offset,
      limit: parseInt(limit),
    });

    res.status(200).json({
      tasks,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.getTaskById = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const task = await Task.findOne({
      where: { id: req.params.id, owner: userId },
    });

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
    const { id: userId } = req.user;
    const { title, description, status, dueDate } = req.body;

    const task = await Task.findOne({
      where: { id: req.params.id, owner: userId },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.update({ title, description, status, dueDate });

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.deleteTask = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const task = await Task.findOne({
      where: { id: req.params.id, owner: userId },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.destroy();

    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
