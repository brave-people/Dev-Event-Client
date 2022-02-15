import { useEffect, useRef, useState } from 'react';
import type { BaseSyntheticEvent } from 'react';
import Cropper from 'cropperjs';
import { fetchUploadImage } from '../../pages/api/image';

const ImageUpload = () => {
  const htmlFor = 'image-upload';
  const imageRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<HTMLLabelElement | null>(null);

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

    cropper?.getCroppedCanvas().toBlob(async (blob) => {
      const formData = new FormData();
      if (blob) {
        formData.append('file', blob);
        const data = await fetchUploadImage({
          fileType: 'DEV_EVENT',
          data: formData,
        });
        console.log(data);
      }
    });
  };
  const deleteImage = () => {
    setImageUrl({ url: '', name: '' });
    setCropImageUrl({ url: '', name: '' });
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
        {!imageUrl.url && (
          <div className="drag__box">
            <p className="drag__box__text--large">
              드래그 혹은 클릭으로 파일을 업로드 할 수 있습니다.
            </p>
            <p className="drag__box__text--small">
              (jpg, png, gif less than 3MB)
            </p>
          </div>
        )}
      </label>
      <section className="drag__section">
        {imageUrl.url && (
          <div className="drag__section--image">
            <img ref={imageRef} src={imageUrl.url} alt={imageUrl.name} />
          </div>
        )}
        {cropImageUrl.url && (
          <div className="drag__section--image">
            <img src={cropImageUrl.url} alt={cropImageUrl.name} />
          </div>
        )}
      </section>
      {imageUrl.url && (
        <>
          <button onClick={deleteImage}>이미지 삭제</button>
          <button onClick={clickCropImageUpload}>자르기</button>
        </>
      )}
    </form>
  );
};

export default ImageUpload;
