import { useEffect, useState } from "react";
import { useRice } from "./useRice";

interface UseGameRewardOptions {
  /** When true, opens the modal. */
  finished: boolean;
  /** Amount of RICE to award when user confirms. */
  riceAmount: number;
}

interface UseGameRewardResult {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  isSaving: boolean;
  save: () => Promise<void>;
}

/**
 * Generic helper to show a completion modal and award RICE upon confirmation.
 * Keeps a consistent pattern across mini-games.
 */
export function useGameReward(
  options: UseGameRewardOptions
): UseGameRewardResult {
  const { finished, riceAmount } = options;
  const [isOpen, setIsOpen] = useState(false);
  const { addRICE, isAdding } = useRice();

  useEffect(() => {
    if (finished && riceAmount > 0) setIsOpen(true);
  }, [finished, riceAmount]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const save = async () => {
    await addRICE(riceAmount);
    setIsOpen(false);
  };

  return {
    isOpen,
    open,
    close,
    isSaving: isAdding,
    save,
  };
}
