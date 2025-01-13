import React from "react";

const Box = ({ color = "blue", size = 1, position = [0, 0, 0] }, ref) => {
  return (
    <>
      <mesh position={position} ref={ref}>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial color={color} opacity={1} />
      </mesh>
    </>
  );
};

export default React.forwardRef(Box);
