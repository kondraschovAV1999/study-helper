import { StudyGenerator } from "@/components/study-guide/study-generator";
import { fetchUserFolders } from "@/utils/folders/actions/fetch-user-folders";

export default async function StudyGuidesPage() {
  const { content: folders } = await fetchUserFolders();
  return <StudyGenerator folders={folders} />;
}
