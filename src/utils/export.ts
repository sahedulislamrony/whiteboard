
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import { ExportFormat } from '@/types/whiteboard';

export const exportWhiteboard = async (
  canvasContainer: HTMLElement,
  format: ExportFormat,
  filename: string = 'whiteboard'
): Promise<void> => {
  const toastId = toast.loading(`Exporting as ${format.toUpperCase()}...`);
  
  try {
    // Find the actual canvas element
    const canvasElement = canvasContainer.querySelector('canvas') as HTMLCanvasElement;
    if (!canvasElement) {
      throw new Error('Canvas element not found');
    }

    switch (format) {
      case 'png':
        downloadCanvasImage(canvasElement, `${filename}.png`, 'image/png');
        break;
      case 'jpeg':
        downloadCanvasImage(canvasElement, `${filename}.jpg`, 'image/jpeg');
        break;
      case 'svg':
        await exportCanvasAsSVG(canvasElement, filename);
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
    
    toast.success(`Successfully exported as ${format.toUpperCase()}!`, { id: toastId });
  } catch (error) {
    console.error('Export failed:', error);
    toast.error(`Failed to export as ${format.toUpperCase()}. Please try again.`, { id: toastId });
    throw error;
  }
};

const downloadCanvasImage = (canvas: HTMLCanvasElement, filename: string, mimeType: string) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL(mimeType, 0.9); // Add quality parameter for JPEG
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportCanvasAsSVG = async (canvas: HTMLCanvasElement, filename: string) => {
  // Convert canvas to PNG data URL and embed it in SVG
  const dataURL = canvas.toDataURL('image/png');
  const svg = `
    <svg width="${canvas.width}" height="${canvas.height}" xmlns="http://www.w3.org/2000/svg">
      <image href="${dataURL}" width="${canvas.width}" height="${canvas.height}" />
    </svg>
  `;

  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${filename}.svg`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToPDF = async (
  canvasContainer: HTMLElement,
  filename: string = 'whiteboard'
): Promise<void> => {
  const toastId = toast.loading('Exporting as PDF...');
  
  try {
    // Find the actual canvas element
    const canvasElement = canvasContainer.querySelector('canvas') as HTMLCanvasElement;
    if (!canvasElement) {
      throw new Error('Canvas element not found');
    }

    const imgData = canvasElement.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvasElement.width > canvasElement.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvasElement.width, canvasElement.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvasElement.width, canvasElement.height);
    pdf.save(`${filename}.pdf`);
    
    toast.success('Successfully exported as PDF!', { id: toastId });
  } catch (error) {
    console.error('PDF export failed:', error);
    toast.error('Failed to export as PDF. Please try again.', { id: toastId });
    throw error;
  }
};

export const copyToClipboard = async (canvasContainer: HTMLElement): Promise<void> => {
  const toastId = toast.loading('Copying to clipboard...');
  
  try {
    // Find the actual canvas element
    const canvasElement = canvasContainer.querySelector('canvas') as HTMLCanvasElement;
    if (!canvasElement) {
      throw new Error('Canvas element not found');
    }

    canvasElement.toBlob(async (blob) => {
      if (blob && navigator.clipboard && window.ClipboardItem) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          toast.success('Successfully copied to clipboard!', { id: toastId });
        } catch (error) {
          console.error('Failed to copy to clipboard:', error);
          toast.error('Failed to copy to clipboard. Please try again.', { id: toastId });
          throw error;
        }
      } else {
        toast.error('Clipboard API not supported in this browser.', { id: toastId });
        throw new Error('Clipboard API not supported');
      }
    });
  } catch (error) {
    console.error('Copy to clipboard failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (!errorMessage.includes('Clipboard API not supported')) {
      toast.error('Failed to copy to clipboard. Please try again.', { id: toastId });
    }
    throw error;
  }
};
