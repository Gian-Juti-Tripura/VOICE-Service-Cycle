import { triggerHaptic } from './haptics';
import toast from 'react-hot-toast';

export interface ShareOptions {
  title?: string;
  text: string;
  whatsappNumber?: string;
  successMessage?: string;
}

export const shareToWhatsAppOrSystem = async ({
  title = 'Advaita VOICE Report',
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

  // If specific phone provided or direct WhatsApp preferred
  if (cleanPhone) {
    const directAppUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodedText}`;
    const webFallbackUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
    
    // Try launching installed Android WhatsApp app directly
    try {
      window.location.href = directAppUrl;
      toast.success(successMessage, { icon: '📱' });
      return true;
    } catch (e) {
      window.open(webFallbackUrl, '_blank');
      return true;
    }
  }

  // If Android Native Share is available, open native system drawer
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title,
        text,
      });
      toast.success('Shared successfully!', { icon: '✨' });
      return true;
    } catch (err: any) {
      // User cancelled share sheet or error
      if (err.name === 'AbortError') {
        return false;
      }
    }
  }

  // Fallback to WhatsApp general direct URI or Web URL
  try {
    window.location.href = `whatsapp://send?text=${encodedText}`;
    toast.success(successMessage, { icon: '📱' });
    return true;
  } catch (e) {
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, '_blank');
    return true;
  }
};
