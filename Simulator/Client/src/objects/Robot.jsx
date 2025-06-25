import { useRef, useEffect, createRef } from "react";
import { Part } from "./Part";

export const Robot = ({ position }) => {
  const bodyRef = useRef();
  const PartRef = useRef({});

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.setTranslation({
        x: position[0],
        y: position[1],
        z: position[2],
      });
    }
  }, [position]);

  const Parts = [
    {
      model: "Body3",
      position: [0, 0.5, 0],
      uid: "Base",
      parts: [
        {
          model: "Motor2",
          position: [0, .7, 0],
          rotation: [0, 0, 0],
          scale: [0.9, 0.9, 0.9],
          uid: "XM0",
          parts: [
            {
              model: "Shaft2",
              position: [0, 0, 0],
              rotation: [0, 0, 0.5],
              scale: [0.9, 0.9, 0.9],
              uid: "XS0",
              parts: [
                {
                  model: "Motor2",
                  position: [0, 1.2, 0],
                  rotation: [0, 0, 0],
                  scale: [0.9, 0.9, 0.9],
                  uid: "XM1",
                  parts: [
                    {
                      model: "Shaft2",
                      position: [0, 0, 0],
                      rotation: [0, 0, 0.5],
                      scale: [0.9, 0.9, 0.9],
                      uid: "XS1",
                      parts: [
                        {
                          model: "Motor2",
                          position: [0, 1.2, 0],
                          rotation: [0, 0, 0],
                          scale: [0.9, 0.9, 0.9],
                          uid: "XM2",
                          parts: [
                            {
                              model: "Shaft2",
                              position: [0, 0, 0],
                              rotation: [0, 0, 0.5],
                              scale: [0.9, 0.9, 0.9],
                              uid: "XS2",
                              parts: [
                                {
                                  model: "Motor2",
                                  position: [0, 1.2, 0],
                                  rotation: [0, 0, 0],
                                  scale: [0.9, 0.9, 0.9],
                                  uid: "XM3",
                                  parts: [
                                    {
                                      model: "Shaft2",
                                      position: [0, 0, 0],
                                      rotation: [0, 0, 0.5],
                                      scale: [0.9, 0.9, 0.9],
                                      uid: "XS3",
                                      parts: [
                                        {
                                          model: "Motor2",
                                          position: [0, 1.2, 0],
                                          rotation: [0, 0, 0],
                                          scale: [0.9, 0.9, 0.9],
                                          uid: "XM4",
                                          parts: [
                                            {
                                              model: "Shaft2",
                                              position: [0, 0, 0],
                                              rotation: [0, 0, 0.5],
                                              scale: [0.9, 0.9, 0.9],
                                              uid: "XS4",
                                              parts: [],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const PartSelector = ({ part }) => {
    if (part.model === "Group")
      return (
        <group
          key={"group-" + part.uid}
          name={part.model}
          {...part}
          ref={PartRef.current[part.uid]}
        >
          {part.parts && part.parts.length > 0 && renderParts(part.parts)}
        </group>
      );

    return (
      <>
        <Part
          key={"part-" + part.uid}
          name={part.model}
          {...part}
          ref={PartRef.current[part.uid]}
        >
          {part.parts && part.parts.length > 0 && renderParts(part.parts)}
        </Part>
      </>
    );
  };

  const renderParts = (parts) => {
    return parts.map((part) => {
      if (!PartRef.current[part.uid]) {
        PartRef.current[part.uid] = createRef();
      }

      return (
        <>
          {console.log(JSON.stringify(part))}
          <PartSelector part={part} />
        </>
      );
    });
  };

  return (
    <>
      <group position={position}>{renderParts(Parts)}</group>
    </>
  );
};
