import React, { useState } from "react";
import { Button } from "@/shared/components/Button";
import { TutorialModal } from "./TutorialModal";
import { useTutorialStore } from "@/infrastructure/store/tutorialStore";
import { useTranslations } from "@/shared/hooks/useTranslations";

export const TutorialButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { markTutorialAsSeen } = useTutorialStore();
  const { t } = useTranslations();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    markTutorialAsSeen();
  };

  return (
    <>
      <Button
        onClick={handleOpenModal}
        variant="glass"
        size="md"
        className="hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-900"
        icon="💡"
      >
        {t("features.tutorial.button")}
      </Button>

      <TutorialModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};
