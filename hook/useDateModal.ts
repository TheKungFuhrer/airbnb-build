import { create } from "zustand";

interface DateModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useDateModal = create<DateModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useDateModal;
