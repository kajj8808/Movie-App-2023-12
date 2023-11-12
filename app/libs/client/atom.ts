import { atom } from "recoil";

interface IState {
  id: string;
  isUploading: boolean;
}

export interface IUploadState {
  video: IState;
  smi: IState;
}
export const uploadState = atom<IUploadState>({
  key: "uploadState",
  default: {
    video: { id: "", isUploading: false },
    smi: { id: "", isUploading: false },
  },
});
