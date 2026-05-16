import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useAtomValue } from 'jotai';
import { EventTimeType, MarkdownInputState } from '../../model/Event';
import type { Tag } from '../../model/Tag';
import { eventTagsAtom } from '../../store/tags';
import { parseEventMarkdown } from '../../util/markdown-event-parser';
import Close from '../atoms/icon/Close';

type MarkdownInputModalProps = {
  state: MarkdownInputState;
  closeLayer: () => void;
  layerRef: MutableRefObject<HTMLDivElement | null>;
  setTitle?: Dispatch<SetStateAction<string>>;
  setOrganizer?: Dispatch<SetStateAction<string>>;
  setEventLink?: Dispatch<SetStateAction<string>>;
  setStartDate?: Dispatch<SetStateAction<Date | null>>;
  setStartTime: Dispatch<SetStateAction<Date | null>>;
  setEndDate: Dispatch<SetStateAction<Date | null>>;
  setEndTime: Dispatch<SetStateAction<Date | null>>;
  setEventTimeType?: Dispatch<SetStateAction<EventTimeType>>;
  setTags?: Dispatch<SetStateAction<Tag[]>>;
};

const MarkdownEventInputModal = ({
  state,
  layerRef,
  closeLayer,
  setTitle,
  setOrganizer,
  setEventLink,
  setStartDate,
  setStartTime,
  setEndDate,
  setEndTime,
  setEventTimeType,
  setTags,
}: MarkdownInputModalProps) => {
  const { showLayer } = state;
  const divRef = useRef<HTMLDivElement | null>(null);
  const [text, setText] = useState('');
  const allTags = useAtomValue(eventTagsAtom);

  const save = () => {
    const result = parseEventMarkdown(text, allTags);

    if (setTitle) setTitle(result.title);
    if (setOrganizer) setOrganizer(result.organizer);
    if (setEventLink) setEventLink(result.link);
    if (setStartDate) setStartDate(result.startDate);
    setStartTime(result.startTime);
    setEndDate(result.endDate);
    setEndTime(result.endTime);
    if (setEventTimeType) setEventTimeType(result.eventTimeType);
    if (setTags) setTags(result.tags);

    if (result.unmatchedTagNames.length > 0) {
      alert(
        `등록되지 않은 태그는 제외되었습니다:\n` +
          result.unmatchedTagNames.map((n) => `• ${n}`).join('\n') +
          `\n\n태그 관리 페이지에서 먼저 등록해주세요.`
      );
    }

    closeLayer();
  };

  useEffect(() => {
    divRef.current = document.createElement('div');
  }, []);

  useEffect(() => {
    if (!divRef.current) {
      return;
    }

    if (showLayer) {
      layerRef.current?.appendChild(divRef.current);
    } else if (layerRef.current?.childElementCount) {
      layerRef.current?.removeChild(divRef.current);
    }
  }, [showLayer]);

  if (!divRef.current) return null;

  return createPortal(
    <div className="popup p-3 z-50">
      <div className="flex justify-between p-4">
        <h3 className="uppercase text-xl font-medium">마크다운으로 입력</h3>
        <button onClick={closeLayer}>
          <Close />
        </button>
      </div>
      <div className="m-4">
        <textarea
          rows={5}
          className="w-full h-96 p-2 border border-gray-300 rounded-md resize-none"
          placeholder="이 곳에 Github 행사 마크다운 텍스트를 입력하면 자동으로 input을 채워줍니다."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="popup__button mt-4">
          <button
            onClick={save}
            className="bg-blue-500 text-white rounded py-2 px-5 text-sm font-medium"
          >
            적용
          </button>
          <button
            onClick={closeLayer}
            className="border border-solid border-gray-200 rounded py-2 px-5 text-sm font-medium ml-2"
          >
            취소
          </button>
        </div>
      </div>
    </div>,
    divRef.current
  );
};

export default MarkdownEventInputModal;
