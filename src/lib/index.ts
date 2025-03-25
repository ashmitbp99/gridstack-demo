import React, { ComponentProps, createContext, useContext, useEffect, useRef } from "react";
import { GridStack } from "gridstack";
import { createRoot } from "react-dom/client";

export type ComponentDataType<T> = {
  name: string;
  props: T;
};

export type ComponentMap = {
  [key: string]: React.ComponentType<any>;
};

type GridStackContextType = {
  grid: GridStack | null;
  initialOptions: any;
  addWidget: (fn: (id: string) => any) => void;
  addSubGrid: (fn: (id: string, withWidget: (widget: any) => any) => any) => void;
  saveOptions: () => any;
};

const GridStackContext = createContext<GridStackContextType>({
  grid: null,
  initialOptions: null,
  addWidget: () => {},
  addSubGrid: () => {},
  saveOptions: () => null,
});

export const useGridStackContext = () => useContext(GridStackContext);

export function GridStackProvider({
  children,
  initialOptions,
}: {
  children: React.ReactNode;
  initialOptions: any;
}) {
  const gridRef = useRef<GridStack | null>(null);
  const gridElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridElementRef.current && !gridRef.current) {
      gridRef.current = GridStack.init(initialOptions, gridElementRef.current);
    }
  }, [initialOptions]);

  const addWidget = (fn: (id: string) => any) => {
    if (gridRef.current) {
      const id = `item-${Date.now()}`;
      gridRef.current.addWidget(fn(id));
    }
  };

  const addSubGrid = (fn: (id: string, withWidget: (widget: any) => any) => any) => {
    if (gridRef.current) {
      const id = `sub-grid-${Date.now()}`;
      gridRef.current.addWidget(fn(id, (widget) => widget));
    }
  };

  const saveOptions = () => {
    if (gridRef.current) {
      return gridRef.current.save();
    }
    return null;
  };

  return (
    <GridStackContext.Provider
      value={{
        grid: gridRef.current,
        initialOptions,
        addWidget,
        addSubGrid,
        saveOptions,
      }}
    >
      <div ref={gridElementRef} className="grid-stack">
        {children}
      </div>
    </GridStackContext.Provider>
  );
}

export function GridStackRenderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export function GridStackRender({
  componentMap,
}: {
  componentMap: ComponentMap;
}) {
  const { grid } = useGridStackContext();

  useEffect(() => {
    if (!grid) return;

    const handleChange = () => {
      const nodes = grid.engine.nodes;
      nodes.forEach((node) => {
        if (node.el) {
          const content = node.el.getAttribute("data-gs-content");
          if (content) {
            try {
              const { name, props } = JSON.parse(content);
              const Component = componentMap[name];
              if (Component) {
                const container = node.el.querySelector(".grid-stack-item-content");
                if (container) {
                  container.innerHTML = "";
                  const root = document.createElement("div");
                  container.appendChild(root);
                  const reactRoot = createRoot(root);
                  reactRoot.render(<Component {...props} />);
                }
              }
            } catch (e) {
              console.error("Failed to parse content:", e);
            }
          }
        }
      });
    };

    grid.on("change", handleChange);
    handleChange();

    return () => {
      grid.off("change", handleChange);
    };
  }, [grid, componentMap]);

  return null;
} 