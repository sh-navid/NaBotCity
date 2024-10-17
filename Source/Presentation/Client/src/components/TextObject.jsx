import { forwardRef } from "react";
import { Text } from "@react-three/drei";

// FIXME: Change this to tsx
export const TextObject = forwardRef(({ children }, ref) => {
  return (
    <Text
      ref={ref}
      fontSize={0.5}
      color="black"
      anchorX="center"
      anchorY="middle"
      rotation={[-1.5, 0, 0]}
    >
      {children}
    </Text>
  );
});
