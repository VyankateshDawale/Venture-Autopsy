"""Document parsing service for PDFs and structured inputs."""

import io
import pdfplumber

class DocumentParser:
    @staticmethod
    def parse_pdf(file_bytes: bytes) -> str:
        """Extract text from a PDF file."""
        text_content = []
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    text_content.append(text)
        return "\n".join(text_content)

    @staticmethod
    def parse_startup_idea(input_data: dict) -> str:
        """Format a startup idea into a string for analysis."""
        return f"Startup Idea: {input_data.get('idea', '')}\nTarget Market: {input_data.get('market', '')}"

    @staticmethod
    def parse_enterprise_proposal(input_data: dict) -> str:
        """Format an enterprise proposal into a string for analysis."""
        return f"Enterprise Proposal: {input_data.get('proposal', '')}\nExpected ROI: {input_data.get('roi', '')}"

document_parser = DocumentParser()
