import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  TextField,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import { fetchTasks, deletetask, updatetask } from "../taskSlice";
import Spinner from "../../../components/common/Spinner";
import Pagination from "../../../components/common/Pagination";
import CustomButton from "../../../components/common/CustomButton";
import useDebounce from "../../../hooks/useDebounce";

const STATUS_OPTIONS = ["pending", "in-progress", "completed"];

const STATUS_COLOR = {
  pending: "warning",
  "in-progress": "info",
  completed: "success",
};

const LIMIT = 10;

const TaskListing = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tasks, total, totalPages, currentPage, loading } = useSelector(
    (s) => s.tasks,
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    dispatch(fetchTasks({ page, limit: LIMIT, search: debouncedSearch }));
  }, [dispatch, page, debouncedSearch]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleStatusChange = async (task, newStatus) => {
    // Optimistic UI update and mongo and sql id handling
    try {
      await dispatch(
        updatetask({
          id: task._id || task.id,
          data: { ...task, status: newStatus },
        }),
      ).unwrap();
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteConfirm = async () => {
    const { id } = deleteDialog;
    setDeleteDialog({ open: false, id: null });
    try {
      await dispatch(deletetask(id)).unwrap();
      toast.success("Task deleted");
      // If last item on page > 1, go back
      if (tasks.length === 1 && page > 1) setPage((p) => p - 1);
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Box>
      {/* Header row */}
      <Box
        className="flex items-center justify-between mb-4"
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            My Tasks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and track your tasks
          </Typography>
        </Box>
        <CustomButton
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate("/task/add")}
        >
          Add Task
        </CustomButton>
      </Box>

      <Card
        elevation={0}
        sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3 }}
      >
        {/* Search bar */}
        <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
          <TextField
            size="small"
            placeholder="Search by title or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: { xs: "100%", sm: 320 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Table */}
        {loading ? (
          <Spinner />
        ) : tasks.length === 0 ? (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <Typography color="text.secondary">No tasks found.</Typography>
            {!search && (
              <CustomButton
                variant="text"
                color="primary"
                sx={{ mt: 1 }}
                onClick={() => navigate("/task/add")}
              >
                Add your first task
              </CustomButton>
            )}
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8f9fb" }}>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      fontSize: 12,
                      textTransform: "uppercase",
                    }}
                  >
                    #
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      fontSize: 12,
                      textTransform: "uppercase",
                    }}
                  >
                    Title
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      fontSize: 12,
                      textTransform: "uppercase",
                    }}
                  >
                    Description
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      fontSize: 12,
                      textTransform: "uppercase",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      fontSize: 12,
                      textTransform: "uppercase",
                    }}
                  >
                    Due Date
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      color: "text.secondary",
                      fontSize: 12,
                      textTransform: "uppercase",
                    }}
                    align="right"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task, idx) => (
                  <TableRow
                    key={task._id || task.id}
                    hover
                    sx={{ "&:last-child td": { border: 0 } }}
                  >
                    <TableCell sx={{ color: "text.secondary", fontSize: 13 }}>
                      {(page - 1) * LIMIT + idx + 1}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {task.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          maxWidth: 260,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {task.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task, e.target.value)
                        }
                        renderValue={(val) => (
                          <Chip
                            label={val}
                            size="small"
                            color={STATUS_COLOR[val] || "default"}
                            sx={{
                              textTransform: "capitalize",
                              fontSize: 11,
                              height: 22,
                            }}
                          />
                        )}
                        sx={{
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "none",
                          },
                          "& .MuiSelect-select": { p: 0 },
                        }}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <MenuItem
                            key={s}
                            value={s}
                            sx={{ textTransform: "capitalize" }}
                          >
                            <Chip
                              label={s}
                              size="small"
                              color={STATUS_COLOR[s] || "default"}
                              sx={{
                                textTransform: "capitalize",
                                fontSize: 11,
                                height: 22,
                              }}
                            />
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(task.dueDate)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            navigate(`/task/edit/${task._id || task.id}`)
                          }
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              id: task._id || task.id,
                            })
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination */}
        {!loading && tasks.length > 0 && (
          <Box sx={{ px: 2, pb: 2 }}>
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={LIMIT}
              onChange={setPage}
            />
          </Box>
        )}
      </Card>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle fontWeight={600}>Delete Task</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to delete this task? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setDeleteDialog({ open: false, id: null })}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskListing;
