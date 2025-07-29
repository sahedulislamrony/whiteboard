'use client';

import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { WhiteboardState, DrawingTool, Point, WhiteboardElement, DrawingPath, ShapeElement, TextElement } from '@/types/whiteboard';

const initialState: WhiteboardState = {
  elements: [],
  currentTool: 'pen',
  currentColor: '#000000',
  currentStrokeWidth: 2,
  isDrawing: false,
  selectedElement: null,
  zoom: 1,
  pan: { x: 0, y: 0 },
};

export const useWhiteboard = () => {
  const [state, setState] = useState<WhiteboardState>(initialState);
  const currentPathRef = useRef<DrawingPath | null>(null);
  const currentShapeRef = useRef<ShapeElement | null>(null);
  const startPointRef = useRef<Point | null>(null);
  const [isTextInputActive, setIsTextInputActive] = useState(false);
  const [textInputPosition, setTextInputPosition] = useState<Point | null>(null);

  const setTool = useCallback((tool: DrawingTool) => {
    setState(prev => ({ ...prev, currentTool: tool, selectedElement: null }));
  }, []);

  const setColor = useCallback((color: string) => {
    setState(prev => ({ ...prev, currentColor: color }));
  }, []);

  const setStrokeWidth = useCallback((width: number) => {
    setState(prev => ({ ...prev, currentStrokeWidth: width }));
  }, []);

  const startDrawing = useCallback((point: Point) => {
    if (state.currentTool === 'text') {
      setIsTextInputActive(true);
      setTextInputPosition(point);
      return;
    }

    setState(prev => ({ ...prev, isDrawing: true }));
    startPointRef.current = point;

    if (state.currentTool === 'pen' || state.currentTool === 'eraser') {
      const newPath: DrawingPath = {
        id: `path-${Date.now()}-${Math.random()}`,
        points: [point],
        color: state.currentTool === 'eraser' ? '#FFFFFF' : state.currentColor,
        strokeWidth: state.currentStrokeWidth,
        tool: state.currentTool,
        timestamp: Date.now(),
      };
      
      currentPathRef.current = newPath;
    } else if (['rectangle', 'circle', 'line', 'arrow'].includes(state.currentTool)) {
      const newShape: ShapeElement = {
        id: `shape-${Date.now()}-${Math.random()}`,
        type: state.currentTool as 'rectangle' | 'circle' | 'line' | 'arrow',
        position: point,
        dimensions: { width: 0, height: 0 },
        color: state.currentColor,
        strokeWidth: state.currentStrokeWidth,
      };
      
      currentShapeRef.current = newShape;
    }
  }, [state.currentTool, state.currentColor, state.currentStrokeWidth]);

  const continueDrawing = useCallback((point: Point) => {
    if (!state.isDrawing) return;

    if (currentPathRef.current) {
      const currentPath = currentPathRef.current;
      currentPath.points.push(point);
      
      // Update the current path in elements
      setState(prev => {
        const newElements = [...prev.elements];
        const existingIndex = newElements.findIndex(el => el.id === currentPath.id);
        
        const pathElement: WhiteboardElement = {
          id: currentPath.id,
          type: 'path',
          data: currentPath,
          position: currentPath.points[0],
          timestamp: currentPath.timestamp,
        };

        if (existingIndex >= 0) {
          newElements[existingIndex] = pathElement;
        } else {
          newElements.push(pathElement);
        }

        return { ...prev, elements: newElements };
      });
    } else if (currentShapeRef.current && startPointRef.current) {
      const currentShape = currentShapeRef.current;
      const startPoint = startPointRef.current;
      
      // Calculate dimensions based on current mouse position
      currentShape.dimensions = {
        width: Math.abs(point.x - startPoint.x),
        height: Math.abs(point.y - startPoint.y),
      };
      
      // Adjust position for negative dimensions
      currentShape.position = {
        x: Math.min(startPoint.x, point.x),
        y: Math.min(startPoint.y, point.y),
      };

      // Update the current shape in elements
      setState(prev => {
        const newElements = [...prev.elements];
        const existingIndex = newElements.findIndex(el => el.id === currentShape.id);
        
        const shapeElement: WhiteboardElement = {
          id: currentShape.id,
          type: 'shape',
          data: currentShape,
          position: currentShape.position,
          timestamp: Date.now(),
        };

        if (existingIndex >= 0) {
          newElements[existingIndex] = shapeElement;
        } else {
          newElements.push(shapeElement);
        }

        return { ...prev, elements: newElements };
      });
    }
  }, [state.isDrawing]);

  const stopDrawing = useCallback(() => {
    setState(prev => ({ ...prev, isDrawing: false }));
    currentPathRef.current = null;
    currentShapeRef.current = null;
    startPointRef.current = null;
  }, []);

  const addElement = useCallback((element: WhiteboardElement) => {
    setState(prev => ({
      ...prev,
      elements: [...prev.elements, element],
    }));
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<WhiteboardElement>) => {
    setState(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === id ? { ...el, ...updates } : el
      ),
    }));
  }, []);

  const deleteElement = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== id),
      selectedElement: prev.selectedElement === id ? null : prev.selectedElement,
    }));
  }, []);

  const selectElement = useCallback((id: string | null) => {
    setState(prev => ({ ...prev, selectedElement: id }));
  }, []);

  const clearCanvas = useCallback(() => {
    setState(prev => {
      if (prev.elements.length > 0) {
        toast.success('Canvas cleared successfully');
        return { ...prev, elements: [], selectedElement: null };
      }
      return prev;
    });
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({ ...prev, zoom: Math.max(0.1, Math.min(5, zoom)) }));
  }, []);

  const setPan = useCallback((pan: Point) => {
    setState(prev => ({ ...prev, pan }));
  }, []);

  const addText = useCallback((text: string, position: Point) => {
    if (!text.trim()) return;

    const textElement: TextElement = {
      id: `text-${Date.now()}-${Math.random()}`,
      text: text.trim(),
      position,
      fontSize: state.currentStrokeWidth * 8, // Use stroke width as font size multiplier
      color: state.currentColor,
      fontFamily: 'Arial, sans-serif',
    };

    const whiteboardElement: WhiteboardElement = {
      id: textElement.id,
      type: 'text',
      data: textElement,
      position,
      timestamp: Date.now(),
    };

    setState(prev => ({
      ...prev,
      elements: [...prev.elements, whiteboardElement],
    }));

    setIsTextInputActive(false);
    setTextInputPosition(null);
    toast.success('Text added successfully');
  }, [state.currentColor, state.currentStrokeWidth]);

  const cancelTextInput = useCallback(() => {
    setIsTextInputActive(false);
    setTextInputPosition(null);
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.elements.length > 0) {
        toast.success('Action undone');
        return {
          ...prev,
          elements: prev.elements.slice(0, -1),
          selectedElement: null,
        };
      } else {
        toast.info('Nothing to undo');
        return prev;
      }
    });
  }, []);

  return {
    state,
    isTextInputActive,
    textInputPosition,
    actions: {
      setTool,
      setColor,
      setStrokeWidth,
      startDrawing,
      continueDrawing,
      stopDrawing,
      addElement,
      updateElement,
      deleteElement,
      selectElement,
      clearCanvas,
      setZoom,
      setPan,
      undo,
      addText,
      cancelTextInput,
    },
  };
};
