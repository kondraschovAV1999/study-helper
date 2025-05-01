import { fetchStudyGuide } from "@/app/actions";
import StudyGuideComponent from "@/components/study-guide";
import { mock_study_guide } from "@/data/mock-study-guide";
import { StudyGuide, StudyGuidePart } from "@/types/study-guide";

export default async function StudyGuidePage({
  params,
}: {
  params: { study_guide_id: string };
}) {
  const { study_guide_id: studyGuideId } = await params;
  const { success, content } = await fetchStudyGuide(studyGuideId);

  return <StudyGuideComponent studyGuide={content} />;
}
