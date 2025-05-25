/**
 * Canvas Helper Utilities
 *
 * Provides helper functions for canvas-based applications,
 * including functionality to save canvases as images.
 */

/**
 * Sets up a global event listener to save a canvas when triggered by the parent window.
 *
 * Usage in a canvas app:
 *
 * ```
 * import { setupCanvasSave } from '~/utils/canvas-helper';
 *
 * // Then, in your component:
 * const canvasRef = useRef<HTMLCanvasElement>(null);
 *
 * useEffect(() => {
 *   if (canvasRef.current) {
 *     setupCanvasSave(canvasRef.current);
 *   }
 * }, [canvasRef]);
 * ```
 *
 * @param canvas The canvas element to save when triggered
 * @param filename Optional filename (defaults to 'canvas-{timestamp}.png')
 */
export function setupCanvasSave(canvas: HTMLCanvasElement, filename?: string) {
  const handleMessage = (event: MessageEvent) => {
    // Check if the message is requesting to save the canvas
    if (event.data?.action === 'save-canvas') {
      try {
        // Generate a default filename if none provided
        const defaultFilename = `canvas-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
        const saveFilename = filename || defaultFilename;

        // Create a download link for the canvas
        const link = document.createElement('a');
        link.download = saveFilename;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Notify the parent window that the canvas was saved successfully
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ action: 'canvas-saved', success: true }, '*');
        }
      } catch (error) {
        console.error('Failed to save canvas:', error);

        // Notify the parent window of the failure
        if (window.parent && window.parent !== window) {
          window.parent.postMessage(
            {
              action: 'canvas-saved',
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error',
            },
            '*',
          );
        }
      }
    }
  };

  // Add the event listener
  window.addEventListener('message', handleMessage);

  // Return a cleanup function
  return () => {
    window.removeEventListener('message', handleMessage);
  };
}

/**
 * Manually saves a canvas as an image.
 *
 * @param canvas The canvas element to save
 * @param filename Optional filename (defaults to 'canvas-{timestamp}.png')
 */
export function saveCanvas(canvas: HTMLCanvasElement, filename?: string) {
  try {
    // Generate a default filename if none provided
    const defaultFilename = `canvas-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
    const saveFilename = filename || defaultFilename;

    // Create a download link for the canvas
    const link = document.createElement('a');
    link.download = saveFilename;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error('Failed to save canvas:', error);
    return false;
  }
}
