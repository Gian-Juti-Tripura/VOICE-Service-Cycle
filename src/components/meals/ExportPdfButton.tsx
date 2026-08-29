import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { exportPdf, type ExportPdfMeta } from '../../lib/exportPdf';
import toast from 'react-hot-toast';

interface ExportPdfButtonProps {
  elementId?: string;
  meta?: ExportPdfMeta;
  label?: string;
}

export const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({
  elementId = 'meal-report-table-section',
  meta,
  label = 'Export Official PDF'
}) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      setLoading(true);
      toast.loading('Generating Landscape PDF Report...', { id: 'pdf-gen' });
      await exportPdf(elementId, meta);
      toast.success('PDF downloaded successfully!', { id: 'pdf-gen' });
    } catch (err) {
      toast.error('Failed to export PDF', { id: 'pdf-gen' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
      title="Export Official Landscape A4 PDF"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
      <span>{loading ? 'Generating PDF...' : label}</span>
    </button>
  );
};

export default ExportPdfButton;
