import * as THREE from "three";
import { useEffect, useRef } from "react";

export const Boxes = ({ positions }) => {
  const ref = useRef();
  const tmp = new THREE.Object3D();
  const instancesToShow = 9000;

  useEffect(() => {
    let c = positions.length;
    if (c > instancesToShow) c = instancesToShow;
    for (let i = 0; i < c; i++) {
      tmp.position.set(positions[i].x, positions[i].y, positions[i].z);
      
      // tmp.meshLambertMaterial.color="green"
      
      tmp.updateMatrix();
      ref.current.setMatrixAt(i, tmp.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;

    console.log(positions.length)
  }, [positions]);

const size=0.04;


  return (
    // To show just first `instancesToShow` points
    <instancedMesh ref={ref} args={[null, null, instancesToShow]}>
      <boxGeometry args={[size, size, size]} />
      <meshLambertMaterial color="purple" />
    </instancedMesh>
  );
};
