'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const brushColors = [
  '#C9A227', '#2DD4BF', '#F472B6', '#A78BFA', '#FB923C',
  '#EF4444', '#22C55E', '#3B82F6', '#F59E0B', '#EC4899',
  '#8B5CF6', '#14B8A6', '#000000', '#6366F1', '#84CC16',
];

const brushSizes = [
  { id: 'small', size: 3, label: 'S' },
  { id: 'medium', size: 6, label: 'M' },
  { id: 'large', size: 12, label: 'L' },
];

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#C9A227');
  const [selectedSize, setSelectedSize] = useState(6);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    
    // Fill white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top,
    };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPos(e);
    lastPosRef.current = pos;
    
    // Draw a dot
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, selectedSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = tool === 'eraser' ? '#FFFFFF' : selectedColor;
    ctx.fill();
  }, [selectedColor, selectedSize, tool, getPos]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const pos = getPos(e);
    const lastPos = lastPosRef.current;
    
    if (lastPos) {
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : selectedColor;
      ctx.lineWidth = selectedSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
    
    lastPosRef.current = pos;
  }, [isDrawing, selectedColor, selectedSize, tool, getPos]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    lastPosRef.current = null;
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 bg-muted/50 rounded-xl p-2">
        {/* Tool selection */}
        <div className="flex gap-1">
          <button
            onClick={() => setTool('brush')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              tool === 'brush' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-card border border-border'
            }`}
          >
            🖌️ Pinceau
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              tool === 'eraser' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-card border border-border'
            }`}
          >
            🧹 Gomme
          </button>
        </div>
        
        {/* Brush size */}
        <div className="flex gap-1">
          {brushSizes.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSize(s.size)}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                selectedSize === s.size ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Color palette */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {brushColors.map(color => (
          <button
            key={color}
            onClick={() => { setSelectedColor(color); setTool('brush'); }}
            className={`w-7 h-7 rounded-full border-2 transition-transform ${
              selectedColor === color && tool === 'brush' ? 'border-foreground scale-125 shadow-md' : 'border-transparent hover:scale-110'
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Couleur ${color}`}
          />
        ))}
      </div>

      {/* Canvas */}
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          className="w-full max-w-md aspect-[4/3] bg-white rounded-2xl border-2 border-border shadow-inner cursor-crosshair touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-center">
        <Button variant="outline" onClick={clearCanvas} size="sm">
          🗑️ Effacer tout
        </Button>
      </div>
    </div>
  );
}
