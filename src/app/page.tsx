"use client";

import React, { ComponentProps } from "react";
import { GridStackOptions } from "gridstack";
import {
  ComponentDataType,
  ComponentMap,
  GridStackProvider,
  GridStackRender,
  GridStackRenderProvider,
  useGridStackContext,
} from "@/lib";

import "gridstack/dist/gridstack-extra.css";
import "gridstack/dist/gridstack.css";

const CELL_HEIGHT = 50;
const BREAKPOINTS = [
  { c: 1, w: 700 },
  { c: 3, w: 850 },
  { c: 6, w: 950 },
  { c: 8, w: 1100 },
];

function Text({ content }: { content: string }) {
  return (
    <div className="w-full h-full p-4 bg-white rounded shadow">{content}</div>
  );
}

const COMPONENT_MAP: ComponentMap = {
  Text,
};

const gridOptions: GridStackOptions = {
  acceptWidgets: true,
  columnOpts: {
    breakpointForWindow: true,
    breakpoints: BREAKPOINTS,
    layout: "moveScale",
    columnMax: 12,
  },
  margin: 8,
  cellHeight: CELL_HEIGHT,
  subGridOpts: {
    acceptWidgets: true,
    columnOpts: {
      breakpoints: BREAKPOINTS,
      layout: "moveScale",
    },
    margin: 8,
    minRow: 2,
    cellHeight: CELL_HEIGHT,
  },
  children: [
    {
      id: "item1",
      h: 2,
      w: 2,
      x: 0,
      y: 0,
      content: JSON.stringify({
        name: "Text",
        props: { content: "Item 1" },
      } satisfies ComponentDataType<ComponentProps<typeof Text>>),
    },
    {
      id: "item2",
      h: 2,
      w: 2,
      x: 2,
      y: 0,
      content: JSON.stringify({
        name: "Text",
        props: { content: "Item 2" },
      }),
    },
  ],
};

function Toolbar() {
  const { addWidget, addSubGrid } = useGridStackContext();

  return (
    <div className="border border-gray-300 w-full p-4 mb-4 flex flex-row gap-4">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => {
          addWidget((id) => ({
            w: 2,
            h: 2,
            x: 0,
            y: 0,
            content: JSON.stringify({
              name: "Text",
              props: { content: id },
            }),
          }));
        }}
      >
        Add Text (2x2)
      </button>

      <button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={() => {
          addSubGrid((id, withWidget) => ({
            h: 5,
            noResize: false,
            sizeToContent: true,
            subGridOpts: {
              acceptWidgets: true,
              columnOpts: { breakpoints: BREAKPOINTS, layout: "moveScale" },
              margin: 8,
              minRow: 2,
              cellHeight: CELL_HEIGHT,
              children: [
                withWidget({
                  h: 1,
                  locked: true,
                  noMove: true,
                  noResize: true,
                  w: 12,
                  x: 0,
                  y: 0,
                  content: JSON.stringify({
                    name: "Text",
                    props: { content: "Sub Grid 1 Title" + id },
                  }),
                }),
              ],
            },
            w: 12,
            x: 0,
            y: 0,
          }));
        }}
      >
        Add Sub Grid (12x1)
      </button>
    </div>
  );
}

export default function Home() {
  const [initialOptions] = React.useState(gridOptions);

  return (
    <main className="p-8">
      <GridStackProvider initialOptions={initialOptions}>
        <Toolbar />
        <GridStackRenderProvider>
          <GridStackRender componentMap={COMPONENT_MAP} />
        </GridStackRenderProvider>
      </GridStackProvider>
    </main>
  );
}
