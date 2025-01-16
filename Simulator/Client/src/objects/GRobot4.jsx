import { useFrame } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { Motor, Part } from "./Part";

export const GRobot4 = ({ position = [0, 0.5, 0] }) => {
  useFrame(() => {});

  const [angle, setAngle] = useState(0);
  const [scale, setScale] = useState(0.8);

  useEffect(() => {
    let i = setInterval(() => {
      setAngle(angle + 0.1);
    }, 30);

    return () => clearInterval(i);
  });

  return (
    <>
      <group position={position}>
        <Part name={"Base1"}>
          <Part name={"Base1"}>
            <Motor
              rotation={[0, 0, Math.PI / 2]}
              position={[0, 0.6, 0]}
              angle={angle}
              childScale={scale}
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
                  childScale={scale}
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
                      childScale={scale}
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
                          childScale={scale}
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
                              childScale={scale}
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
                                  childScale={scale}
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
                                      childScale={scale}
                                    ></Motor>
                                  </Part>
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
            </Motor>
          </Part>

          <Motor
            rotation={[0, Math.PI / 2, 0]}
            position={[0, 0, -1.1]}
            angle={-angle}
          >
            <Part
              name={"Wheel1"}
              position={[0.34, 0, 0]}
              rotation={[0, 0, -Math.PI / 2]}
            ></Part>
          </Motor>
          <Motor
            rotation={[0, -Math.PI / 2, 0]}
            position={[0, 0, 1.1]}
            angle={angle}
          >
            <Part
              name={"Wheel1"}
              position={[0.34, 0, 0]}
              rotation={[0, 0, -Math.PI / 2]}
            ></Part>
          </Motor>
          <Motor rotation={[0, 0, 0]} position={[1.1, 0, 0]}>
            <Part name={"Base1"} position={[1.1, 0, 0]}>
              <Motor
                rotation={[0, Math.PI / 2, 0]}
                position={[0, 0, -1.1]}
                angle={-angle}
              >
                <Part
                  name={"Wheel1"}
                  position={[0.34, 0, 0]}
                  rotation={[0, 0, -Math.PI / 2]}
                ></Part>
              </Motor>
              <Motor
                rotation={[0, -Math.PI / 2, 0]}
                position={[0, 0, 1.1]}
                angle={angle}
              >
                <Part
                  name={"Wheel1"}
                  position={[0.34, 0, 0]}
                  rotation={[0, 0, -Math.PI / 2]}
                ></Part>
              </Motor>
            </Part>
          </Motor>
        </Part>
      </group>
    </>
  );
};
