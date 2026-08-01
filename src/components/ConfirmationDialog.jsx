import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-md">
      <div className="py-2">
        <p className="text-slate-600 dark:text-slate-400">{message}</p>
        <div className="mt-8 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant={type} onClick={() => { onConfirm(); onClose(); }}>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
