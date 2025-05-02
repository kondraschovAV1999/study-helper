import StudyGuideComponent from "@/components/study-guide/study-guide";
import { fetchStudyGuide } from "@/utils/study-guide/actions/fetch-study-guide";

export default async function StudyGuidePage({
  params,
}: {
  params: { study_guide_id: string };
}) {
  const { study_guide_id: studyGuideId } = await params;
  const { success, content } = await fetchStudyGuide(studyGuideId);

  return <StudyGuideComponent studyGuide={content} />;
}
