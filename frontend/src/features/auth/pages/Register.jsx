import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Box, Card, CardContent, Typography, Alert, Divider } from "@mui/material";
import { toast } from "react-toastify";
import { registerUser, clearError } from "../authSlice";
import InputBox from "../../../components/common/InputBox";
import CustomButton from "../../../components/common/CustomButton";

const schema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token) navigate("/tasks", { replace: true });
    return () => dispatch(clearError());
  }, [token, navigate, dispatch]);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        await dispatch(registerUser(values)).unwrap();
        toast.success("Account created! Welcome aboard.");
      } catch (err) {
        toast.error(err || "Registration failed");
      }
    },
  });

  return (
    <Box className="flex items-center justify-center min-h-[80vh]">
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} mb={0.5} textAlign="center">
            Create account
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            Start managing your tasks today
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
            <InputBox label="Full name" name="name" formik={formik} />
            <InputBox label="Email address" name="email" type="email" formik={formik} />
            <InputBox label="Password" name="password" type="password" formik={formik} />

            <CustomButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              loading={loading}
              size="medium"
              sx={{ mt: 1, py: 1.2 }}
            >
              Create Account
            </CustomButton>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" textAlign="center" color="text.secondary">
            Already have an account?{" "}
            <Typography
              component={Link}
              to="/login"
              variant="body2"
              color="primary.main"
              sx={{ fontWeight: 600, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
            >
              Sign In
            </Typography>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
