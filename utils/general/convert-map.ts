import { DocsxToTextConverter } from "../file-converters/docx-converter";
import { FileToTextConverter } from "../file-converters/file-converter";
import { PdfToTextConverter } from "../file-converters/pdf-converter";
import { PptxToTextConverter } from "../file-converters/pptx-converter";

export const converterMap: Record<string, FileToTextConverter> = {
  "application/pdf": new PdfToTextConverter(),
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    new DocsxToTextConverter(),
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    new PptxToTextConverter(),
};
