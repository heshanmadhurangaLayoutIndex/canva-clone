import React, { useState, useEffect, memo } from "react";
type PreviewImageProps = {
  canvasDataList: any[];
  activeCanvas: number;
  index: number;
};

const PreviewImage = ({
  canvasDataList,
  activeCanvas,
  index,
}: PreviewImageProps) => {
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    setPreview(canvasDataList[index].canvas.toDataURL());
  }, [index, canvasDataList, activeCanvas]);

  return (
    <>
      <img
        key={index}
        className="w-full h-20 object-cover repeat-infinite"
        src={preview}
        draggable={false}
      />
    </>
  );
};

export default memo(PreviewImage);
