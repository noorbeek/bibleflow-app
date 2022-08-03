import create from 'zustand';

export const useDialogStore = create<any>((set, get) => ({
  isOpen: false,
  title: '',
  description: '',

  onConfirm: () => set(state => ({ isOpen: false })),
  onCancel: () => set(state => ({ isOpen: false })),

  configure: config => set(state => config),
}));
