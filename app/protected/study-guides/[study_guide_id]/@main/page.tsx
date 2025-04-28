import { StudyGuide } from "@/components/operations-study-guide";
import StudyGuideComponent from "@/components/study-guide";
import { mock_study_guide } from "@/data/mock-study-guide";
import { StudyGuidePart } from "@/utils/ai/generate-study-guide";
export default function StudyGuidePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const studyGuideId = searchParams?.study_guide_id as string;
  console.log(studyGuideId);
  const content = mock_study_guide.content as StudyGuidePart[];
  const studyGuide: StudyGuide = {
    id: studyGuideId,
    title: "Operating systems",
    content: content,
  };
  return <StudyGuideComponent studyGuide={studyGuide} />;
}
