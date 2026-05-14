import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField } from "@mui/material";
import type { TaskFormData } from "../../schemas/taskFormSchema";

export const TagsField: React.FC = () => {
  const { control } = useFormContext<TaskFormData>();

  return (
    <Controller
      control={control}
      name="tags"
      render={({ field: { ref: _, ...field }, fieldState: { error } }) => (
        <TextField
          {...field}
          label="Tags"
          placeholder="bug, feature, docs (comma-separated)"
          fullWidth
          error={Boolean(error)}
          helperText={error?.message || "Separate tags with commas"}
        />
      )}
    />
  );
};
