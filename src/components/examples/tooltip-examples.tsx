"use client";

import React from "react";
import { Tooltip } from "@/modules/tooltip";

export const TooltipExamples = () => {
  return (
    <div
      style={{
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <h1>Tooltip Examples</h1>

      <div style={{ display: "flex", gap: "1rem" }}>
        <h2>Basic Tooltip</h2>
        <Tooltip content="This is a basic tooltip">
          <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
            Hover me
          </button>
        </Tooltip>
      </div>

      <div>
        <h2>Tooltip Placements</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Tooltip content="Top tooltip" placement="top">
            <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
              Top
            </button>
          </Tooltip>

          <Tooltip content="Bottom tooltip" placement="bottom">
            <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
              Bottom
            </button>
          </Tooltip>

          <Tooltip content="Left tooltip" placement="left">
            <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
              Left
            </button>
          </Tooltip>

          <Tooltip content="Right tooltip" placement="right">
            <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
              Right
            </button>
          </Tooltip>
        </div>
      </div>

      <div>
        <h2>Tooltip Variants</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Tooltip content="Primary tooltip" variant="primary">
            <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
              Primary
            </button>
          </Tooltip>

          <Tooltip content="Info tooltip" variant="info">
            <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
              Info
            </button>
          </Tooltip>

          <Tooltip content="Success tooltip" variant="success">
            <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
              Success
            </button>
          </Tooltip>

          <Tooltip content="Warning tooltip" variant="warning">
            <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
              Warning
            </button>
          </Tooltip>

          <Tooltip content="Danger tooltip" variant="danger">
            <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
              Danger
            </button>
          </Tooltip>
        </div>
      </div>

      <div>
        <h2>Tooltip with Rich Content</h2>
        <Tooltip
          content={
            <div>
              <h3 style={{ margin: "0 0 0.5rem 0" }}>Rich Content</h3>
              <p style={{ margin: "0" }}>This tooltip has rich HTML content</p>
            </div>
          }
          maxWidth={300}
        >
          <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
            Hover for rich content
          </button>
        </Tooltip>
      </div>

      <div>
        <h2>Tooltip with Custom Animation</h2>
        <Tooltip
          content="This tooltip has a custom animation"
          animationEffect="scale"
          animationDuration={300}
        >
          <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
            Custom Animation
          </button>
        </Tooltip>
      </div>
    </div>
  );
};
