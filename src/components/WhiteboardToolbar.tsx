'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Pen, 
  Eraser, 
  Type, 
  Square, 
  Circle, 
  Minus, 
  ArrowRight,
  MousePointer,
  Undo,
  Download,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { DrawingTool, ExportFormat } from '@/types/whiteboard';
import { useWhiteboardContext } from '@/contexts/WhiteboardContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface WhiteboardToolbarProps {
  onExport: (format: ExportFormat) => void;
  className?: string;
}

const tools: Array<{ tool: DrawingTool; icon: React.ReactNode; label: string }> = [
  { tool: 'select', icon: <MousePointer size={18} />, label: 'Select' },
  { tool: 'pen', icon: <Pen size={18} />, label: 'Pen' },
  { tool: 'eraser', icon: <Eraser size={18} />, label: 'Eraser' },
  { tool: 'text', icon: <Type size={18} />, label: 'Text' },
  { tool: 'rectangle', icon: <Square size={18} />, label: 'Rectangle' },
  { tool: 'circle', icon: <Circle size={18} />, label: 'Circle' },
  { tool: 'line', icon: <Minus size={18} />, label: 'Line' },
  { tool: 'arrow', icon: <ArrowRight size={18} />, label: 'Arrow' },
];

const colors = [
  '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB'
];

const strokeWidths = [1, 2, 4, 6, 8, 12];

export const WhiteboardToolbar: React.FC<WhiteboardToolbarProps> = ({ 
  onExport, 
  className = '' 
}) => {
  const { state, actions } = useWhiteboardContext();

  return (
    <div className={`flex items-center gap-2 p-4 bg-white border-b shadow-sm ${className}`}>
      {/* Tool Selection */}
      <div className="flex items-center gap-1">
        {tools.map(({ tool, icon, label }) => (
          <Button
            key={tool}
            variant={state.currentTool === tool ? 'default' : 'ghost'}
            size="sm"
            onClick={() => actions.setTool(tool)}
            title={label}
            className="h-10 w-10 p-0"
          >
            {icon}
          </Button>
        ))}
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Color Picker */}
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium mr-2">Color:</span>
        {colors.map((color) => (
          <button
            key={color}
            className={`w-8 h-8 rounded border-2 ${
              state.currentColor === color ? 'border-gray-800' : 'border-gray-300'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => actions.setColor(color)}
            title={color}
          />
        ))}
        <input
          type="color"
          value={state.currentColor}
          onChange={(e) => actions.setColor(e.target.value)}
          className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
          title="Custom color"
        />
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Stroke Width */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Size:</span>
        <div className="flex items-center gap-1">
          {strokeWidths.map((width) => (
            <Button
              key={width}
              variant={state.currentStrokeWidth === width ? 'default' : 'ghost'}
              size="sm"
              onClick={() => actions.setStrokeWidth(width)}
              className="h-8 w-8 p-0"
              title={`${width}px`}
            >
              <div
                className="rounded-full bg-current"
                style={{
                  width: `${Math.min(width * 2, 16)}px`,
                  height: `${Math.min(width * 2, 16)}px`,
                }}
              />
            </Button>
          ))}
        </div>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={actions.undo}
          title="Undo"
          className="h-10 w-10 p-0"
        >
          <Undo size={18} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={actions.clearCanvas}
          title="Clear Canvas"
          className="h-10 w-10 p-0"
        >
          <Trash2 size={18} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => actions.setZoom(state.zoom + 0.1)}
          title="Zoom In"
          className="h-10 w-10 p-0"
        >
          <ZoomIn size={18} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => actions.setZoom(state.zoom - 0.1)}
          title="Zoom Out"
          className="h-10 w-10 p-0"
        >
          <ZoomOut size={18} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => actions.setZoom(1)}
          title="Reset Zoom"
          className="h-10 w-10 p-0"
        >
          <RotateCcw size={18} />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Export */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Download size={18} />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onExport('png')}>
            Export as PNG
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport('jpeg')}>
            Export as JPEG
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport('svg')}>
            Export as SVG
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Zoom Display */}
      <div className="ml-auto text-sm text-gray-600">
        Zoom: {Math.round(state.zoom * 100)}%
      </div>
    </div>
  );
};

export default WhiteboardToolbar;
