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
import { ASSIGNEES, PROJECTS } from "../../enum/TaskStatus";

export const AssigneeProjectFields: React.FC = () => {
  const { control } = useFormContext<TaskFormData>();

  return (
    <Stack direction="row" spacing={2}>
      {/* Assignee */}
      <Controller
        control={control}
        name="assignee"
        render={({ field: { ref: _, ...field }, fieldState: { error } }) => (
          <FormControl fullWidth error={Boolean(error)}>
            <InputLabel>Assignee</InputLabel>
            <Select {...field} label="Assignee">
              {ASSIGNEES.map((assignee) => (
                <MenuItem key={assignee} value={assignee}>
                  {assignee}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        )}
      />

      {/* Project */}
      <Controller
        control={control}
        name="projectId"
        render={({ field: { ref: _, ...field }, fieldState: { error } }) => (
          <FormControl fullWidth error={Boolean(error)}>
            <InputLabel>Project</InputLabel>
            <Select {...field} label="Project">
              {PROJECTS.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
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
