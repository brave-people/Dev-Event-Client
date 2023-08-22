import { useEffect, useRef, useState } from 'react';
import { rgbaToHex } from '../../../util/color';

const ImageZoom = ({
  parentRef,
  color,
  setColor,
  imageUrl,
}: {
  parentRef: React.MutableRefObject<HTMLImageElement | null>;
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  imageUrl: string;
}) => {
  const [pixelColors, setPixelColors] = useState<string[][]>([]);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const GRID_SIZE = 11;

  const handleClick = () => {
    if (!pixelColors.length) return;
    const rgb = pixelColors[5][5];
    const match = rgb.match(/\d+/g);

    if (!match) return;

    const red = parseInt(match[0], 10);
    const green = parseInt(match[1], 10);
    const blue = parseInt(match[2], 10);

    const hex = rgbaToHex(red, green, blue);
    setColor(hex);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!parentRef.current) return;
    const rect = parentRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const { clientX, clientY } = e;
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;

    if (!imageContainerRef.current) return;
    imageContainerRef.current.style.left = `${offsetX + 20}px`;
    imageContainerRef.current.style.top = `${offsetY + 20}px`;

    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      const imageData = context?.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );

      if (!imageData) return;

      const pixelColors = [];

      for (
        let i = x - Math.floor(GRID_SIZE / 2);
        i <= x + Math.floor(GRID_SIZE / 2);
        i++
      ) {
        const rowColors = [];
        for (
          let j = y - Math.floor(GRID_SIZE / 2);
          j <= y + Math.floor(GRID_SIZE / 2);
          j++
        ) {
          const pixelIndex = (j * imageData.width + i) * 4;
          if (pixelIndex >= 0 && pixelIndex < imageData.data.length) {
            const color = `rgb(${imageData.data[pixelIndex]}, ${
              imageData.data[pixelIndex + 1]
            }, ${imageData.data[pixelIndex + 2]})`;
            rowColors.push(color);
          }
        }
        pixelColors.push(rowColors);
      }

      setPixelColors(pixelColors);
    }
  };

  useEffect(() => {
    // background-url 추가
    if (imageContainerRef.current) {
      imageContainerRef.current.style.background = `url(${imageUrl})`;
    }

    // 이미지 캐싱
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      context?.drawImage(image, 0, 0);
      canvasRef.current = canvas;
    };

    parentRef.current?.addEventListener('mousemove', handleMouseMove);

    return () => {
      parentRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    parentRef.current?.addEventListener('click', handleClick);
  }, [color]);

  return (
    <div className="image--zoom__container" ref={imageContainerRef}>
      <table className="image--zoom__table">
        <tbody>
          {pixelColors.map((rowColors, rowIndex) => (
            <tr key={rowIndex} className="image--zoom__row">
              {rowColors.map((color, columnIndex) => (
                <td
                  key={columnIndex}
                  className="image--zoom__cell"
                  style={{ backgroundColor: color }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ImageZoom;
