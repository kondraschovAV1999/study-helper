import StudyGuideComponent from "@/components/study-guide";
import { mock_study_guide } from "@/data/mock-study-guide";
import { StudyGuide, StudyGuidePart } from "@/types/study-guide";

export default async function StudyGuidePage({
  params,
}: {
  params: { study_guide_id: string };
}) {
  const { study_guide_id: studyGuideId } = await params;
  console.log(studyGuideId);
  const content = mock_study_guide.content as StudyGuidePart[];
  const studyGuide: StudyGuide = {
    id: studyGuideId,
    title: "Operating systems",
    content: content,
  };
  return <StudyGuideComponent studyGuide={studyGuide} />;
}
