import { useState, useRef, useEffect } from 'react';
import { GripVertical, Maximize2, Minimize2 } from 'lucide-react';

interface ResizableContainerProps {
  children: React.ReactNode;
  onSizeChange: (width: number, height: number) => void;
  width?: number;
  height?: number;
}

export default function ResizableContainer({
  children,
  onSizeChange,
  width: externalWidth,
  height: externalHeight,
}: ResizableContainerProps) {
  const [width, setWidth] = useState(externalWidth ?? 400);
  const [height, setHeight] = useState(externalHeight ?? 600);
  const lastExternalWidth = useRef(externalWidth);
  const lastExternalHeight = useRef(externalHeight);

  const [isResizing, setIsResizing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);

  const minHeight = 400;
  const maxHeight = 1200;
  const maxWidth = 800;
  const minWidth = 320;

  // Sync with external width/height when provided (only when changed from parent)
  useEffect(() => {
    if (externalWidth !== undefined && externalWidth !== lastExternalWidth.current) {
      setWidth(externalWidth);
      lastExternalWidth.current = externalWidth;
    }
  }, [externalWidth]);

  useEffect(() => {
    if (externalHeight !== undefined && externalHeight !== lastExternalHeight.current) {
      setHeight(externalHeight);
      lastExternalHeight.current = externalHeight;
    }
  }, [externalHeight]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.width = `${width}px`;
      containerRef.current.style.height = `${height}px`;
    }
  }, [width, height]);

  // Don't use useEffect for onSizeChange - call it directly from handleMouseUp
  // to avoid infinite loops

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = width;
    const startHeight = height;
    let finalWidth = startWidth;
    let finalHeight = startHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      const newWidth = Math.min(Math.max(startWidth + deltaX, minWidth), maxWidth);
      const newHeight = Math.min(Math.max(startHeight + deltaY, minHeight), maxHeight);

      finalWidth = newWidth;
      finalHeight = newHeight;

      setWidth(newWidth);
      setHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';

      // Only save when user finishes dragging
      onSizeChange(finalWidth, finalHeight);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'nwse-resize';
  };

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: `${width}px`,
        height: isMinimized ? 'auto' : `${height}px`,
        minHeight: `${minHeight}px`,
        minWidth: `${minWidth}px`,
        position: 'relative',
        overflow: 'hidden',
        transition: isResizing ? 'none' : 'width 0.2s ease, height 0.2s ease',
      }}
    >
      {/* Resize handle */}
      <div
        ref={resizeHandleRef}
        onMouseDown={handleMouseDown}
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '20px',
          height: '20px',
          cursor: 'nwse-resize',
          background: 'linear-gradient(135deg, transparent 50%, rgba(37, 99, 235, 0.3) 50%)',
          borderRadius: '4px 0 0 12px',
          display: isMinimized ? 'none' : 'block',
        }}
        title="拖拽调整窗口大小"
      >
        <GripVertical
          style={{
            position: 'absolute',
            right: '4px',
            bottom: '4px',
            width: '12px',
            height: '12px',
            color: '#2563eb',
          }}
        />
      </div>

      {/* Minimize/Maximize button */}
      <button
        onClick={handleToggleMinimize}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          padding: '4px',
          borderRadius: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
        title={isMinimized ? '展开' : '收起'}
      >
        {isMinimized ? (
          <Maximize2 style={{ width: '16px', height: '16px', color: '#374151' }} />
        ) : (
          <Minimize2 style={{ width: '16px', height: '16px', color: '#374151' }} />
        )}
      </button>

      {/* Size indicator */}
      {!isMinimized && (
        <div
          style={{
            position: 'absolute',
            bottom: '4px',
            left: '8px',
            fontSize: '10px',
            color: 'rgba(55, 65, 81, 0.5)',
            pointerEvents: 'none',
          }}
        >
          {width} × {height}
        </div>
      )}

      {children}
    </div>
  );
}
