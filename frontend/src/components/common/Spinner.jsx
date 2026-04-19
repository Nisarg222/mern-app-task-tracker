import { Box, CircularProgress } from "@mui/material";

const Spinner = ({ className = "" }) => (
  <Box
    className={`flex items-center justify-center ${className}`}
    sx={{ py: 6 }}
  >
    <CircularProgress color="primary" />
  </Box>
);

export default Spinner;
