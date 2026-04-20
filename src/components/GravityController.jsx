import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

const GravityController = ({ triggerId }) => {
  const [isActive, setIsActive] = useState(false);
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);

  const startAntiGravity = () => {
    if (isActive) return;
    setIsActive(true);

    // 1. Setup Matter.js
    const Engine = Matter.Engine,
          Render = Matter.Render,
          World = Matter.World,
          Bodies = Matter.Bodies,
          Mouse = Matter.Mouse,
          MouseConstraint = Matter.MouseConstraint,
          Composite = Matter.Composite,
          Runner = Matter.Runner;

    const engine = Engine.create();
    engineRef.current = engine;
    engine.world.gravity.y = 0; // ZERO GRAVITY (Anti-Gravity)
    engine.world.gravity.x = 0;

    // 2. Find all elements we want to float
    const elements = document.querySelectorAll('.physics-item');
    const bodies = [];

    // 3. Create boundaries (Walls) so things don't fly off screen
    const width = window.innerWidth;
    const height = window.innerHeight;
    const wallOptions = { isStatic: true, render: { visible: false } };
    
    World.add(engine.world, [
      Bodies.rectangle(width / 2, -50, width, 100, wallOptions), // Top
      Bodies.rectangle(width / 2, height + 50, width, 100, wallOptions), // Bottom
      Bodies.rectangle(width + 50, height / 2, 100, height, wallOptions), // Right
      Bodies.rectangle(-50, height / 2, 100, height, wallOptions) // Left
    ]);

    // 4. Convert DOM elements to Physics Bodies
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      
      // Create a body at the element's current position
      const body = Bodies.rectangle(
        rect.left + rect.width / 2, 
        rect.top + rect.height / 2, 
        rect.width, 
        rect.height, 
        { 
          restitution: 0.9, // Bouncy
          frictionAir: 0.02, // Floating resistance
          density: 0.05
        }
      );

      // Save reference to DOM element inside the body
      body.domElement = el;
      bodies.push(body);

      // FREEZE the DOM element in place visually, then detach it
      el.style.position = 'absolute';
      el.style.left = '0px';
      el.style.top = '0px';
      el.style.width = `${rect.width}px`;
      el.style.height = `${rect.height}px`;
      el.style.margin = '0';
      el.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
      el.style.zIndex = '1000'; // Bring to front
    });

    World.add(engine.world, bodies);

    // 5. Add Mouse Control (So you can throw them)
    const mouse = Mouse.create(document.body);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    World.add(engine.world, mouseConstraint);

    // 6. The Update Loop (Sync Physics -> DOM)
    const runner = Runner.create();
    runnerRef.current = runner;
    
    Matter.Events.on(engine, 'afterUpdate', () => {
      bodies.forEach((body) => {
        if (body.domElement) {
          const { x, y } = body.position;
          const angle = body.angle;
          // Apply physics position to CSS
          body.domElement.style.transform = `translate(${x - body.domElement.offsetWidth / 2}px, ${y - body.domElement.offsetHeight / 2}px) rotate(${angle}rad)`;
        }
      });
    });

    Runner.run(runner, engine);
  };

  // Listen for the trigger click
  useEffect(() => {
    const btn = document.getElementById(triggerId);
    if (btn) {
      btn.addEventListener('click', startAntiGravity);
    }
    return () => {
      if (btn) btn.removeEventListener('click', startAntiGravity);
      // Cleanup physics if unmounting (optional)
    };
  }, [triggerId, isActive]);

  return (
    <div className="fixed top-4 right-4 z-[60] hidden md:block">
       {isActive && (
         <button 
           onClick={() => window.location.reload()} 
           className="bg-red-600 text-white px-4 py-2 text-xs uppercase tracking-widest rounded hover:bg-red-700"
         >
           Reset Gravity
         </button>
       )}
    </div>
  );
};

export default GravityController;