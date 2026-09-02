import { triggerHaptic } from './haptics';
import toast from 'react-hot-toast';

export interface ShareOptions {
  title?: string;
  text: string;
  whatsappNumber?: string;
  successMessage?: string;
}

export const shareToWhatsAppOrSystem = async ({
  text,
  whatsappNumber,
  successMessage = 'Opening WhatsApp...'
}: ShareOptions): Promise<boolean> => {
  triggerHaptic('success');

  // Copy to clipboard as immediate convenience
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    }
  } catch (e) {
    // Clipboard failed silently
  }

  const encodedText = encodeURIComponent(text);
  const cleanPhone = whatsappNumber ? whatsappNumber.replace(/[^0-9+]/g, '') : '';

  // Open standard HTTPS WhatsApp API URL in a new tab
  // This seamlessly opens WhatsApp Web on Desktop (without xdg-open popups) and WhatsApp App on mobile
  const whatsappUrl = cleanPhone 
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
    : `https://api.whatsapp.com/send?text=${encodedText}`;

  window.open(whatsappUrl, '_blank');
  toast.success(successMessage, { icon: '📱' });
  return true;
};
