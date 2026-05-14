import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import type { TaskFormData } from "../../schemas/taskFormSchema";

export const TitleField: React.FC = () => {
  const { control } = useFormContext<TaskFormData>();

  return (
    <Controller
      control={control}
      name="title"
      render={({ field: { ref: _, ...field }, fieldState: { error } }) => (
        <TextField
          {...field}
          label="Title"
          placeholder="What needs to be done?"
          required
          fullWidth
          error={Boolean(error)}
          helperText={error?.message}
          slotProps={{ htmlInput: { maxLength: 120 } }}
        />
      )}
    />
  );
};
