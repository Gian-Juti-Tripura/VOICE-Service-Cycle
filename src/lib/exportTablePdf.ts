import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface TablePdfOptions {
  elementId: string;
  filename?: string;
  title?: string;
  subtitle?: string;
}

export async function exportTableToPdf({
  elementId,
  filename = 'Advaita-VOICE-Export.pdf',
  title = 'Advaita VOICE Document',
  subtitle = 'University of Chittagong'
}: TablePdfOptions): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff'
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(15);
  pdf.setTextColor(30, 41, 59);
  pdf.text(title, 14, 16);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);
  pdf.text(subtitle, 14, 22);

  const dateStr = `Exported: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  pdf.setFontSize(8);
  pdf.text(dateStr, pdfWidth - 14 - pdf.getTextWidth(dateStr), 22);

  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.5);
  pdf.line(14, 25, pdfWidth - 14, 25);

  const margin = 14;
  const contentWidth = pdfWidth - (margin * 2);
  const contentHeight = (canvas.height * contentWidth) / canvas.width;
  const startY = 28;

  if (contentHeight <= (pdfHeight - startY - 15)) {
    pdf.addImage(imgData, 'PNG', margin, startY, contentWidth, contentHeight);
  } else {
    const maxHeight = pdfHeight - startY - 15;
    const scaledWidth = (canvas.width * maxHeight) / canvas.height;
    pdf.addImage(imgData, 'PNG', margin, startY, Math.min(contentWidth, scaledWidth), maxHeight);
  }

  pdf.setFontSize(8);
  pdf.setTextColor(148, 163, 184);
  pdf.text('Advaita VOICE • International Society for Krishna Consciousness (ISKCON)', 14, pdfHeight - 8);

  pdf.save(filename);
}
