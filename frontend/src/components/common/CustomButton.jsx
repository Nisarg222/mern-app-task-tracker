import { Button, CircularProgress } from "@mui/material";

const CustomButton = ({ children, loading = false, startIcon, ...props }) => (
  <Button
    disabled={loading || props.disabled}
    startIcon={loading ? undefined : startIcon}
    {...props}
  >
    {loading ? <CircularProgress size={20} color="inherit" /> : children}
  </Button>
);

export default CustomButton;
