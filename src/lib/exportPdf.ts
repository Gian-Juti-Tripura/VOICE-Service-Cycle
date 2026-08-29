import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface ExportPdfMeta {
  month: string;
  mealRate: number;
  totalMeals: number;
  totalExpense: number;
  manager?: string;
  totalPrev?: number;
  totalDeposit?: number;
  totalBalance?: number;
  rows?: any[];
}

export async function exportPdf(elementId: string, meta?: ExportPdfMeta) {
  const element = document.getElementById(elementId);

  if (!element) {
    alert('Report element not found');
    return;
  }

  const rawMonth = meta?.month || '';

  const monthFormatted = rawMonth
    ? new Date(rawMonth + '-01')
        .toLocaleString('default', {
          month: 'long',
          year: 'numeric',
        })
        .replace(' ', '-')
    : '';

  const totalExpense = meta?.totalExpense || 0;
  const totalMeals = meta?.totalMeals || 0;
  const mealRateValue = meta?.mealRate || 0;
  const manager = meta?.manager || 'Assigned Kitchen Incharge';
  const today = new Date().toLocaleDateString();

  const mealRateText = `${totalExpense.toFixed(2)} / ${totalMeals.toFixed(2)} = ${mealRateValue.toFixed(2)} BDT`;

  const header = document.createElement('div');

  header.innerHTML = `
    <div style="
      font-family: Arial, sans-serif;
      margin-bottom: 12px;
      background: #ffffff;
      padding: 10px 14px;
      color: #000000;
    ">
      <div style="text-align:center; font-size:11px; font-style:italic; color:#555;">
        For the pleasure of Sri Sri Guru and Gauranga
      </div>

      <div style="
        text-align:center;
        font-size:18px;
        font-weight:900;
        margin-top:6px;
        margin-bottom:8px;
        color: #1e1b4b;
        letter-spacing: 0.5px;
      ">
        ADVAITA VOICE • MONTHLY PRASAD & MEAL REPORT
      </div>

      <table style="
        width:100%;
        font-size:11.5px;
        border-collapse:collapse;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        padding: 6px 0;
      ">
        <tr>
          <td style="text-align:left; padding: 4px 0;">
            <b>Meal Rate:</b> ${mealRateText}
          </td>
          <td style="text-align:right; padding: 4px 0;">
            <b>Month:</b> ${monthFormatted}
          </td>
        </tr>

        <tr>
          <td style="text-align:left; padding: 4px 0;">
            <b>Manager:</b> ${manager}
          </td>
          <td style="text-align:right; padding: 4px 0;">
            <b>Generated:</b> ${today}
          </td>
        </tr>
      </table>
    </div>
  `;

  element.prepend(header);

  const originalStyle = element.getAttribute('style') || '';

  const overflowElements = Array.from(
    element.querySelectorAll('.overflow-x-auto')
  ) as HTMLElement[];

  const originalOverflowStyles = overflowElements.map(
    (el) => el.getAttribute('style') || ''
  );

  overflowElements.forEach((el) => {
    el.style.overflow = 'visible';
  });

  const hideElements = Array.from(
    element.querySelectorAll('.pdf-hide')
  ) as HTMLElement[];

  const showElements = Array.from(
    element.querySelectorAll('.pdf-only')
  ) as HTMLElement[];

  const hideOriginalDisplay = hideElements.map((el) => el.style.display);
  const showOriginalDisplay = showElements.map((el) => el.style.display);

  hideElements.forEach((el) => {
    el.style.display = 'none';
  });

  showElements.forEach((el) => {
    el.style.display = 'inline';
  });

  const fullWidth = Math.max(
    element.scrollWidth,
    element.offsetWidth,
    ...overflowElements.map((el) => el.scrollWidth)
  );

  element.style.background = '#ffffff';
  element.style.color = '#000000';
  element.style.overflow = 'visible';
  element.style.width = `${fullWidth}px`;
  element.style.maxWidth = 'none';

  try {
    const canvas = await html2canvas(element, {
      scale: 2.5,
      useCORS: true,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: fullWidth,
      width: fullWidth,
    });

    element.removeChild(header);
    element.setAttribute('style', originalStyle);

    overflowElements.forEach((el, index) => {
      el.setAttribute('style', originalOverflowStyles[index]);
    });

    hideElements.forEach((el, index) => {
      el.style.display = hideOriginalDisplay[index];
    });

    showElements.forEach((el, index) => {
      el.style.display = showOriginalDisplay[index];
    });

    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 5;

    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;

    const widthRatio = maxWidth / canvas.width;
    const heightRatio = maxHeight / canvas.height;
    const ratio = Math.min(widthRatio, heightRatio);

    const imgWidth = canvas.width * ratio;
    const imgHeight = canvas.height * ratio;

    const x = (pageWidth - imgWidth) / 2;
    const y = (pageHeight - imgHeight) / 2;

    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

    pdf.save(`ADVAITA_VOICE_Meal_Report_${monthFormatted || 'Statement'}.pdf`);
  } catch (err) {
    console.error('PDF generation error:', err);
    element.removeChild(header);
    element.setAttribute('style', originalStyle);
    alert('Failed to generate PDF');
  }
}
