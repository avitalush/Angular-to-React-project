import type { SxProps } from "@mui/material";

const paper: SxProps = {
  p: 3,
  mb: 3,
};

const container: SxProps = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 2,
};

const title: SxProps = {
  fontWeight: 700,
};

const actionsBox: SxProps = {
  display: "flex",
  gap: 2,
  flexWrap: "wrap",
};

export default {
  paper,
  container,
  title,
  actionsBox,
};
