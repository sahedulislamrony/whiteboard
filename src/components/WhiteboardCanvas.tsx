'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useWhiteboardContext } from '@/contexts/WhiteboardContext';
import { Point, DrawingPath, ShapeElement, TextElement } from '@/types/whiteboard';

interface WhiteboardCanvasProps {
  className?: string;
}

export const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state, actions, isTextInputActive, textInputPosition } = useWhiteboardContext();
  const isDrawingRef = useRef(false);
  const [textInput, setTextInput] = React.useState('');

  const getPointFromEvent = useCallback((event: React.MouseEvent | MouseEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }, []);

  const drawPath = useCallback((ctx: CanvasRenderingContext2D, path: DrawingPath) => {
    if (path.points.length < 2) return;

    ctx.beginPath();
    ctx.strokeStyle = path.color;
    ctx.lineWidth = path.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (path.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
    }

    ctx.moveTo(path.points[0].x, path.points[0].y);
    
    for (let i = 1; i < path.points.length; i++) {
      const point = path.points[i];
      ctx.lineTo(point.x, point.y);
    }
    
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
  }, []);

  const drawShape = useCallback((ctx: CanvasRenderingContext2D, shape: ShapeElement) => {
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'source-over';

    const { x, y } = shape.position;
    const { width, height } = shape.dimensions;

    ctx.beginPath();

    switch (shape.type) {
      case 'rectangle':
        ctx.rect(x, y, width, height);
        break;
      case 'circle':
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        const radius = Math.min(width, height) / 2;
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        break;
      case 'line':
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y + height);
        break;
      case 'arrow':
        // Draw arrow line
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y + height);
        
        // Draw arrowhead
        const headLength = 20;
        const angle = Math.atan2(height, width);
        ctx.lineTo(
          x + width - headLength * Math.cos(angle - Math.PI / 6),
          y + height - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(x + width, y + height);
        ctx.lineTo(
          x + width - headLength * Math.cos(angle + Math.PI / 6),
          y + height - headLength * Math.sin(angle + Math.PI / 6)
        );
        break;
    }

    ctx.stroke();

    if (shape.fill) {
      ctx.fillStyle = shape.fill;
      ctx.fill();
    }
  }, []);

  const drawText = useCallback((ctx: CanvasRenderingContext2D, textElement: TextElement) => {
    ctx.fillStyle = textElement.color;
    ctx.font = `${textElement.fontSize}px ${textElement.fontFamily}`;
    ctx.textBaseline = 'top';
    ctx.globalCompositeOperation = 'source-over';
    
    const lines = textElement.text.split('\n');
    lines.forEach((line, index) => {
      ctx.fillText(
        line,
        textElement.position.x,
        textElement.position.y + (index * textElement.fontSize * 1.2)
      );
    });
  }, []);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all elements
    state.elements.forEach(element => {
      if (element.type === 'path') {
        drawPath(ctx, element.data as DrawingPath);
      } else if (element.type === 'shape') {
        drawShape(ctx, element.data as ShapeElement);
      } else if (element.type === 'text') {
        drawText(ctx, element.data as TextElement);
      }
    });
  }, [state.elements, drawPath, drawShape, drawText]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    const point = getPointFromEvent(event);
    isDrawingRef.current = true;
    actions.startDrawing(point);
  }, [getPointFromEvent, actions]);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isDrawingRef.current) return;
    
    const point = getPointFromEvent(event);
    actions.continueDrawing(point);
  }, [getPointFromEvent, actions]);

  const handleMouseUp = useCallback(() => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      actions.stopDrawing();
    }
  }, [actions]);

  const handleMouseLeave = useCallback(() => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      actions.stopDrawing();
    }
  }, [actions]);

  // Touch events for mobile support
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    const touch = event.touches[0];
    const point = {
      x: touch.clientX,
      y: touch.clientY,
    };
    const syntheticEvent = {
      clientX: point.x,
      clientY: point.y,
    } as React.MouseEvent;
    handleMouseDown(syntheticEvent);
  }, [handleMouseDown]);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    const touch = event.touches[0];
    const point = {
      x: touch.clientX,
      y: touch.clientY,
    };
    const syntheticEvent = {
      clientX: point.x,
      clientY: point.y,
    } as React.MouseEvent;
    handleMouseMove(syntheticEvent);
  }, [handleMouseMove]);

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    handleMouseUp();
  }, [handleMouseUp]);

  const handleTextSubmit = useCallback(() => {
    if (textInput.trim() && textInputPosition) {
      actions.addText(textInput, textInputPosition);
      setTextInput('');
    }
  }, [textInput, textInputPosition, actions]);

  const handleTextCancel = useCallback(() => {
    actions.cancelTextInput();
    setTextInput('');
  }, [actions]);

  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        className="w-full h-full cursor-crosshair touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `scale(${state.zoom}) translate(${state.pan.x}px, ${state.pan.y}px)`,
          transformOrigin: 'top left',
        }}
      />
      
      {/* Text Input Modal */}
      {isTextInputActive && textInputPosition && (
        <div
          className="absolute bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-10"
          style={{
            left: `${textInputPosition.x / state.zoom + state.pan.x}px`,
            top: `${textInputPosition.y / state.zoom + state.pan.y}px`,
            transform: `scale(${1 / state.zoom})`,
            transformOrigin: 'top left',
          }}
        >
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Enter text..."
            className="w-64 h-20 p-2 border border-gray-200 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleTextSubmit();
              } else if (e.key === 'Escape') {
                handleTextCancel();
              }
            }}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleTextSubmit}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Add Text
            </button>
            <button
              onClick={handleTextCancel}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhiteboardCanvas;
