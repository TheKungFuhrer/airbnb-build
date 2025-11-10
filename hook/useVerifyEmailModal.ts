import { create } from "zustand";

interface VerifyEmailModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useVerifyEmailModal = create<VerifyEmailModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useVerifyEmailModal;
