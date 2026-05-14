import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import type { TaskFormData } from "../../schemas/taskFormSchema";

export const DescriptionField: React.FC = () => {
  const { control } = useFormContext<TaskFormData>();

  return (
    <Controller
      control={control}
      name="description"
      render={({ field: { ref: _, ...field }, fieldState: { error } }) => (
        <TextField
          {...field}
          label="Description"
          placeholder="Add more context…"
          fullWidth
          multiline
          rows={3}
          error={Boolean(error)}
          helperText={error?.message}
          slotProps={{ htmlInput: { maxLength: 500 } }}
        />
      )}
    />
  );
};
