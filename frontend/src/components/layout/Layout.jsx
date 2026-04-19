import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = () => (
  <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    <Header />
    <Box component="main" sx={{ flex: 1, bgcolor: "#f8f9fb", p: { xs: 2, sm: 3 } }}>
      <Outlet />
    </Box>
    <Footer />
  </Box>
);

export default Layout;
