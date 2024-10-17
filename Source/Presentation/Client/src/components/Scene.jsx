import { Robot } from "../objects/Robot";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Base, Floor, Walls } from "./LoadObject";

const FullCanvasStyle = Object.freeze({
  top: "0",
  left: "0",
  width: "99.5vw",
  height: "99.5vh",
  position: "absolute",
  border: "2px dotted black",
});

const Scene = () => {
  return (
    <Canvas
      className="cursor-pointer"
      frameloop="demand"
      camera={{ position: [-12, 12, 12], fov: 45 }}
      style={FullCanvasStyle}
    >
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} intensity={100} />
      <OrbitControls autoRotate={true} enableZoom={true} enablePan={true} />

      <Robot initPosition={[4, 0, 4]} name="Robot2" />
      <Robot initPosition={[4, 0, -4]} name="Robot3" />
      <Robot initPosition={[-4, 0, 4]} name="Robot4" />
      <Robot initPosition={[-4, 0, -4]} />
      <Robot initPosition={[8, 0, 8]} name="Robot2" />
      <Robot initPosition={[8, 0, -8]} name="Robot3" />
      <Robot initPosition={[-8, 0, 8]} name="Robot4" />
      <Robot initPosition={[-8, 0, -8]} />

      <Base initPosition={[0, 0, -18]} initRotation={[0, -Math.PI / 2, 0]} />
      <Base initPosition={[-18, 0, 0]} initRotation={[0, 0, 0]} />
      <Base initPosition={[0, 0, 18]} initRotation={[0, Math.PI / 2, 0]} />
      <Base initPosition={[18, 0, 0]} initRotation={[0, Math.PI, 0]} />

      <Robot initPosition={[0, 0, 0]} isManual={true}/>

      <Walls />
      <Floor />
    </Canvas>
  );
};

export default Scene;
