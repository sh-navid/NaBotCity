import { useFrame } from "@react-three/fiber";
import { Motor, Part } from "./Part";
import { useEffect, useState } from "react";

export const GRobot = ({position=[0, 0.5, 0]}) => {
  useFrame(() => {});

  const [angle, setAngle] = useState(0);
  const [scale, setScale] = useState(.925);

  useEffect(() => {
    let i = setInterval(() => {
      setAngle(angle + 0.03);
    }, 10);

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
                                                  rotation={[
                                                    0,
                                                    0,
                                                    -Math.PI / 2,
                                                  ]}
                                                >
                                                  <Motor
                                                    rotation={[
                                                      Math.PI / 2,
                                                      0,
                                                      0,
                                                    ]}
                                                    position={[1.1, 0, 0]}
                                                    angle={angle}
                                                    childScale={scale}
                                                  >
                                                    <Part
                                                      name={"Base3"}
                                                      position={[0.6, 0, 0]}
                                                      rotation={[
                                                        0,
                                                        0,
                                                        -Math.PI / 2,
                                                      ]}
                                                    >
                                                      <Motor
                                                        rotation={[
                                                          Math.PI / 2,
                                                          0,
                                                          0,
                                                        ]}
                                                        position={[1.1, 0, 0]}
                                                        angle={angle}
                                                        childScale={scale}
                                                      >
                                                        <Part
                                                          name={"Base3"}
                                                          position={[0.6, 0, 0]}
                                                          rotation={[
                                                            0,
                                                            0,
                                                            -Math.PI / 2,
                                                          ]}
                                                        >
                                                          <Motor
                                                            rotation={[
                                                              Math.PI / 2,
                                                              0,
                                                              0,
                                                            ]}
                                                            position={[
                                                              1.1, 0, 0,
                                                            ]}
                                                            angle={angle}
                                                            childScale={scale}
                                                          >
                                                            <Part
                                                              name={"Base3"}
                                                              position={[
                                                                0.6, 0, 0,
                                                              ]}
                                                              rotation={[
                                                                0,
                                                                0,
                                                                -Math.PI / 2,
                                                              ]}
                                                            >
                                                              <Motor
                                                                rotation={[
                                                                  Math.PI / 2,
                                                                  0,
                                                                  0,
                                                                ]}
                                                                position={[
                                                                  1.1, 0, 0,
                                                                ]}
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
          </Motor>
        </Part>
      </group>
    </>
  );
};
