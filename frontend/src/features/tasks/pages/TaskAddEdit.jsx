import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Alert,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "react-toastify";
import { addtask, updatetask, getTaskById, clearCurrentTask } from "../taskSlice";
import InputBox from "../../../components/common/InputBox";
import CustomButton from "../../../components/common/CustomButton";
import Spinner from "../../../components/common/Spinner";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const schema = Yup.object({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  status: Yup.string()
    .oneOf(["pending", "in-progress", "completed"])
    .required("Status is required"),
  dueDate: Yup.string().required("Due date is required"),
});

const toInputDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0];
};

const TaskAddEdit = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTask, loading, error } = useSelector((s) => s.tasks);

  useEffect(() => {
    if (isEdit) {
      dispatch(getTaskById(id));
    }
    return () => dispatch(clearCurrentTask());
  }, [id, isEdit, dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: isEdit && currentTask ? currentTask.title : "",
      description: isEdit && currentTask ? currentTask.description : "",
      status: isEdit && currentTask ? currentTask.status : "pending",
      dueDate: isEdit && currentTask ? toInputDate(currentTask.dueDate) : "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await dispatch(updatetask({ id, data: values })).unwrap();
          toast.success("Task updated successfully");
        } else {
          await dispatch(addtask(values)).unwrap();
          toast.success("Task created successfully");
        }
        navigate("/tasks");
      } catch (err) {
        toast.error(err || "Something went wrong");
      }
    },
  });

  // Show spinner while loading task for edit
  if (isEdit && loading && !currentTask) return <Spinner />;

  return (
    <Box>
      {/* Breadcrumb */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink
          component="button"
          underline="hover"
          color="text.secondary"
          variant="body2"
          onClick={() => navigate("/tasks")}
          sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer", border: "none", bgcolor: "transparent" }}
        >
          <ArrowBackIcon fontSize="inherit" /> Tasks
        </MuiLink>
        <Typography variant="body2" color="text.primary">
          {isEdit ? "Edit Task" : "New Task"}
        </Typography>
      </Breadcrumbs>

      <Card
        elevation={0}
        sx={{
          maxWidth: 600,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} mb={0.5}>
            {isEdit ? "Edit Task" : "Create New Task"}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            {isEdit ? "Update the task details below" : "Fill in the details for your new task"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-4"
          >
            <InputBox label="Title" name="title" formik={formik} />

            <InputBox
              label="Description"
              name="description"
              formik={formik}
              multiline
              rows={3}
              size="small"
            />

            {/* Status dropdown */}
            <FormControl
              size="small"
              fullWidth
              error={formik.touched.status && Boolean(formik.errors.status)}
            >
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.status && formik.errors.status && (
                <FormHelperText>{formik.errors.status}</FormHelperText>
              )}
            </FormControl>

            {/* Date picker */}
            <InputBox
              label="Due Date"
              name="dueDate"
              type="date"
              formik={formik}
              InputLabelProps={{ shrink: true }}
            />

            {/* Action buttons */}
            <Box className="flex gap-3 justify-end" mt={1}>
              <CustomButton
                variant="outlined"
                color="inherit"
                onClick={() => navigate("/tasks")}
                disabled={loading}
              >
                Cancel
              </CustomButton>
              <CustomButton
                type="submit"
                variant="contained"
                color="primary"
                loading={loading}
              >
                {isEdit ? "Save Changes" : "Create Task"}
              </CustomButton>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TaskAddEdit;
