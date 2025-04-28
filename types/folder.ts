export interface Folder {
  id: string;
}

export interface FolderInFolder {
  folder_id: string;
  folders: Folder;
  folder_name: string;
}
