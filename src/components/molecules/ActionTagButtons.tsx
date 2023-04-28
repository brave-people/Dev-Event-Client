import type { TagLayerType } from '../../model/Tag';

const ActionTagButtons = ({
  updateActiveLayer,
}: {
  updateActiveLayer: (type: TagLayerType) => void;
}) => {
  return (
    <div className="relative">
      <button
        onClick={() => updateActiveLayer('create')}
        className="mr-2 py-2 px-6 text-white rounded bg-blue-500 text-sm"
      >
        + 생성
      </button>
      <button
        onClick={() => updateActiveLayer('modify')}
        className="mr-2 py-2 px-6 text-gray-500 rounded border border-solid border-gray-200 text-sm"
      >
        수정
      </button>
      <button
        onClick={() => updateActiveLayer('delete')}
        className="py-2 px-6 text-gray-500 rounded border border-solid border-gray-200 text-sm"
      >
        삭제
      </button>
    </div>
  );
};

export default ActionTagButtons;
