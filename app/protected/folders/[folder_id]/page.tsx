import FolderComponent from "@/components/folder/folder";
import { fetchFolder } from "@/utils/folders/actions/fetch-folder";

export default async function FolderPage({
  params,
}: {
  params: { folder_id: string };
}) {
  const { folder_id } = await params;
  const { success, content } = await fetchFolder(folder_id);
  return <FolderComponent props={content} />;
}
