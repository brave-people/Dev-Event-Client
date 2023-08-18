import Cropper from 'cropperjs';
import React, { type ChangeEvent, useEffect, useRef, useState } from 'react';
import type { BaseSyntheticEvent } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { ColorPicker, type IColor, useColor } from 'react-color-palette';

const ImageUpload = ({
  coverImageUrl,
  setBlob,
  width,
  height,
}: {
  coverImageUrl?: string;
  setBlob: Dispatch<SetStateAction<FormData | null>>;
  width?: number;
  height?: number;
}) => {
  const htmlFor = 'image-upload';
  const imageRef = useRef<HTMLImageElement | null>(null);
  const cropImageRef = useRef<HTMLImageElement | null>(null);
  const prevImageRef = useRef(coverImageUrl);
  const dragRef = useRef<HTMLLabelElement | null>(null);
  const colorPickerRef = useRef<HTMLDivElement | null>(null);

  const [size, setSize] = useState(0);
  const [color, setColor] = useState('#fff');
  const [pickerColor, setPickerColor] = useColor(color);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const [imageUrl, setImageUrl] = useState<{
    url?: string;
    name: string;
  }>({ url: '', name: '' });
  const [cropImageUrl, setCropImageUrl] = useState<{
    url?: string;
    name: string;
  }>({ url: '', name: '' });
  const [cropper, setCropper] = useState<Cropper | null>(null);

  const changeImageUpload = async ({ file }: { file: File }) => {
    deleteImage();

    const reader = new FileReader();
    reader.onload = async () => {
      setImageUrl({ url: reader.result?.toString(), name: file.name });
    };
    reader.readAsDataURL(file);
  };
  const clickCropImageUpload = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setCropImageUrl({
      url:
        cropper
          ?.getCroppedCanvas({ maxWidth: 1024, width, height })
          ?.toDataURL() || '',
      name: imageUrl.name,
    });
    cropper?.getCroppedCanvas({ maxWidth: 1024, width, height })?.toBlob(
      async (blob) => {
        const formData = new FormData();
        if (blob) {
          setSize(blob.size);
          formData.append('images', blob, imageUrl.name);
          for (const [key, value] of Array.from(formData)) {
            formData.set(key, value);
          }
          setBlob(formData);
        }
      },
      'image/jpg',
      1
    );
  };
  const deleteImage = () => {
    setImageUrl({ url: '', name: '' });
    setCropImageUrl({ url: '', name: '' });
    setSize(0);
  };
  const dragAndDropHandler = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e?.dataTransfer?.files[0];
    file && changeImageUpload({ file });
  };
  const dragAndOverHandler = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const bytesToSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    const i = parseInt(
      String(Math.floor(Math.log(bytes) / Math.log(1024))),
      10
    );
    if (i === 0) return `${bytes} ${sizes[i]})`;
    return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!cropImageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = cropImageRef.current.width;
    canvas.height = cropImageRef.current.height;
    ctx?.drawImage(cropImageRef.current, 0, 0, canvas.width, canvas.height);

    const { clientX, clientY } = e;
    const rect = cropImageRef.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;

    const pixelData = ctx?.getImageData(offsetX, offsetY, 1, 1).data;

    if (!pixelData) return;

    const hex = rgbaToHex(pixelData[0], pixelData[1], pixelData[2]);
    const rgb = { r: pixelData[0], g: pixelData[1], b: pixelData[2], a: 1 };
    const hsv = {
      ...rgbaToHsv(pixelData[0], pixelData[1], pixelData[2]),
      a: 1,
    };

    setColor(hex);
    setPickerColor({ hex, rgb, hsv });
  };

  const changeColor = (e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const changeColorPicker = (e: IColor) => {
    setColor(e.hex);
    setPickerColor(e);
  };

  const openColorPicker = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowColorPicker(true);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Element;
    const isClickOutside = !colorPickerRef.current?.contains(target);
    if (isClickOutside) setShowColorPicker(false);
  };

  const rgbaToHex = (r: number, g: number, b: number) => {
    const toHex = (value: number) => {
      const hex = value.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const rgbaToHsv = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const v = max;
    let h = max;
    let s = max;

    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: h * 360,
      s: s * 100,
      v: v * 100,
    };
  };

  useEffect(() => {
    if (!imageRef.current) return;
    setCropper(
      new Cropper(imageRef.current, {
        aspectRatio: 16 / 9,
        ...(width &&
          height && {
            minCropBoxWidth: width,
            minCropBoxHeight: height,
            cropBoxResizable: false,
          }),
      })
    );
  }, [imageUrl]);

  useEffect(() => {
    if (dragRef.current) {
      dragRef.current.addEventListener('drop', dragAndDropHandler);
      dragRef.current.addEventListener('dragover', dragAndOverHandler);

      return () => {
        dragRef.current?.removeEventListener('drop', dragAndDropHandler);
        dragRef.current?.removeEventListener('dragover', dragAndOverHandler);
      };
    }
  }, [dragRef]);

  useEffect(() => {
    if (!showColorPicker) return;
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showColorPicker]);

  return (
    <>
      {prevImageRef.current && (
        <section className="mb-4">
          <p>기존 이미지</p>
          <img
            src={prevImageRef.current}
            alt="기존이미지"
            width={400}
            height={400}
          />
        </section>
      )}
      {!imageUrl.url && (
        <>
          <input
            id={htmlFor}
            name="image-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={({ target: { files } }) =>
              files &&
              changeImageUpload({
                file: files[0],
              })
            }
          />
          <label htmlFor={htmlFor} ref={dragRef} className="drag__box">
            <p className="drag__box__text--large">
              드래그 혹은 클릭으로 파일을 업로드 할 수 있습니다.
            </p>
            <p className="drag__box__text--small">(3MB까지 가능해요!)</p>
          </label>
        </>
      )}
      {imageUrl.url && (
        <div className="drag__image">
          <img ref={imageRef} src={imageUrl.url} alt={imageUrl.name} />
        </div>
      )}
      {cropImageUrl.url && (
        <div
          className="drag__image drag__image--crop"
          onMouseMove={onMouseMove}
        >
          <img
            ref={cropImageRef}
            src={cropImageUrl.url}
            alt={cropImageUrl.name}
          />
        </div>
      )}
      {size > 0 && (
        <p className="mt-4 text-sm text-right">{bytesToSize(size)}</p>
      )}
      {cropImageUrl.url && (
        <div className="flex">
          <button
            className="w-20 h-10 rounded-md drop-shadow-md mr-4"
            onClick={openColorPicker}
            style={{ backgroundColor: color }}
          />
          <input
            type="text"
            value={color}
            onChange={changeColor}
            className="appearance-none h-10 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
          />
        </div>
      )}
      {showColorPicker && (
        <div ref={colorPickerRef} className="drag--color-picker">
          <ColorPicker color={pickerColor} onChange={changeColorPicker} />
        </div>
      )}
      {imageUrl.url && (
        <div className="mt-4">
          <button
            onClick={deleteImage}
            className="mr-4 p-2 text-red-500 font-bold bg-gray-50 rounded"
          >
            이미지 삭제
          </button>
          <button
            onClick={clickCropImageUpload}
            className="p-2 text-blue-500 font-bold bg-gray-50 rounded"
          >
            자르기
          </button>
        </div>
      )}
    </>
  );
};

export default ImageUpload;
