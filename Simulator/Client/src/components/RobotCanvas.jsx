import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { OrbitControls } from "@react-three/drei";

const FullCanvasStyle = Object.freeze({
  top: "0",
  left: "0",
  width: "99.5vw",
  height: "99.5vh",
  position: "absolute",
  border: "2px dotted black",
});

const RobotCanvas = ({ children, camPosition =[-12, 12, 12]}) => {
  return (
    <Canvas
      frameloop="demand"
      style={FullCanvasStyle}
      camera={{ position: camPosition, fov: 45 }}
    >
      <Physics debug={true} gravity={[0, -9.81, 0]}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} intensity={100} />
        <OrbitControls autoRotate={true} enableZoom={true} enablePan={true} />
        {children}
      </Physics>
    </Canvas>
  );
};

export default RobotCanvas;
