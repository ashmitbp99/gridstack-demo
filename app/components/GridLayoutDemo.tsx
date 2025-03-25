'use client';

import { useState } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import './GridLayoutDemo.css';

const generateLayout = (id: string, items: number): Layout[] => {
  return Array.from({ length: items }, (_, i) => ({
    i: `${id}-${i + 1}`,
    x: (i * 2) % 6,
    y: Math.floor(i / 3) * 2,
    w: 2,
    h: 2,
  }));
};

export default function GridLayoutDemo() {
  const [layouts, setLayouts] = useState({
    grid1: generateLayout('grid1', 2),
    grid2: generateLayout('grid2', 3),
  });

  const addItem = (gridId: 'grid1' | 'grid2') => {
    setLayouts(prev => ({
      ...prev,
      [gridId]: [
        ...prev[gridId],
        {
          i: `${gridId}-${prev[gridId].length + 1}`,
          x: (prev[gridId].length * 2) % 6,
          y: Infinity, // This will put it at the bottom
          w: 2,
          h: 2,
        },
      ],
    }));
  };

  const onLayoutChange = (gridId: 'grid1' | 'grid2', newLayout: Layout[]) => {
    setLayouts(prev => ({
      ...prev,
      [gridId]: newLayout,
    }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>React-Grid-Layout Demo</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => addItem('grid1')}>Add Item to Grid 1</button>
        <button onClick={() => addItem('grid2')}>Add Item to Grid 2</button>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <div className="grid-container">
            <GridLayout
              className="layout"
              layout={layouts.grid1}
              cols={6}
              rowHeight={50}
              width={500}
              onLayoutChange={(layout) => onLayoutChange('grid1', layout)}
              isDraggable
              isResizable
            >
              {layouts.grid1.map((item) => (
                <div key={item.i}>
                  {item.i}
                </div>
              ))}
            </GridLayout>
            <div className="layout-json">
              <pre>{JSON.stringify(layouts.grid1, null, 2)}</pre>
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div className="grid-container">
            <GridLayout
              className="layout"
              layout={layouts.grid2}
              cols={6}
              rowHeight={50}
              width={500}
              onLayoutChange={(layout) => onLayoutChange('grid2', layout)}
              isDraggable
              isResizable
            >
              {layouts.grid2.map((item) => (
                <div key={item.i}>
                  {item.i}
                </div>
              ))}
            </GridLayout>
            <div className="layout-json">
              <pre>{JSON.stringify(layouts.grid2, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}