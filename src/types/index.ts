export type SizeLimit = 3 | 5;

export interface BookMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  pageCount?: number;
}

export interface UploadStatus {
  isUploading: boolean;
  progress: number;
  error: string | null;
}
