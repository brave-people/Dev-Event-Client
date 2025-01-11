import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { EventTimeType, MarkdownInputState } from '../../model/Event';
import Close from '../atoms/icon/Close';

type MarkdownInputModalProps = {
  state: MarkdownInputState;
  closeLayer: () => void;
  layerRef: MutableRefObject<HTMLDivElement | null>;
  setTitle: Dispatch<SetStateAction<string>>;
  setOrganizer: Dispatch<SetStateAction<string>>;
  setEventLink: Dispatch<SetStateAction<string>>;
  setStartDate: Dispatch<SetStateAction<Date | null>>;
  setStartTime: Dispatch<SetStateAction<Date | null>>;
  setEndDate: Dispatch<SetStateAction<Date | null>>;
  setEndTime: Dispatch<SetStateAction<Date | null>>;
  setEventTimeType: Dispatch<SetStateAction<EventTimeType>>;
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
}: MarkdownInputModalProps) => {
  const { showLayer } = state;
  const divRef = useRef<HTMLDivElement | null>(null);
  const [text, setText] = useState('');

  /*
  파싱 예시

- __[AWSKRUG 보안 #security 소모임](https://www.meetup.com/awskrug/events/305515882/)__
  - 분류: `오프라인(서울 강남)`, `유료`, `모임`
  - 주최: AWSKRUG
  - 접수: 01. 10(금) ~ 01. 22(수)
  */
  const parsingMarkdown = (text: string) => {
    const lines = text.split('\n');
    const firstLine = lines[0];

    // 행사 제목 파싱
    const titleRegex = /- __\[(.*?)\]\(/;
    const titleMatch = firstLine.match(titleRegex);
    const title = titleMatch ? titleMatch[1] : '';

    // 행사 링크 파싱
    const linkRegex = /\]\((.*?)\)__/;
    const linkMatch = firstLine.match(linkRegex);
    const link = linkMatch ? linkMatch[1] : '';

    // 주최 파싱
    const organizerLine = lines.find((line) => line.includes('주최:'));
    const organizer = organizerLine
      ? organizerLine.split('주최:')[1].trim()
      : '';

    // 시작 & 종료일자 파싱
    const dateLine = lines.find(
      (line) => line.includes('접수:') || line.includes('일시:')
    );

    let startDateStr = '';
    let startTimeStr = '';
    let endDateStr = '';
    let endTimeStr = '';
    let startDate = null;
    let startTime = null;
    let endDate = null;
    let endTime = null;
    let eventTimeType = 'DATE';

    if (dateLine) {
      // eventTimeType 설정
      eventTimeType = dateLine?.includes('접수:') ? 'RECRUIT' : 'DATE';

      // 현재 연도 가져오기
      const currentYear = new Date().getFullYear();

      // 행사 시작일자 파싱
      const startRegex =
        /(\d{2}\.\s*\d{2})\([\w가-힣]+\)(?:\s*(\d{2}:\d{2}))?\s*~/;
      const startMatch = dateLine.match(startRegex);
      if (startMatch) {
        startDateStr = startMatch[1].replace(/\s+/g, ''); // "12.11"
        startTimeStr = startMatch[2] || '00:00';

        // 행사 시작 월일 설정
        startDate = new Date(`${currentYear}.${startDateStr} ${startTimeStr}`);
        // 행사 시작 시간 설정
        if (startTimeStr) {
          startTime = new Date(
            `${currentYear}.${startDateStr} ${startTimeStr}`
          );
        }
      }

      // 행사 종료일자 파싱
      const endRegex =
        /~\s*(\d{2}\.\s*\d{2})\([\w가-힣]+\)(?:\s*(\d{2}:\d{2}))?/;
      const endMatch = dateLine.match(endRegex);
      if (endMatch) {
        endDateStr = endMatch[1].replace(/\s+/g, ''); // "12.13"
        endTimeStr = endMatch[2] || '23:59';

        // 행사 종료 월일 설정
        endDate = new Date(`${currentYear}.${endDateStr} ${endTimeStr}`);
        // 행사 종료 시간 설정
        if (endTimeStr) {
          endTime = new Date(`${currentYear}.${endDateStr} ${endTimeStr}`);
        }
      }
    }

    console.log(
      `title: ${title}\n
      link: ${link} \n
      organizer: ${organizer} \n
      eventTimeType: ${eventTimeType} \n 
      startDate: ${startDate} \n 
      startTime: ${startTime} \n
      endDate: ${endDate} \n
      endTime: ${endTime} \n
      `
    );

    setTitle(title);
    setOrganizer(organizer);
    setEventLink(link);
    setStartDate(startDate);
    setStartTime(startTime);
    setEndDate(endDate);
    setEndTime(endTime);
    setEventTimeType(eventTimeType as EventTimeType);
  };

  const save = () => {
    parsingMarkdown(text);
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
          placeholder="이 곳에 Github 행사 마크다운 텍스트를 입력하면 자동으로 input을 채워줍니다.(단, 태그 자동 입력은 지원하지 않습니다.)"
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
