import { ColorPicker, type IColor, useColor } from 'react-color-palette';
import React, {
  type BaseSyntheticEvent,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import ImageZoom from './ImageZoom';
import DragZone from './DragZone';
import Cropper from 'cropperjs';

const OriginImage = ({
  originImageRef,
}: {
  originImageRef: React.MutableRefObject<string | undefined>;
}) => {
  if (!originImageRef.current) return null;

  return (
    <section className="mb-4">
      <p>기존 이미지</p>
      <img
        src={originImageRef.current}
        alt="기존이미지"
        width={400}
        height={400}
      />
    </section>
  );
};

export type CropImageDataType = { url?: string; name: string };
const CropImage = ({
  cropImageData,
  color,
  setColor,
  setPickerColor,
}: {
  cropImageData: CropImageDataType;
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
  setPickerColor: Dispatch<SetStateAction<IColor>>;
}) => {
  const cropImageRef = useRef<HTMLImageElement | null>(null);

  const [showImageZoom, setShowImageZoom] = useState(false);

  const onMouseOver = () => setShowImageZoom(true);
  const onMouseOut = () => setShowImageZoom(false);

  return (
    <div className="drag__image drag__image--crop">
      <img
        ref={cropImageRef}
        src={cropImageData.url?.toString()}
        alt={cropImageData.name}
        onMouseOver={onMouseOver}
        onMouseOut={onMouseOut}
      />
      {showImageZoom && (
        <ImageZoom
          parentRef={cropImageRef}
          color={color}
          setColor={setColor}
          setPickerColor={setPickerColor}
          imageUrl={cropImageData.url}
        />
      )}
    </div>
  );
};

const ImageSize = ({ size }: { size: number }) => {
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

  if (!size) return null;

  return <p className="mt-4 text-sm text-right">{bytesToSize(size)}</p>;
};

const ColorBox = ({
  color,
  setShowColorPicker,
  setColor,
}: {
  color: string;
  setShowColorPicker: Dispatch<SetStateAction<boolean>>;
  setColor: Dispatch<SetStateAction<string>>;
}) => {
  const openColorPicker = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowColorPicker(true);
  };

  const changeColor = (e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  return (
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
  );
};

const ImageColorPicker = ({
  colorPickerRef,
  pickerColor,
  setColor,
  setPickerColor,
}: {
  colorPickerRef: React.MutableRefObject<HTMLDivElement | null>;
  pickerColor: IColor;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  setPickerColor: React.Dispatch<React.SetStateAction<IColor>>;
}) => {
  const changeColorPicker = (e: IColor) => {
    setColor(e.hex);
    setPickerColor(e);
  };

  return (
    <div ref={colorPickerRef} className="drag--color-picker">
      <ColorPicker color={pickerColor} onChange={changeColorPicker} />
    </div>
  );
};

const ImageHandler = ({
  deleteImage,
  clickCropImageUpload,
}: {
  deleteImage: () => void;
  clickCropImageUpload: (e: BaseSyntheticEvent) => void;
}) => {
  return (
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
  );
};

const ImageUpload = ({
  coverImageUrl,
  setBlob,
  width,
  height,
  useBackgroundColor,
}: {
  coverImageUrl?: string;
  setBlob: Dispatch<SetStateAction<FormData | null>>;
  width?: number;
  height?: number;
  useBackgroundColor?: boolean;
}) => {
  const originImageRef = useRef(coverImageUrl);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const colorPickerRef = useRef<HTMLDivElement | null>(null);

  const [cropper, setCropper] = useState<Cropper | null>(null);
  const [size, setSize] = useState(0);
  const [imageUrl, setImageUrl] = useState<{
    url?: string;
    name: string;
  }>({ url: '', name: '' });
  const [cropImageData, setCropImageData] = useState<CropImageDataType>({
    name: '',
  });

  const [color, setColor] = useState('#fff');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pickerColor, setPickerColor] = useColor(color);

  const deleteImage = () => {
    setSize(0);
    setImageUrl({ url: '', name: '' });
    setCropImageData({ url: '', name: '' });
  };

  const clickCropImageUpload = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    setCropImageData({
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

  const handleClickColorPickerOutside = (e: MouseEvent) => {
    const target = e.target as Element;
    const isClickOutside = !colorPickerRef.current?.contains(target);
    if (isClickOutside) setShowColorPicker(false);
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
    if (!showColorPicker) return;
    document.addEventListener('click', handleClickColorPickerOutside);

    return () => {
      document.removeEventListener('click', handleClickColorPickerOutside);
    };
  }, [showColorPicker]);

  return (
    <>
      <OriginImage originImageRef={originImageRef} />
      {!imageUrl.url ? (
        <DragZone deleteImage={deleteImage} setImageUrl={setImageUrl} />
      ) : (
        <div className="drag__image">
          <img ref={imageRef} src={imageUrl.url} alt={imageUrl.name} />
        </div>
      )}
      {cropImageData.url && (
        <>
          <CropImage
            cropImageData={cropImageData}
            color={color}
            setColor={setColor}
            setPickerColor={setPickerColor}
          />
          {useBackgroundColor && (
            <ColorBox
              color={color}
              setColor={setColor}
              setShowColorPicker={setShowColorPicker}
            />
          )}
        </>
      )}
      <ImageSize size={size} />
      {useBackgroundColor && showColorPicker && (
        <ImageColorPicker
          colorPickerRef={colorPickerRef}
          pickerColor={pickerColor}
          setColor={setColor}
          setPickerColor={setPickerColor}
        />
      )}
      {imageUrl.url && (
        <ImageHandler
          deleteImage={deleteImage}
          clickCropImageUpload={clickCropImageUpload}
        />
      )}
    </>
  );
};

export default ImageUpload;
