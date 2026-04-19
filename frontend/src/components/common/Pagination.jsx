import {
  Pagination as MuiPagination,
  Stack,
  Typography,
} from "@mui/material";

const Pagination = ({ page, totalPages, total, limit, onChange }) => {
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      mt={2}
      px={1}
      flexWrap="wrap"
      gap={1}
    >
      <Typography variant="body2" color="text.secondary">
        {total > 0 ? `Showing ${from}–${to} of ${total} results` : "No results"}
      </Typography>
      <MuiPagination
        count={totalPages}
        page={page}
        onChange={(_, p) => onChange(p)}
        color="primary"
        shape="rounded"
        size="small"
      />
    </Stack>
  );
};

export default Pagination;
