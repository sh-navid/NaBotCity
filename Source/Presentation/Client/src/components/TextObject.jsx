import { forwardRef } from "react";
import { Text } from "@react-three/drei";

// FIXME: Change this to tsx
export const TextObject = forwardRef(
  ({ children, position = [0, 0, 0], fontSize = 0.3 }, ref) => {
    return (
      <Text
        ref={ref}
        color="blue"
        anchorX="center"
        anchorY="middle"
        fontSize={fontSize}
        position={position}
        rotation={[-Math.PI / 2, 0, -Math.PI]}
      >
        {children}
      </Text>
    );
  }
);
