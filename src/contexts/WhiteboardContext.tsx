'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useWhiteboard } from '@/hooks/useWhiteboard';
import { WhiteboardState, DrawingTool, Point, WhiteboardElement } from '@/types/whiteboard';

interface WhiteboardContextType {
  state: WhiteboardState;
  isTextInputActive: boolean;
  textInputPosition: Point | null;
  actions: {
    setTool: (tool: DrawingTool) => void;
    setColor: (color: string) => void;
    setStrokeWidth: (width: number) => void;
    startDrawing: (point: Point) => void;
    continueDrawing: (point: Point) => void;
    stopDrawing: () => void;
    addElement: (element: WhiteboardElement) => void;
    updateElement: (id: string, updates: Partial<WhiteboardElement>) => void;
    deleteElement: (id: string) => void;
    selectElement: (id: string | null) => void;
    clearCanvas: () => void;
    setZoom: (zoom: number) => void;
    setPan: (pan: Point) => void;
    undo: () => void;
    addText: (text: string, position: Point) => void;
    cancelTextInput: () => void;
  };
}

const WhiteboardContext = createContext<WhiteboardContextType | undefined>(undefined);

export const useWhiteboardContext = () => {
  const context = useContext(WhiteboardContext);
  if (!context) {
    throw new Error('useWhiteboardContext must be used within a WhiteboardProvider');
  }
  return context;
};

interface WhiteboardProviderProps {
  children: ReactNode;
}

export const WhiteboardProvider: React.FC<WhiteboardProviderProps> = ({ children }) => {
  const whiteboard = useWhiteboard();

  return (
    <WhiteboardContext.Provider value={whiteboard}>
      {children}
    </WhiteboardContext.Provider>
  );
};
