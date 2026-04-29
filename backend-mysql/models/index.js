const User = require("./user.model");
const Task = require("./task.model");

User.hasMany(Task, { foreignKey: "owner", as: "tasks" });
Task.belongsTo(User, { foreignKey: "owner", as: "user" });

module.exports = { User, Task };
