import { create } from "zustand";

interface VerifyPhoneModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useVerifyPhoneModal = create<VerifyPhoneModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useVerifyPhoneModal;
