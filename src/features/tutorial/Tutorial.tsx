import React, { useEffect, useState } from "react";
import { TutorialModal } from "./TutorialModal";
import { useTutorialStore } from "@/infrastructure/store/tutorialStore";
import { useTutorialAutoShow } from "@/shared/hooks/useTutorialAutoShow";

export const Tutorial: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { markTutorialAsSeen } = useTutorialStore();
  const { shouldShowTutorial, closeTutorial } = useTutorialAutoShow();

  useEffect(() => {
    if (shouldShowTutorial) {
      handleOpenModal();
    }
  }, [shouldShowTutorial]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    markTutorialAsSeen(); // Mark tutorial as seen when closed
  };

  const handleAutoClose = () => {
    closeTutorial();
    markTutorialAsSeen(); // Mark tutorial as seen when closed
  };

  // Auto-show tutorial if user hasn't seen it
  const isModalVisible = isModalOpen || shouldShowTutorial;

  return (
    <TutorialModal
      isOpen={isModalVisible}
      onClose={shouldShowTutorial ? handleAutoClose : handleCloseModal}
    />
  );
};
