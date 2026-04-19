import { AppBar, Toolbar, Typography, Box, Avatar, Chip } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import useAuth from "../../hooks/useAuth";
import CustomButton from "../common/CustomButton";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "white",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar className="flex justify-between">
        <Typography
          component={Link}
          to={isAuthenticated ? "/tasks" : "/login"}
          variant="h6"
          fontWeight={700}
          sx={{ textDecoration: "none", color: "primary.main", letterSpacing: -0.5 }}
        >
          ✓ Task Tracker
        </Typography>

        {isAuthenticated && (
          <Box className="flex items-center gap-3">
            <Chip
              avatar={
                <Avatar sx={{ bgcolor: "primary.main", width: 24, height: 24, fontSize: 12 }}>
                  {user?.name?.[0]?.toUpperCase()}
                </Avatar>
              }
              label={user?.name}
              variant="outlined"
              size="small"
              sx={{ borderColor: "divider" }}
            />
            <CustomButton
              variant="outlined"
              size="small"
              color="error"
              onClick={handleLogout}
            >
              Logout
            </CustomButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
