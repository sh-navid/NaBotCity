import { useFrame } from "@react-three/fiber";
import { Motor, Part } from "./Part";
import { useEffect, useState } from "react";

export const GRobot2 = ({position=[0, 0.5, 0]}) => {
  useFrame(() => {});

  const [angle, setAngle] = useState(0);

  useEffect(() => {
    let i = setInterval(() => {
      setAngle(angle + 0.01);
    }, 30);

    return () => clearInterval(i);
  });

  return (
    <>
      <group position={position}>
        <Part name={"Base1"}>
          <Motor
            rotation={[0, 0, Math.PI / 2]}
            position={[0, 0.6, 0]}
            angle={angle}
          >
            <Part
              name={"Base2"}
              position={[0.6, 0, 0]}
              rotation={[0, 0, -Math.PI / 2]}
            >
              <Motor
                rotation={[Math.PI / 2, 0, 0]}
                position={[1.1, 0, 0]}
                angle={angle}
                childScale={.7}
              >
                <Part
                  name={"Base3"}
                  position={[0.6, 0, 0]}
                  rotation={[0, 0, -Math.PI / 2]}
                >
                  <Motor
                    rotation={[Math.PI / 2, 0, 0]}
                    position={[1.1, 0, 0]}
                    angle={angle}
                    childScale={.7}
                  >
                    <Part
                      name={"Base3"}
                      position={[0.6, 0, 0]}
                      rotation={[0, 0, -Math.PI / 2]}
                    >
                      <Motor
                        rotation={[Math.PI / 2, 0, 0]}
                        position={[1.1, 0, 0]}
                        angle={angle}
                      >
                        <Part
                          name={"Base3"}
                          position={[0.6, 0, 0]}
                          rotation={[0, 0, -Math.PI / 2]}
                        >
                          <Motor
                            rotation={[Math.PI / 2, 0, 0]}
                            position={[1.1, 0, 0]}
                            angle={angle}
                          >
                          </Motor>
                        </Part>
                      </Motor>
                    </Part>
                  </Motor>
                </Part>
              </Motor>
              <Motor
                rotation={[Math.PI/2, Math.PI, 0]}
                position={[-1.1, 0, 0]}
                angle={angle}
                childScale={.7}
              >
                <Part
                  name={"Base3"}
                  position={[0.6, 0, 0]}
                  rotation={[0, 0, -Math.PI / 2]}
                >
                  <Motor
                    rotation={[Math.PI / 2, 0, 0]}
                    position={[1.1, 0, 0]}
                    angle={angle}
                    childScale={.7}
                  >
                    <Part
                      name={"Base3"}
                      position={[0.6, 0, 0]}
                      rotation={[0, 0, -Math.PI / 2]}
                    >
                      <Motor
                        rotation={[Math.PI / 2, 0, 0]}
                        position={[1.1, 0, 0]}
                        angle={angle}
                      >
                        <Part
                          name={"Base3"}
                          position={[0.6, 0, 0]}
                          rotation={[0, 0, -Math.PI / 2]}
                        >
                          <Motor
                            rotation={[Math.PI / 2, 0, 0]}
                            position={[1.1, 0, 0]}
                            angle={angle}
                          >
                          </Motor>
                        </Part>
                      </Motor>
                    </Part>
                  </Motor>
                </Part>
              </Motor>
            </Part>
          </Motor>
        </Part>
      </group>
    </>
  );
};
