import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Stack,
} from "@mui/material";
import type { TaskFormData } from "../../schemas/taskFormSchema";
import type { TaskPriority } from "../../enum/TaskStatus";
import { COLUMN_ORDER, COLUMN_LABELS } from "../../enum/TaskStatus";

const priorities: TaskPriority[] = ["low", "medium", "high", "critical"];

export const StatusPriorityFields: React.FC = () => {
  const { control } = useFormContext<TaskFormData>();

  return (
    <Stack direction="row" spacing={2}>
      {/* Status */}
      <Controller
        control={control}
        name="status"
        render={({ field: { ref: _, ...field }, fieldState: { error } }) => (
          <FormControl fullWidth error={Boolean(error)}>
            <InputLabel>Status</InputLabel>
            <Select {...field} label="Status">
              {COLUMN_ORDER.map((status) => (
                <MenuItem key={status} value={status}>
                  {COLUMN_LABELS[status]}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        )}
      />

      {/* Priority */}
      <Controller
        control={control}
        name="priority"
        render={({ field: { ref: _, ...field }, fieldState: { error } }) => (
          <FormControl fullWidth error={Boolean(error)}>
            <InputLabel>Priority</InputLabel>
            <Select {...field} label="Priority">
              {priorities.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        )}
      />
    </Stack>
  );
};
