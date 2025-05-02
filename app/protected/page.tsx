import { LandingHeader } from "@/components/landing-header/landing-header";
import { Recents } from "@/components/utils/recents";
import { StudyGenerator } from "@/components/study-guide/study-generator";
import { fetchRecents } from "@/utils/general/fetch-recents";
import { fetchUserFolders } from "@/utils/folders/actions/fetch-user-folders";

export default async function ProtectedPage() {
  const { content: folders } = await fetchUserFolders();
  const { success, content } = await fetchRecents();
  return (
    <div className="max-w-full mx-auto flex-1">
      <div>
        <h1 className="text-2xl font-bold mb-4">Welcome back!</h1>
        <p className="mb-8">
          Ready to study? Access your generated study materials or upload new
          documents to get started.
        </p>

        {content.length > 0 && (
          <div className="mb-8">
            <Recents items={content} title="Recents" />
          </div>
        )}
      </div>
      <div className="mt-auto pb-8">
        <StudyGenerator folders={folders} />
      </div>
    </div>
  );
}
