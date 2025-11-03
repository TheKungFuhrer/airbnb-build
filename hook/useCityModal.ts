import { create } from "zustand";

interface CityModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useCityModal = create<CityModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useCityModal;
