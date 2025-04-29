import { fetchUserFolders } from "@/app/actions";
import LeftSidebar from "@/components/left-sidebar";

export default async function Page() {
  const { content: folders } = await fetchUserFolders();
  return <LeftSidebar initialFolders={folders} />;
}
