import type { SxProps } from "@mui/material";

const container: SxProps = {
  display: "flex",
  gap: 2,
  flexWrap: "wrap",
};

const searchField: SxProps = {
  minWidth: 200,
};

const prioritySelect: SxProps = {
  minWidth: 150,
};

export default {
  container,
  searchField,
  prioritySelect,
};
