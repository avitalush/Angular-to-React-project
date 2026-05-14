import type { FC, ReactNode } from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface WarningModalProps {
  open: boolean;
  title?: string;
  text: string;
  onClose: () => void;
  onConfirm?: () => void;
  icon?: ReactNode;
}

const WarningModal: FC<WarningModalProps> = ({
  open,
  title,
  text,
  onClose,
  onConfirm,
  icon,
}) => {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      {icon}

      {title && (
        <DialogTitle>
          {title}
        </DialogTitle>
      )}

      <DialogContent>
        <DialogContentText>
          {text}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          onClick={handleConfirm}
        >
          אישור
        </Button>

        <Button onClick={onClose}>
          ביטול
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarningModal;