import pdfParse from "pdf-parse";
import { FileToTextConverter } from "./file-converter";

export class PdfToTextConverter implements FileToTextConverter {
  async convert(buffer: Buffer): Promise<string> {
    const data = await pdfParse(buffer);
    return data.text;
  }
}
