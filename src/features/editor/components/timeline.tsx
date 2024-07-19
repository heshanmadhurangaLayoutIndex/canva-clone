import React, { useCallback, useEffect, useState } from "react";
import { DraggableData, Rnd } from "react-rnd";
import { CanvasData } from "../types";
import PreviewImage from "./preview-image";

type TimelineProps = {
  canvases: CanvasData[];
  onCanvasChange: (canvasId: number) => void;
  activeCanvas: number;
};

type Segment = {
  id: number;
  time: number;
  position: number;
  gap: number;
  canvas: CanvasData;
  frameId: number;
};

const Timeline = ({
  canvases,
  onCanvasChange,
  activeCanvas,
}: TimelineProps) => {
  const [activeDragCanvas, setActiveDragCanvas] = useState<number | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);

  const handleDragStop = useCallback(
    (d: DraggableData, segmentId: number) => {
      const segmentIndex = segments.findIndex((seg) => seg.id === segmentId);
      if (segmentIndex !== -1) {
        const updatedSegments = [...segments];
        const movedSegment = updatedSegments.splice(segmentIndex, 1)[0];
        movedSegment.position = Math.max(d.x, 0);

        let newIndex = 0;
        while (
          newIndex < updatedSegments.length &&
          updatedSegments[newIndex].position < movedSegment.position
        ) {
          newIndex++;
        }

        updatedSegments.splice(newIndex, 0, movedSegment);

        let currentPosition = 0;
        for (let i = 0; i < updatedSegments.length; i++) {
          updatedSegments[i].position = currentPosition;
          currentPosition +=
            updatedSegments[i].time * 2 + updatedSegments[i].gap;
        }

        setSegments(updatedSegments);
      }
    },
    [segments]
  );

  const handleResizeStop = useCallback(
    (ref: HTMLElement, segmentId: number) => {
      const segmentIndex = segments.findIndex((seg) => seg.id === segmentId);
      if (segmentIndex !== -1) {
        const updatedSegments = [...segments];
        const newWidth = parseFloat(ref.style.width.replace("px", ""));
        updatedSegments[segmentIndex].time = newWidth / 2; // 2px per second

        let currentPosition = 0;
        for (let i = 0; i < updatedSegments.length; i++) {
          updatedSegments[i].position = currentPosition;
          currentPosition +=
            updatedSegments[i].time * 2 + updatedSegments[i].gap;
        }

        setSegments(updatedSegments);
      }
    },
    [segments]
  );

  const handleResize = useCallback(
    (ref: HTMLElement, segmentId: number) => {
      const segmentIndex = segments.findIndex((seg) => seg.id === segmentId);
      if (segmentIndex !== -1) {
        const updatedSegments = [...segments];
        const newWidth = parseFloat(ref.style.width.replace("px", ""));
        updatedSegments[segmentIndex].time = newWidth / 2; // 2px per second

        setSegments(updatedSegments);
      }
    },
    [segments]
  );

  const handleAddSegment = (canvas: CanvasData) => {
    if (segments.length === 0) {
      const newSegment: Segment = {
        id: 1,
        time: 100,
        position: 0,
        gap: 10,
        canvas: canvas,
        frameId: canvas.id,
      };
      return setSegments([newSegment]);
    }
    const lastSegment = segments[segments.length - 1];
    const newPosition =
      lastSegment.position + lastSegment.time * 2 + lastSegment.gap;
    const newSegment: Segment = {
      id: segments.length + 1,
      time: 100,
      position: newPosition,
      gap: 10,
      canvas: canvas,
      frameId: canvas.id,
    };
    setSegments([...segments, newSegment]);
  };

  useEffect(() => {
    for (let canvas of canvases) {
      const segment = segments.find((seg) => seg.canvas.id === canvas.id);
      if (!segment) {
        handleAddSegment(canvas);
      }
    }
  }, [canvases]);

  return (
    <div className="relative w-full h-[6.65rem] overflow-x-auto bg-gray-200 overflow-y-hidden flex items-center ">
      {segments.map((segment, index) => (
        <Rnd
          key={segment.id}
          size={{ width: segment.time * 2, height: "6rem" }}
          className="flex items-center "
          position={{ x: segment.position, y: 0 }}
          onDragStop={(e, d) => {
            handleDragStop(d, segment.id);
            setActiveDragCanvas(null);
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            handleResizeStop(ref, segment.id);
          }}
          onDragStart={() => setActiveDragCanvas(segment.id)}
          enableResizing={{
            top: false,
            right: true,
            bottom: false,
            left: true,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          d
          onResize={(e, direction, ref, delta, position) =>
            handleResize(ref, segment.id)
          }
          dragAxis="x"
          // bounds="parent"
        >
          <div
            className={`${
              segment.id === activeDragCanvas ? "border-4" : "border"
            }  rounded-lg border-blue-500`}
            onClick={() => {
              onCanvasChange(segment.canvas.id);
              setActiveDragCanvas(null);
            }}
          >
            <PreviewImage
              canvasDataList={canvases}
              index={segment.canvas.id - 1}
              activeCanvas={activeCanvas}
            />
          </div>
          <div
            className=" text-right  bg-gray-800 bg-opacity-25 rounded-sm p-1"
            style={{
              top: "10px",
              right: "10px",
              position: "absolute",
            }}
          >
            <span className="text-white text-xs font-bold">
              {segment.time.toFixed(2)}s
            </span>
          </div>
        </Rnd>
      ))}
    </div>
  );
};

export default Timeline;
