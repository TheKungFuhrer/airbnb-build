import { create } from "zustand";

interface PhoneInputModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const usePhoneInputModal = create<PhoneInputModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default usePhoneInputModal;
