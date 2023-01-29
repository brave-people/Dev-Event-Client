import type { Dispatch, SetStateAction } from 'react';

type AlertProps = {
  alertTitle: string;
  alertDescription: string;
  toggleAlert: Dispatch<SetStateAction<boolean>>;
  onSave: () => void;
};

const Alert = ({
  alertTitle,
  alertDescription,
  toggleAlert,
  onSave,
}: AlertProps) => {
  return (
    <div className="alert--center">
      <p className="font-medium text-md">{alertTitle}</p>
      <p className="text-sm text-gray-700 mb-6">{alertDescription}</p>
      <button
        onClick={onSave}
        className="text-sm text-white bg-blue-600 rounded py-2 px-6 mr-3"
      >
        확인
      </button>
      <button
        onClick={() => toggleAlert(false)}
        className="text-sm text-blue-600 border-solid border border-gray-300 rounded py-2 px-6 mr-4"
      >
        취소
      </button>
    </div>
  );
};

export default Alert;
