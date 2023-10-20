import React, { useEffect, useRef } from 'react';

const DragZone = ({
  deleteImage,
  setImageUrl,
}: {
  deleteImage: () => void;
  setImageUrl: React.Dispatch<
    React.SetStateAction<{
      url?: string;
      name: string;
      type: string;
    }>
  >;
}) => {
  const htmlFor = 'image-upload';

  const dragRef = useRef<HTMLLabelElement | null>(null);

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
  const changeImageUpload = async ({ file }: { file: File }) => {
    deleteImage();

    const reader = new FileReader();
    reader.onload = async () => {
      setImageUrl({
        url: reader.result?.toString(),
        name: file.name,
        type: file.type,
      });
    };
    reader.readAsDataURL(file);
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
  );
};

export default DragZone;
