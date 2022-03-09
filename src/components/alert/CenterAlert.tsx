import type { Dispatch, SetStateAction } from 'react';

const CenterAlert = ({
  title,
  description,
  showAlert,
  save,
}: {
  title: string;
  description: string;
  showAlert: Dispatch<SetStateAction<boolean>>;
  save: () => void;
}) => {
  return (
    <div>
      <p>{title}</p>
      <p>{description}</p>
      <button onClick={() => showAlert(false)}>취소</button>
      <button onClick={save}>확인</button>
    </div>
  );
};

export default CenterAlert;
