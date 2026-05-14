import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import type { TaskFormData } from "../../schemas/taskFormSchema";

export const DueDateField: React.FC = () => {
  const { control } = useFormContext<TaskFormData>();

  return (
    <Controller
      control={control}
      name="dueDate"
      render={({ field: { ref: _, ...field }, fieldState: { error } }) => (
        <TextField
          {...field}
          label="Due Date"
          type="date"
          fullWidth
          error={Boolean(error)}
          helperText={error?.message}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />
      )}
    />
  );
};
