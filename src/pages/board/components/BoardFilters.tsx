import React from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Box,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { PRIORITY_OPTIONS } from "../constants/boardConstants";
import styles from "./BoardFilters.style";

type BoardFiltersProps = {
  searchQuery: string;
  filterPriority: string;
  onSearchChange: (query: string) => void;
  onPriorityChange: (priority: string) => void;
};

export const BoardFilters: React.FC<BoardFiltersProps> = ({
  searchQuery,
  filterPriority,
  onSearchChange,
  onPriorityChange,
}) => {
  return (
    <Box sx={styles.container}>
      <TextField
        size="small"
        placeholder="Search tasks…"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          },
        }}
        sx={styles.searchField}
      />

      <FormControl size="small" sx={styles.prioritySelect}>
        <InputLabel>Priority</InputLabel>
        <Select
          value={filterPriority}
          label="Priority"
          onChange={(e) => onPriorityChange(e.target.value)}
        >
          {PRIORITY_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
