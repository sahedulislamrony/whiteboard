'use client';

import React, { useRef } from 'react';
import { toast } from 'sonner';
import WhiteboardCanvas from '@/components/WhiteboardCanvas';
import WhiteboardToolbar from '@/components/WhiteboardToolbar';
import { exportWhiteboard } from '@/utils/export';
import { ExportFormat } from '@/types/whiteboard';

export default function WhiteboardPage() {
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const handleExport = async (format: ExportFormat) => {
    if (!canvasContainerRef.current) {
      toast.error('Canvas not found. Please try again.');
      return;
    }
    
    try {
      await exportWhiteboard(canvasContainerRef.current, format, 'my-whiteboard');
    } catch (error) {
      console.error('Export failed:', error);
      // Error toast is already handled in the export utility
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <WhiteboardToolbar onExport={handleExport} />
      
      <div className="flex-1 overflow-hidden">
        <div ref={canvasContainerRef} className="w-full h-full">
          <WhiteboardCanvas className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
