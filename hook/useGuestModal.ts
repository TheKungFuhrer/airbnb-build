import { create } from "zustand";

interface GuestModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useGuestModal = create<GuestModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useGuestModal;
