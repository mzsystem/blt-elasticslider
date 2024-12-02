import React, { useState, useRef, useEffect } from 'react';

interface ElasticSliderProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  suffix?: string;
  min?: number;   // Added min range
  max?: number;   // Added max range
}

export function ElasticSlider({
  value,
  onChange,
  label,
  suffix = '',
  min = 0,  // Default min value is 0
  max = 100, // Default max value is 100
}: ElasticSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [stretch, setStretch] = useState(0);  // Stretch for visual effect
  const trackRef = useRef<HTMLDivElement>(null);

  // Handle pointer movement and stretch effect calculation
  const handlePointerMove = (clientX: number) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    // Clamp percentage to 0-100
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    // Calculate stretch
    let stretchAmount = 0;
    const stretchFactor = 3; // Adjust stretch sensitivity
    const maxStretch = 5;

    // Stretch logic
    if (percentage > 100) {
      stretchAmount = Math.max((100 - percentage) / stretchFactor, -maxStretch);
    } else if (percentage < 0) {
      stretchAmount = Math.min((0 - percentage) / stretchFactor, maxStretch);
    } else {
      stretchAmount = 0;
    }
    // Clamp the stretch to [-5, 5]
    setStretch(Math.max(-maxStretch, Math.min(maxStretch, stretchAmount)));

    // Update value, clamped to min-max range
    const newValue = Math.round(
      (clampedPercentage / 100) * (max - min) + min
    );
    onChange(newValue);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    handlePointerMove(e.clientX); // Initial call on pointer down
  };

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      handlePointerMove(e.clientX); // Continue handling movement
    };

    const handleUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setStretch(stretch); // Ensure stretch is reset on pointer release
      }
    };

    // Attach listeners for pointer movement and release
    if (isDragging) {
      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
      window.addEventListener('pointercancel', handleUp);
    }

    // Cleanup listeners
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
  }, [isDragging]);

  const percentValue = ((value - min) / (max - min)) * 100;

  // Handle input change from range slider
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    onChange(newValue);
  };

  return (
    <div className="w-full space-y-2 select-none touch-none">
      {label && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-white/80">{label}</span>
          <span className="text-white/60">
            {value}
            {suffix}
          </span>
        </div>
      )}
      <div
        className="relative py-2"
        style={{
          transform: stretch !== 0 ? `scaleX(${1 + Math.abs(stretch) / 100})` : 'scaleX(1)',
          transformOrigin: stretch > 0 ? 'right' : 'left',
          transition: 'transform 0.3s ease-out',  // Smooth transition
        }}
      >
        <div className="mx-2 p-1.5 rounded-2xl bg-white/10">
          <div
            ref={trackRef}
            className="relative h-12 rounded-xl bg-black/50 cursor-pointer overflow-visible"
            onPointerDown={handlePointerDown}
          >
            {/* Filled track */}
            <div
              className="absolute inset-y-0 left-0 bg-purple-500 rounded-xl"
              style={{
                width: `${percentValue}%`,
                transition: isDragging ? 'none' : 'width 0.3s ease-out',
              }}
            >
              {/* Right edge line */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white/50 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* range input */}
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        disabled
        onChange={handleInputChange}
        className="invisible"
      />
    </div>
  );
}
