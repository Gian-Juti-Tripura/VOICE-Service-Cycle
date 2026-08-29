import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { type MonthlyRow } from '../types/mealTypes';

export interface ExportPdfMeta {
  month: string;
  mealRate: number;
  totalMeals: number;
  totalExpense: number;
  manager?: string;
  totalPrev?: number;
  totalDeposit?: number;
  totalBalance?: number;
  rows?: MonthlyRow[];
}

export async function exportPdf(_elementId?: string, meta?: ExportPdfMeta) {
  if (!meta || !meta.rows) {
    alert('No report data available to export');
    return;
  }

  const rawMonth = meta.month || '';
  const monthFormatted = rawMonth
    ? new Date(rawMonth + '-01')
        .toLocaleString('default', {
          month: 'long',
          year: 'numeric',
        })
        .replace(' ', '-')
    : '';

  const totalExpense = meta.totalExpense || 0;
  const totalMeals = meta.totalMeals || 0;
  const mealRateValue = meta.mealRate || 0;
  const manager = meta.manager || 'Assigned Kitchen Incharge';
  const today = new Date().toLocaleDateString('en-GB');

  const mealRateText = `৳ ${totalExpense.toFixed(2)} / ${totalMeals.toFixed(1)} meals = ৳ ${mealRateValue.toFixed(2)} /meal`;

  const totalPrev = meta.rows.reduce((sum, r) => sum + r.previousBalance, 0);
  const totalDeposit = meta.rows.reduce((sum, r) => sum + r.deposits, 0);
  const totalCost = meta.rows.reduce((sum, r) => sum + r.mealCost, 0);
  const totalBalance = meta.rows.reduce((sum, r) => sum + r.finalBalance, 0);

  // Create an isolated, dedicated offscreen container with pure light-mode print styles
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '1120px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = 'Arial, Helvetica, sans-serif';
  container.style.padding = '24px 30px';
  container.style.boxSizing = 'border-box';
  container.style.zIndex = '-9999';

  // Build the complete HTML
  container.innerHTML = `
    <div style="background: #ffffff; color: #0f172a; width: 100%;">
      
      <!-- Top Sacred Header with Official VOICE Logo -->
      <div style="text-align: center; margin-bottom: 6px;">
        <div style="font-size: 11px; font-style: italic; color: #64748b; margin-bottom: 4px;">
          For the pleasure of Sri Sri Guru and Gauranga
        </div>
        <div style="text-align: center; margin-bottom: 4px;">
          <img src="/logo.png" style="width: 52px; height: 52px; object-fit: contain; margin: 0 auto; display: block;" alt="VOICE" />
        </div>
        <div style="font-size: 19px; font-weight: 900; color: #1e1b4b; letter-spacing: 0.5px; text-transform: uppercase; margin-top: 4px;">
          ADVAITA VOICE • MONTHLY PRASAD &amp; MEAL REPORT
        </div>
      </div>

      <!-- Meta Details Header Bar -->
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 14px; border-top: 2px solid #cbd5e1; border-bottom: 2px solid #cbd5e1; font-size: 11.5px;">
        <tr>
          <td style="padding: 6px 0; text-align: left; color: #1e293b;">
            <b style="color: #0f172a;">Meal Rate:</b> ${mealRateText}
          </td>
          <td style="padding: 6px 0; text-align: right; color: #1e293b;">
            <b style="color: #0f172a;">Month:</b> ${monthFormatted}
          </td>
        </tr>
        <tr>
          <td style="padding: 4px 0 6px 0; text-align: left; color: #1e293b;">
            <b style="color: #0f172a;">Manager:</b> ${manager}
          </td>
          <td style="padding: 4px 0 6px 0; text-align: right; color: #1e293b;">
            <b style="color: #0f172a;">Generated:</b> ${today}
          </td>
        </tr>
      </table>

      <!-- Main Ledger Table -->
      <table style="width: 100%; border-collapse: collapse; font-size: 11px; border: 1px solid #cbd5e1;">
        <thead>
          <tr style="background-color: #1e293b; color: #ffffff; font-weight: bold; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px;">
            <th style="padding: 8px 10px; text-align: left; border: 1px solid #334155; width: 22%;">NAME</th>
            <th style="padding: 8px 8px; text-align: right; border: 1px solid #334155; width: 10%;">LAST BAL</th>
            <th style="padding: 8px 8px; text-align: right; border: 1px solid #334155; width: 10%;">DEPOSITS</th>
            <th style="padding: 8px 8px; text-align: right; border: 1px solid #334155; width: 11%;">TOTAL DEP</th>
            <th style="padding: 8px 8px; text-align: center; border: 1px solid #334155; width: 9%;">MEALS</th>
            <th style="padding: 8px 8px; text-align: right; border: 1px solid #334155; width: 11%;">COST (৳)</th>
            <th style="padding: 8px 8px; text-align: right; border: 1px solid #334155; width: 15%;">FINAL BALANCE</th>
            <th style="padding: 8px 8px; text-align: center; border: 1px solid #334155; width: 12%;">STATUS</th>
          </tr>
        </thead>
        <tbody>
          ${meta.rows.map((row, idx) => {
            const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
            const totalDep = row.previousBalance + row.deposits;
            const isSurplus = row.finalBalance >= 0;
            const balColor = isSurplus ? '#059669' : '#dc2626';
            const balText = isSurplus ? `+৳ ${row.finalBalance.toFixed(0)}` : `-৳ ${Math.abs(row.finalBalance).toFixed(0)}`;
            const statusBg = isSurplus ? '#dcfce7' : '#fee2e2';
            const statusColor = isSurplus ? '#166534' : '#991b1b';
            const statusLabel = isSurplus ? 'ADVANCE' : 'DUE';

            return `
              <tr style="background-color: ${bg}; border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 6px 10px; text-align: left; font-weight: bold; color: #0f172a; border-left: 1px solid #cbd5e1; border-right: 1px solid #cbd5e1;">
                  ${row.name}
                </td>
                <td style="padding: 6px 8px; text-align: right; font-family: monospace; color: #64748b; border-right: 1px solid #cbd5e1;">
                  ৳ ${row.previousBalance.toFixed(0)}
                </td>
                <td style="padding: 6px 8px; text-align: right; font-family: monospace; font-weight: bold; color: #059669; border-right: 1px solid #cbd5e1;">
                  ৳ ${row.deposits.toFixed(0)}
                </td>
                <td style="padding: 6px 8px; text-align: right; font-family: monospace; font-weight: bold; color: #1e293b; border-right: 1px solid #cbd5e1;">
                  ৳ ${totalDep.toFixed(0)}
                </td>
                <td style="padding: 6px 8px; text-align: center; font-family: monospace; font-weight: bold; color: #0f172a; border-right: 1px solid #cbd5e1;">
                  ${row.meals.toFixed(1)}
                </td>
                <td style="padding: 6px 8px; text-align: right; font-family: monospace; font-weight: bold; color: #1e293b; border-right: 1px solid #cbd5e1;">
                  ৳ ${row.mealCost.toFixed(0)}
                </td>
                <td style="padding: 6px 8px; text-align: right; font-family: monospace; font-weight: 900; color: ${balColor}; border-right: 1px solid #cbd5e1;">
                  ${balText}
                </td>
                <td style="padding: 6px 8px; text-align: center; border-right: 1px solid #cbd5e1;">
                  <span style="display: inline-block; padding: 2px 8px; font-size: 9px; font-weight: bold; border-radius: 4px; background-color: ${statusBg}; color: ${statusColor};">
                    ${statusLabel}
                  </span>
                </td>
              </tr>
            `;
          }).join('')}

          <!-- Total Footer Row -->
          <tr style="background-color: #334155; color: #ffffff; font-weight: 900; font-size: 11px; border-top: 2px solid #0f172a;">
            <td style="padding: 8px 10px; text-align: left; border: 1px solid #334155;">
              TOTAL
            </td>
            <td style="padding: 8px 8px; text-align: right; font-family: monospace; border: 1px solid #334155;">
              ৳ ${totalPrev.toFixed(0)}
            </td>
            <td style="padding: 8px 8px; text-align: right; font-family: monospace; color: #34d399; border: 1px solid #334155;">
              ৳ ${totalDeposit.toFixed(0)}
            </td>
            <td style="padding: 8px 8px; text-align: right; font-family: monospace; border: 1px solid #334155;">
              ৳ ${(totalPrev + totalDeposit).toFixed(0)}
            </td>
            <td style="padding: 8px 8px; text-align: center; font-family: monospace; border: 1px solid #334155;">
              ${totalMeals.toFixed(1)}
            </td>
            <td style="padding: 8px 8px; text-align: right; font-family: monospace; border: 1px solid #334155;">
              ৳ ${totalCost.toFixed(0)}
            </td>
            <td style="padding: 8px 8px; text-align: right; font-family: monospace; color: ${totalBalance >= 0 ? '#34d399' : '#f87171'}; border: 1px solid #334155;">
              ${totalBalance >= 0 ? `+৳ ${totalBalance.toFixed(0)}` : `-৳ ${Math.abs(totalBalance).toFixed(0)}`}
            </td>
            <td style="padding: 8px 8px; text-align: center; border: 1px solid #334155;">
              —
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Footer Note -->
      <div style="margin-top: 14px; text-align: center; font-size: 9.5px; color: #64748b; font-style: italic;">
        Generated by Advaita VOICE Hub • Chittagong University Chapter
      </div>

    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    document.body.removeChild(container);

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 6;

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

    pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight, undefined, 'FAST');

    pdf.save(`ADVAITA_VOICE_Meal_Report_${monthFormatted || 'Statement'}.pdf`);
  } catch (err) {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    console.error('PDF generation error:', err);
    alert('Failed to generate PDF');
  }
}
