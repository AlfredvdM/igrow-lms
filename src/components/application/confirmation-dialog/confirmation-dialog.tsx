"use client";

import { Button } from "@/components/base/buttons/button";
import { DialogTrigger, ModalOverlay, Modal, Dialog } from "@/components/application/modals/modal";
import { AlertTriangle } from "lucide-react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isLoading = false,
}: ConfirmationDialogProps) {
  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalOverlay isDismissable>
        <Modal className="max-w-md">
          <Dialog>
            <div className="w-full rounded-xl bg-primary p-6 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-error-secondary">
                  <AlertTriangle className="size-6 text-fg-error-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-primary">{title}</h3>
                  <p className="mt-1 text-sm text-tertiary">{message}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  size="md"
                  color="secondary"
                  onClick={onClose}
                  isDisabled={isLoading}
                >
                  {cancelLabel}
                </Button>
                <Button
                  size="md"
                  color="primary-destructive"
                  onClick={onConfirm}
                  isDisabled={isLoading}
                >
                  {isLoading ? "Deleting..." : confirmLabel}
                </Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
