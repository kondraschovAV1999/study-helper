import LeftSidebar from "@/components/left-sidebar/left-sidebar";
import { fetchUserFolders } from "@/utils/folders/actions/fetch-user-folders";
export default async function Page() {
  const { content: folders } = await fetchUserFolders();
  return <LeftSidebar initialFolders={folders} />;
}
