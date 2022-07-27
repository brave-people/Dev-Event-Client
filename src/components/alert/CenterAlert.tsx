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
    <div className="alert--center">
      <p className="font-medium text-md">{title}</p>
      <p className="text-sm text-gray-700 mb-6">{description}</p>
      <button
        onClick={save}
        className="text-sm text-white bg-blue-600 rounded py-2 px-6 mr-3"
      >
        확인
      </button>
      <button
        onClick={() => showAlert(false)}
        className="text-sm text-blue-600 border-solid border border-gray-300 rounded py-2 px-6 mr-4"
      >
        취소
      </button>
    </div>
  );
};

export default CenterAlert;
