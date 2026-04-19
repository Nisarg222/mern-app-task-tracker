import { Box, Typography } from "@mui/material";

const Footer = () => (
  <Box
    component="footer"
    sx={{
      mt: "auto",
      py: 2,
      px: 3,
      borderTop: "1px solid",
      borderColor: "divider",
      textAlign: "center",
      bgcolor: "white",
    }}
  >
    <Typography variant="caption" color="text.secondary">
      © {new Date().getFullYear()} Task Tracker — Built with MERN Stack
    </Typography>
  </Box>
);

export default Footer;
