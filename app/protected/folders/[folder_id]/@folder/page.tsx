import { fetchFolder } from "@/app/actions";
import FolderComponent from "@/components/folder";

export default async function FolderPage({
  params,
}: {
  params: { folder_id: string };
}) {
  const { folder_id } = await params;
  const { success, content } = await fetchFolder(folder_id);
  return <FolderComponent props={content} />;
}
