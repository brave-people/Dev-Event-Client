import { useCallback, useEffect, useRef, useState } from 'react';
import { rgbaToHex, rgbaToHsv } from '../../../util/color';
import type { IColor } from 'react-color-palette';

const ImageZoom = ({
  parentRef,
  color,
  setColor,
  setPickerColor,
  imageUrl,
}: {
  parentRef: React.MutableRefObject<HTMLImageElement | null>;
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  setPickerColor: React.Dispatch<React.SetStateAction<IColor>>;
  imageUrl: string | undefined;
}) => {
  const [pixelColors, setPixelColors] = useState<string[][]>([]);
  const imageContainerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const GRID_SIZE = 11;

  const handleClick = useCallback(() => {
    if (!pixelColors.length) return;
    const currentColor = pixelColors[5][5];
    const match = currentColor.match(/\d+/g);

    if (!match) return;

    const r = parseInt(match[0], 10);
    const g = parseInt(match[1], 10);
    const b = parseInt(match[2], 10);

    const hex = rgbaToHex(r, g, b);
    const rgb = { r, g, b, a: 1 };
    const hsv = {
      ...rgbaToHsv(r, g, b),
      a: 1,
    };

    setColor(hex);
    setPickerColor({ hex, rgb, hsv });
  }, [pixelColors]);

  const handleMouseMove = (e: MouseEvent) => {
    if (!parentRef.current) return;
    const rect = parentRef.current.getBoundingClientRect();

    const { clientX, clientY } = e;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (!imageContainerRef.current) return;
    imageContainerRef.current.style.left = `${x}px`;
    imageContainerRef.current.style.top = `${y}px`;

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
          if (i >= 0 && i < imageData.width && j >= 0 && j < imageData.height) {
            const pixelIndex = (j * imageData.width + i) * 4;
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
    if (!imageUrl) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const image = new Image();
    if (parentRef.current) {
      image.src = parentRef.current.src;
      image.onload = () => {
        if (!parentRef.current) return;
        canvas.width = parentRef.current.width;
        canvas.height = parentRef.current.height;

        context?.drawImage(
          image,
          0,
          0,
          parentRef.current.width,
          parentRef.current.height
        );
        canvasRef.current = canvas;
      };
    }

    parentRef.current?.addEventListener('mousemove', handleMouseMove);

    return () => {
      parentRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    parentRef.current?.addEventListener('click', handleClick);
  }, [color, pixelColors]);

  return (
    <div className="image--zoom__container" ref={imageContainerRef}>
      <table className="image--zoom__table">
        <tbody>
          {pixelColors.map((rowColors, rowIndex) => (
            <tr key={rowIndex} className="image--zoom__row">
              {rowColors.map((color, columnIndex) => {
                const isCenterIndex = rowIndex === 5 && columnIndex === 5;
                return (
                  <td
                    key={columnIndex}
                    className="image--zoom__cell"
                    style={{
                      backgroundColor: color,
                      ...(isCenterIndex && {
                        borderColor: '#ef4444',
                        position: 'absolute',
                      }),
                    }}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ImageZoom;
