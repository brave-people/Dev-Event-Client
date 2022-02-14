import { useEffect, useRef, useState } from 'react';
import type { BaseSyntheticEvent } from 'react';
import Cropper from 'cropperjs';

const ImageUpload = () => {
  const htmlFor = 'image-upload';
  const imageRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<HTMLLabelElement | null>(null);

  const [imageUrl, setImageUrl] = useState<{
    url: string | undefined;
    name: string;
  }>({ url: '', name: '' });
  const [cropImageUrl, setCropImageUrl] = useState<{
    url: string | undefined;
    name: string;
  }>({ url: '', name: '' });
  const [cropper, setCropper] = useState<Cropper | null>(null);

  const changeImageUpload = ({ file }: { file: File }) => {
    setImageUrl({ url: undefined, name: '' });
    setCropImageUrl({ url: undefined, name: '' });

    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl({ url: reader.result?.toString(), name: file.name });
      if (imageRef.current) {
        setCropper(new Cropper(imageRef.current, { aspectRatio: 1 }));
      }
    };
    reader.readAsDataURL(file);
  };
  const clickCropImageUpload = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const imgSrc = cropper?.getCroppedCanvas().toDataURL();
    setCropImageUrl({ url: imgSrc, name: imageUrl.name });
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

  return (
    <form method="post" encType="multipart/form-data">
      <div>
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
        <label htmlFor={htmlFor} ref={dragRef}>
          <div
            style={{ width: '400px', height: '300px', backgroundColor: 'gray' }}
          >
            이미지 올리기
          </div>
        </label>
        <div className="admin--create__image">
          {imageUrl.url && (
            <div style={{ maxWidth: '50%' }}>
              <img ref={imageRef} src={imageUrl.url} alt={imageUrl.name} />
            </div>
          )}
          {cropImageUrl.url && (
            <img src={cropImageUrl.url} alt={cropImageUrl.name} />
          )}
        </div>
        {imageUrl.url && <button onClick={clickCropImageUpload}>자르기</button>}
      </div>
    </form>
  );
};

export default ImageUpload;
