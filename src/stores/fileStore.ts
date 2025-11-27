import create from 'zustand';

export interface UploadedFileMeta {
  name: string;
  path: string;
  size: number;
  type: string;
  file?: File;
}

interface FileState {
  skFile?: UploadedFileMeta;
  memoFile?: UploadedFileMeta;
  setSkFile: (payload: UploadedFileMeta | undefined) => void;
  clearSkFile: () => void;
  setMemoFile: (payload: UploadedFileMeta | undefined) => void;
  clearMemoFile: () => void;
}

export const useFileStore = create<FileState>((set) => ({
  skFile: undefined,
  memoFile: undefined,
  setSkFile: (payload) => set({ skFile: payload }),
  clearSkFile: () => set({ skFile: undefined }),
  setMemoFile: (payload) => set({ memoFile: payload }),
  clearMemoFile: () => set({ memoFile: undefined }),
}));

// convenience wrappers
export const setSkFile = (payload: UploadedFileMeta | undefined) =>
  useFileStore.getState().setSkFile(payload);

export const clearSkFile = () => useFileStore.getState().clearSkFile();

export const setMemoFile = (payload: UploadedFileMeta | undefined) =>
  useFileStore.getState().setMemoFile(payload);

export const clearMemoFile = () => useFileStore.getState().clearMemoFile();

export default useFileStore;
