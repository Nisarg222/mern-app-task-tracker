import { TextField } from "@mui/material";

/**
 * Wraps MUI TextField. Pass a `formik` instance + `name` for auto-wiring,
 * or omit `formik` and pass standard TextField props manually.
 */
const InputBox = ({ label, name, formik, type = "text", ...props }) => {
  if (formik) {
    return (
      <TextField
        fullWidth
        size="small"
        label={label}
        name={name}
        type={type}
        value={formik.values[name] ?? ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched[name] && Boolean(formik.errors[name])}
        helperText={formik.touched[name] && formik.errors[name]}
        {...props}
      />
    );
  }
  return (
    <TextField
      fullWidth
      size="small"
      label={label}
      name={name}
      type={type}
      {...props}
    />
  );
};

export default InputBox;
