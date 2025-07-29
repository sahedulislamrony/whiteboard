/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Point {
  x: number;
  y: number;
}

export interface DrawingPath {
  id: string;
  points: Point[];
  color: string;
  strokeWidth: number;
  tool: DrawingTool;
  timestamp: number;
}

export interface WhiteboardElement {
  id: string;
  type: 'path' | 'text' | 'shape' | 'image';
  data: any;
  position: Point;
  timestamp: number;
}

export interface TextElement {
  id: string;
  text: string;
  position: Point;
  fontSize: number;
  color: string;
  fontFamily: string;
}

export interface ShapeElement {
  id: string;
  type: 'rectangle' | 'circle' | 'line' | 'arrow';
  position: Point;
  dimensions: { width: number; height: number };
  color: string;
  strokeWidth: number;
  fill?: string;
}

export type DrawingTool = 'pen' | 'eraser' | 'text' | 'rectangle' | 'circle' | 'line' | 'arrow' | 'select';

export type ExportFormat = 'png' | 'jpeg' | 'svg';

export interface WhiteboardState {
  elements: WhiteboardElement[];
  currentTool: DrawingTool;
  currentColor: string;
  currentStrokeWidth: number;
  isDrawing: boolean;
  selectedElement: string | null;
  zoom: number;
  pan: Point;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface WhiteboardSession {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  owner: User;
  collaborators: User[];
  isPublic: boolean;
}
