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

  // Generate clean, high-contrast, ink-saving printable canvas
  const canvas = await html2canvas(element, {
    scale: 2, // 2x for sharp typography
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    onclone: (clonedDoc, clonedElement) => {
      // 1. Force light mode across the cloned document
      clonedDoc.documentElement.classList.remove('dark');
      clonedDoc.body.classList.remove('dark');
      clonedDoc.body.style.backgroundColor = '#ffffff';
      clonedDoc.body.style.color = '#0f172a';

      // 2. Style table container
      clonedElement.style.backgroundColor = '#ffffff';
      clonedElement.style.color = '#0f172a';
      clonedElement.style.border = '1px solid #cbd5e1';
      clonedElement.style.boxShadow = 'none';
      clonedElement.style.borderRadius = '8px';
      clonedElement.style.padding = '0';
      clonedElement.style.overflow = 'visible';

      // 3. Hide Action headers and Action columns (Edit buttons, etc.)
      const allTh = clonedElement.querySelectorAll('th');
      let actionColIndex = -1;
      allTh.forEach((th, idx) => {
        const text = th.textContent?.trim().toLowerCase() || '';
        if (text === 'actions' || text === 'action' || text === 'এডিট') {
          actionColIndex = idx;
          (th as HTMLElement).style.display = 'none';
        } else {
          const el = th as HTMLElement;
          el.style.backgroundColor = '#f1f5f9';
          el.style.color = '#0f172a';
          el.style.fontWeight = '800';
          el.style.fontSize = '12px';
          el.style.padding = '10px 14px';
          el.style.borderBottom = '2px solid #cbd5e1';
          el.style.letterSpacing = '0.025em';
        }
      });

      // 4. Style all table rows & cells
      const rows = clonedElement.querySelectorAll('tr');
      rows.forEach((tr, rIdx) => {
        const cells = tr.querySelectorAll('td');
        if (actionColIndex >= 0 && cells[actionColIndex]) {
          (cells[actionColIndex] as HTMLElement).style.display = 'none';
        }

        const bg = rIdx % 2 === 0 ? '#ffffff' : '#f8fafc';
        (tr as HTMLElement).style.backgroundColor = bg;
        (tr as HTMLElement).style.borderBottom = '1px solid #e2e8f0';

        cells.forEach(td => {
          const el = td as HTMLElement;
          el.style.padding = '10px 14px';
          el.style.color = '#0f172a';
          el.style.fontSize = '12px';
          el.style.borderColor = '#e2e8f0';
        });
      });

      // 5. Enhance all text contrast inside cells
      const darkTexts = clonedElement.querySelectorAll('.text-slate-900, .text-slate-100, .text-white, .text-slate-800, .text-slate-700, .text-slate-600, .text-slate-500, .text-slate-400');
      darkTexts.forEach(t => {
        const el = t as HTMLElement;
        if (el.classList.contains('text-slate-400') || el.classList.contains('text-slate-500')) {
          el.style.color = '#475569';
        } else {
          el.style.color = '#0f172a';
        }
      });

      // 6. Clean badges for crisp monochrome/clean color printing
      const allSpans = clonedElement.querySelectorAll('span, div');
      allSpans.forEach(s => {
        const el = s as HTMLElement;
        // Active status badge
        if (el.textContent?.includes('Active')) {
          el.style.backgroundColor = '#f0fdf4';
          el.style.color = '#166534';
          el.style.border = '1px solid #86efac';
          el.style.fontWeight = '700';
        }
        // Slot numbers
        if (el.classList.contains('bg-amber-500/10') || el.classList.contains('text-amber-600')) {
          el.style.backgroundColor = '#fef3c7';
          el.style.color = '#92400e';
          el.style.border = '1px solid #fcd34d';
          el.style.fontWeight = '800';
        }
        // Timing badges
        if (el.textContent?.includes('AM') || el.textContent?.includes('PM') || el.textContent?.includes('Night') || el.textContent?.includes('Evening')) {
          if (el.tagName === 'SPAN' && el.classList.contains('rounded')) {
            el.style.backgroundColor = '#f1f5f9';
            el.style.color = '#1e293b';
            el.style.border = '1px solid #cbd5e1';
            el.style.fontWeight = '600';
          }
        }
      });
    }
  });

  // Use JPEG with 0.88 quality for 97% smaller PDF file size (< 300 KB) with crystal clear quality
  const imgData = canvas.toDataURL('image/jpeg', 0.88);
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Draw Header
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(15, 23, 42);
  pdf.text(title, 14, 15);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(71, 85, 105);
  pdf.text(subtitle, 14, 21);

  const dateStr = `Exported: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  pdf.setFontSize(8);
  pdf.text(dateStr, pdfWidth - 14 - pdf.getTextWidth(dateStr), 21);

  // Top accent bar
  pdf.setDrawColor(245, 158, 11); // Amber-500
  pdf.setLineWidth(0.8);
  pdf.line(14, 24, 45, 24);

  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.4);
  pdf.line(45, 24, pdfWidth - 14, 24);

  const margin = 14;
  const contentWidth = pdfWidth - (margin * 2);
  const contentHeight = (canvas.height * contentWidth) / canvas.width;
  const startY = 27;

  if (contentHeight <= (pdfHeight - startY - 14)) {
    pdf.addImage(imgData, 'JPEG', margin, startY, contentWidth, contentHeight, undefined, 'FAST');
  } else {
    const maxHeight = pdfHeight - startY - 14;
    const scaledWidth = (canvas.width * maxHeight) / canvas.height;
    pdf.addImage(imgData, 'JPEG', margin, startY, Math.min(contentWidth, scaledWidth), maxHeight, undefined, 'FAST');
  }

  // Draw Footer
  pdf.setFontSize(7.5);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Advaita VOICE • International Society for Krishna Consciousness (ISKCON) • University of Chittagong', 14, pdfHeight - 6);

  pdf.save(filename);
}
