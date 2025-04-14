import JSZip from "jszip";
import { DOMParser } from "xmldom";

export class PptxToTextConverter {
  private readonly DRAWING_ML_NAMESPACE =
    "http://schemas.openxmlformats.org/drawingml/2006/main";

  async convert(buffer: Buffer): Promise<string> {
    try {
      const zip = await JSZip.loadAsync(buffer);
      const parser = new DOMParser();
      const textChunks: string[] = [];
      for (let slideIndex = 1; ; slideIndex++) {
        const slidePath = `ppt/slides/slide${slideIndex}.xml`;
        const slideFile = zip.file(slidePath);
        if (!slideFile) {
          break;
        }

        const slideContent = await slideFile.async("text");
        const xmlDoc = parser.parseFromString(slideContent, "application/xml");
        const textNodes = xmlDoc.getElementsByTagNameNS(
          this.DRAWING_ML_NAMESPACE,
          "t"
        );

        for (let i = 0; i < textNodes.length; i++) {
          const textContent = textNodes[i].textContent;
          if (textContent) {
            textChunks.push(textContent.trim());
          }
        }
      }

      return textChunks.join(" ").trim();
    } catch (error) {
      console.error("Failed to extract text from PPTX:", error);
      return "";
    }
  }
}
