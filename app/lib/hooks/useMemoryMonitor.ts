import { useEffect } from "react";

export function useMemoryMonitor() {
  useEffect(() => {
    const monitor = setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        console.log({
          used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
          total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
          limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
        });
      }
    }, 30000);

    return () => clearInterval(monitor);
  }, []);
}