"use client";

import React, { useState } from "react";
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent, 
  AnimationEffect,
  PopoverPlacement
} from "@/modules/popover";
import Link from "next/link";

export default function PopoverAnimationExample() {
  const [selectedEffect, setSelectedEffect] = useState<AnimationEffect>("fade");
  const [animationDuration, setAnimationDuration] = useState(200);
  
  // Group animation effects by type
  const animationEffectGroups = {
    "Fade": ["fade"] as AnimationEffect[],
    "Scale": ["scale", "scale-subtle", "scale-extreme"] as AnimationEffect[],
    "Shift Away": ["shift-away", "shift-away-subtle", "shift-away-extreme"] as AnimationEffect[],
    "Shift Toward": ["shift-toward", "shift-toward-subtle", "shift-toward-extreme"] as AnimationEffect[],
    "Perspective": ["perspective", "perspective-subtle", "perspective-extreme"] as AnimationEffect[],
  };
  
  // Flatten the animation effects for the dropdown
  const allAnimationEffects = Object.values(animationEffectGroups).flat();

  return (
    <div className="space-y-12 p-8">
      <div className="mb-4">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Popover Animation Effects</h1>
      
      {/* Animation Controls */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Animation Controls</h2>
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6">
          <div>
            <label className="block text-sm font-medium mb-2">Animation Effect</label>
            <select 
              value={selectedEffect}
              onChange={(e) => setSelectedEffect(e.target.value as AnimationEffect)}
              className="px-3 py-2 border rounded-md w-full"
            >
              {allAnimationEffects.map(effect => (
                <option key={effect} value={effect}>
                  {effect.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Animation Duration (ms)</label>
            <input 
              type="range" 
              min="0" 
              max="500" 
              step="50"
              value={animationDuration}
              onChange={(e) => setAnimationDuration(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-center mt-1">{animationDuration}ms</div>
          </div>
        </div>
      </section>
      
      {/* Animation Examples */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Animation Examples</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Top Placement */}
          <div className="flex flex-col items-center justify-end h-40 border rounded-md p-4">
            <Popover 
              placement="top" 
              animationEffect={selectedEffect}
              animationDuration={animationDuration}
            >
              <PopoverTrigger asChild>
                <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                  Top
                </button>
              </PopoverTrigger>
              <PopoverContent arrow>
                <div className="p-3">
                  <p className="font-medium">Top Placement</p>
                  <p className="text-sm text-gray-600">Animation: {selectedEffect}</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Right Placement */}
          <div className="flex items-center justify-start h-40 border rounded-md p-4">
            <Popover 
              placement="right" 
              animationEffect={selectedEffect}
              animationDuration={animationDuration}
            >
              <PopoverTrigger asChild>
                <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                  Right
                </button>
              </PopoverTrigger>
              <PopoverContent arrow>
                <div className="p-3">
                  <p className="font-medium">Right Placement</p>
                  <p className="text-sm text-gray-600">Animation: {selectedEffect}</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Bottom Placement */}
          <div className="flex flex-col items-center justify-start h-40 border rounded-md p-4">
            <Popover 
              placement="bottom" 
              animationEffect={selectedEffect}
              animationDuration={animationDuration}
            >
              <PopoverTrigger asChild>
                <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                  Bottom
                </button>
              </PopoverTrigger>
              <PopoverContent arrow>
                <div className="p-3">
                  <p className="font-medium">Bottom Placement</p>
                  <p className="text-sm text-gray-600">Animation: {selectedEffect}</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Left Placement */}
          <div className="flex items-center justify-end h-40 border rounded-md p-4">
            <Popover 
              placement="left" 
              animationEffect={selectedEffect}
              animationDuration={animationDuration}
            >
              <PopoverTrigger asChild>
                <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                  Left
                </button>
              </PopoverTrigger>
              <PopoverContent arrow>
                <div className="p-3">
                  <p className="font-medium">Left Placement</p>
                  <p className="text-sm text-gray-600">Animation: {selectedEffect}</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </section>
      
      {/* Animation Effect Comparison by Groups */}
      {Object.entries(animationEffectGroups).map(([groupName, effects]) => (
        <section key={groupName} className="space-y-6 mt-12">
          <h2 className="text-xl font-semibold mb-4">{groupName} Animations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {effects.map((effect) => (
              <div key={effect} className="flex flex-col items-center space-y-4 border rounded-md p-4">
                <h3 className="font-medium text-lg capitalize">
                  {effect.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </h3>
                
                <Popover 
                  placement="bottom" 
                  animationEffect={effect}
                  animationDuration={animationDuration}
                >
                  <PopoverTrigger asChild>
                    <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                      Try Effect
                    </button>
                  </PopoverTrigger>
                  <PopoverContent arrow>
                    <div className="p-3">
                      <p className="font-medium capitalize">
                        {effect.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </p>
                      <p className="text-sm text-gray-600">Duration: {animationDuration}ms</p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ))}
          </div>
        </section>
      ))}
      
      {/* Interactive Playground */}
      <section className="space-y-6 mt-12">
        <h2 className="text-xl font-semibold mb-4">Interactive Playground</h2>
        <div className="p-6 border rounded-lg bg-gray-50">
          <div className="flex flex-wrap gap-4 justify-center">
            {(["top", "right", "bottom", "left"] as PopoverPlacement[]).map((placement) => (
              <Popover 
                key={placement}
                placement={placement}
                animationEffect={selectedEffect}
                animationDuration={animationDuration}
              >
                <PopoverTrigger asChild>
                  <button className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors">
                    {placement.charAt(0).toUpperCase() + placement.slice(1)}
                  </button>
                </PopoverTrigger>
                <PopoverContent arrow>
                  <div className="p-4 max-w-xs">
                    <h3 className="font-medium text-lg mb-2">
                      {selectedEffect.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </h3>
                    <p className="text-sm text-gray-600">
                      This popover demonstrates the {selectedEffect} animation effect with a {animationDuration}ms duration.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}