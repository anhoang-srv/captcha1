import { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/catchDucksBlock.css';

const NUM_DUCKS = 9;
const CAPTCHA_WIDTH = 400; // The fixed width of the captcha block
const CAPTCHA_HEIGHT = 580; // The fixed height of the captcha block
const DUCK_SPEED = 5; // Increased speed for better responsiveness
const MIN_SPEED = 2.5; // Higher minimum speed for consistent movement
const MAX_SPEED = 8; // Higher max speed for dynamic gameplay
const ANIMATION_SMOOTHNESS = 0.8; // Smoothness factor for interpolation

// Helper to generate a random position
const getRandomPosition = () => ({
  x: Math.random() * (window.innerWidth - 50),
  y: Math.random() * (window.innerHeight - 50),
});

// Helper to generate random velocity with minimum speed guarantee
const getRandomVelocity = () => {
  let dx = (Math.random() - 0.5) * DUCK_SPEED * 2;
  let dy = (Math.random() - 0.5) * DUCK_SPEED * 2;

  // Ensure minimum speed to prevent stationary ducks
  if (Math.abs(dx) < MIN_SPEED) {
    dx = dx >= 0 ? MIN_SPEED : -MIN_SPEED;
  }
  if (Math.abs(dy) < MIN_SPEED) {
    dy = dy >= 0 ? MIN_SPEED : -MIN_SPEED;
  }

  // Cap maximum speed for control
  dx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, dx));
  dy = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, dy));

  return { dx, dy };
};

// Helper to generate initial ducks
const generateDucks = () => {
  const initialDucks = [];
  const gridCells = [];
  const rows = 3;
  const cols = 3;

  // Create a full 3x3 grid for the background
  for (let i = 0; i < rows * cols; i++) {
    gridCells.push({ id: `grid-${i}` });
  }

  // Create a shuffled order for the ducks
  const orderNumbers = Array.from({ length: NUM_DUCKS }, (_, i) => i + 1).sort(() => Math.random() - 0.5);

  // Calculate the top-left offset of the captcha block on the screen
  const blockOffsetX = (window.innerWidth - CAPTCHA_WIDTH) / 2;
  const blockOffsetY = (window.innerHeight - CAPTCHA_HEIGHT) / 2;

  // Create 9 ducks and assign them to each home in the grid
  for (let i = 0; i < NUM_DUCKS; i++) {
    // Calculate home position relative to the captcha block, then add the screen offset
    const homeX_local = (i % cols) * (CAPTCHA_WIDTH / cols) + (CAPTCHA_WIDTH / cols / 2);
    const homeY_local = 100 + Math.floor(i / cols) * ((CAPTCHA_HEIGHT - 100) / rows) + ((CAPTCHA_HEIGHT - 100) / rows / 2);

    const velocity = getRandomVelocity();
    initialDucks.push({
      id: i,
      orderNumber: orderNumbers[i],
      ...getRandomPosition(),
      dx: velocity.dx,
      dy: velocity.dy,
      homeX: blockOffsetX + homeX_local,
      homeY: blockOffsetY + homeY_local,
      isCaught: false,
    });
  }
  return { initialDucks, gridCells };
};

const CatchDucksBlock = ({ onComplete, onFailure }) => {
  const [ducks, setDucks] = useState([]);

  const [gridCells, setGridCells] = useState([]);
  const [nextExpectedNumber, setNextExpectedNumber] = useState(1);
  const [failedDuckId, setFailedDuckId] = useState(null);
  const [clickedDucks, setClickedDucks] = useState(new Set()); // Track recently clicked ducks
  const requestRef = useRef();

  useEffect(() => {
    const { initialDucks, gridCells } = generateDucks();
    setDucks(initialDucks);
    setGridCells(gridCells);
  }, []);

  const gameLoop = useCallback(() => {
    setDucks(prevDucks => {
      const newDucks = prevDucks.map(duck => {
        if (duck.isCaught) {
          // Ultra-smooth home movement with easing
          const homeSpeed = 0.2;
          const newX = duck.x + (duck.homeX - duck.x) * homeSpeed;
          const newY = duck.y + (duck.homeY - duck.y) * homeSpeed;
          return { ...duck, x: newX, y: newY };
        } else {
          // Ultra-smooth movement with enhanced collision handling
          let newX = duck.x + duck.dx * ANIMATION_SMOOTHNESS;
          let newY = duck.y + duck.dy * ANIMATION_SMOOTHNESS;
          let newDx = duck.dx;
          let newDy = duck.dy;
          let newRotation = duck.rotation || 0;

          // Enhanced boundary collision with smart randomization
          const margin = 50;
          const bounceRandomness = 1.5;

          if (newX <= 0 || newX >= window.innerWidth - margin) {
            newDx = -newDx + (Math.random() - 0.5) * bounceRandomness;
            newRotation = Math.random() * 90 - 45; // More dynamic rotation
            newX = Math.max(margin/2, Math.min(window.innerWidth - margin/2, newX));

            // Ensure minimum speed with slight acceleration
            if (Math.abs(newDx) < MIN_SPEED) {
              newDx = (newDx >= 0 ? MIN_SPEED : -MIN_SPEED) * (1 + Math.random() * 0.3);
            }
          }

          if (newY <= 0 || newY >= window.innerHeight - margin) {
            newDy = -newDy + (Math.random() - 0.5) * bounceRandomness;
            newRotation = Math.random() * 90 - 45; // More dynamic rotation
            newY = Math.max(margin/2, Math.min(window.innerHeight - margin/2, newY));

            // Ensure minimum speed with slight acceleration
            if (Math.abs(newDy) < MIN_SPEED) {
              newDy = (newDy >= 0 ? MIN_SPEED : -MIN_SPEED) * (1 + Math.random() * 0.3);
            }
          }

          // Smart speed capping with momentum preservation
          const currentSpeed = Math.sqrt(newDx * newDx + newDy * newDy);
          if (currentSpeed > MAX_SPEED) {
            const ratio = MAX_SPEED / currentSpeed;
            newDx *= ratio;
            newDy *= ratio;
          }

          // Add subtle speed variation for more natural movement
          newDx *= (0.98 + Math.random() * 0.04);
          newDy *= (0.98 + Math.random() * 0.04);

          return { ...duck, x: newX, y: newY, dx: newDx, dy: newDy, rotation: newRotation };
        }
      });
      return newDucks;
    });
    requestRef.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Add focus and blur handlers to maintain animation during context menu
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !requestRef.current) {
        // Resume animation if page becomes visible again
        requestRef.current = requestAnimationFrame(gameLoop);
      }
    };

    const handleFocus = () => {
      // Resume animation when window regains focus
      if (!requestRef.current) {
        requestRef.current = requestAnimationFrame(gameLoop);
      }
    };

    const handleBlur = () => {
      // Keep animation running even when window loses focus
      // This prevents context menu from stopping animation
      if (!requestRef.current) {
        requestRef.current = requestAnimationFrame(gameLoop);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [gameLoop]);

  const handleDuckClick = useCallback((event, clickedDuck) => {
    // Only handle left-click (button 0), ignore right-click and other buttons
    if (event.button !== 0) return;

    // Prevent multiple clicks on same duck or if duck is already caught
    if (clickedDucks.has(clickedDuck.id) || clickedDuck.isCaught) return;

    if (clickedDuck.orderNumber === nextExpectedNumber) {
      // Add to clicked ducks to prevent double-click on same duck
      setClickedDucks(prev => new Set([...prev, clickedDuck.id]));

      // Correct click
      const newDucks = ducks.map(duck =>
        duck.id === clickedDuck.id ? { ...duck, isCaught: true } : duck
      );
      setDucks(newDucks);

      const nextNum = nextExpectedNumber + 1;
      setNextExpectedNumber(nextNum);

      if (nextNum > NUM_DUCKS) {
        // All ducks caught in order - WIN
        setTimeout(() => onComplete(), 1000);
      } else {
        // Clear clicked duck after short delay to allow other clicks
        setTimeout(() => {
          setClickedDucks(prev => {
            const newSet = new Set(prev);
            newSet.delete(clickedDuck.id);
            return newSet;
          });
        }, 100); // Much shorter delay for better UX
      }
    } else {
      // Wrong click - LOSE
      setFailedDuckId(clickedDuck.id);
      setTimeout(() => {
        onFailure();
      }, 1500); // Wait 1.5s before triggering game over
    }
  }, [clickedDucks, nextExpectedNumber, ducks, onComplete, onFailure]);

  // Prevent context menu on ducks to avoid animation interruption
  const handleContextMenu = useCallback((event) => {
    event.preventDefault();
    return false;
  }, []);

  return (
    <>
      {/* Duck movement area - full screen */}
      <div className="ducks-movement-area">
        {ducks.map(duck => (
          <div
            key={duck.id}
            className={`duck ${duck.isCaught ? 'caught' : ''}`}
            onMouseDown={(event) => handleDuckClick(event, duck)}
            onContextMenu={handleContextMenu}
            style={{
              left: duck.x,
              top: duck.y,
              transform: `rotate(${duck.rotation || 0}deg)`,
              userSelect: 'none', // Prevent text selection
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none'
            }}
          >
            <img src="/assets/duck.png" alt="duck" />
            <span className="duck-number">{duck.orderNumber}</span>
            {failedDuckId === duck.id && <div className="fail-x"></div>}
          </div>
        ))}
      </div>

      {/* Visible captcha block - centered */}
      <div className="catch-ducks-block">
        <div className="catch-ducks-banner">
          <p>To verify you are a human, please</p>
          <h1>Select all ducks</h1>
        </div>
        <div className="catch-ducks-grid-container">
          <div className="duck-home-grid">
            {gridCells.map(cell => (
              <div key={cell.id} className="duck-home-cell"></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CatchDucksBlock;

