"use client";

import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface MiniGameRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => Promise<void> | void;
  isSaving?: boolean;
  title: string;
  subtitle?: string;
  emoji?: string;
  children?: React.ReactNode;
}

export const MiniGameRewardModal: React.FC<MiniGameRewardModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isSaving,
  title,
  subtitle,
  emoji = "🍚",
  children,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-4xl mb-2">{emoji}</div>
          {subtitle && <div className="text-lg font-semibold">{subtitle}</div>}
          {children && (
            <div className="text-sm text-muted-foreground mt-1">{children}</div>
          )}
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => onSave()} loading={!!isSaving}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

MiniGameRewardModal.displayName = "MiniGameRewardModal";
