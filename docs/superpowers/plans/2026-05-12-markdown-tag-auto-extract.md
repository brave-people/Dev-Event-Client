# 마크다운 태그 자동 추출 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 개발자 행사 생성/수정 페이지의 마크다운 입력 모달에 `분류:` 라인 태그 자동 추출 기능을 추가한다.

**Architecture:** 기존 `MarkdownEventInputModal` 내부의 `parsingMarkdown` 함수를 `src/util/markdown-event-parser.ts`의 순수 함수로 분리하고, 태그 추출 로직을 추가한다. 모달은 결과를 받아 setter에 매핑하는 책임만 담당한다.

**Tech Stack:** Next.js (App Router), React, TypeScript, Jotai (eventTagsAtom).

**Testing note:** 본 프로젝트에는 jest/vitest 등 테스트 프레임워크가 없다 (`package.json` scripts: dev/build/start/lint/tailwind/deploy/deduplicate). 단일 기능을 위해 프레임워크를 도입하지 않고 `pnpm build`로 타입 안전성을 검증하고 수동 시나리오로 행동 검증한다.

**Reference spec:** `docs/superpowers/specs/2026-05-12-markdown-tag-auto-extract-design.md`

---

## File Structure

| 파일 | 역할 |
|---|---|
| `src/util/markdown-event-parser.ts` (신규) | 마크다운 텍스트를 받아 행사 폼 필드 값들을 추출하는 순수 함수. `extractTagNames`와 `parseEventMarkdown` 두 함수를 export |
| `src/components/molecules/MarkdownEventInputModal.tsx` (수정) | util 호출, setTags prop 추가, eventTagsAtom 구독, 미등록 태그 alert, placeholder 문구 수정 |
| `src/components/organisms/event/Form.tsx` (수정) | 모달에 setTags prop 전달 (한 줄 추가) |

---

## Task 1: util 파일 생성 (타입 + extractTagNames)

**Files:**
- Create: `src/util/markdown-event-parser.ts`

태그 추출 순수 함수를 먼저 분리해서 만든다. `parseEventMarkdown`은 다음 태스크에서 추가한다.

- [ ] **Step 1: 신규 파일 생성**

`src/util/markdown-event-parser.ts`:

```typescript
import type { Tag } from '../model/Tag';
import type { EventTimeType } from '../model/Event';

export interface ParsedEventMarkdown {
  title: string;
  link: string;
  organizer: string;
  eventTimeType: EventTimeType;
  startDate: Date | null;
  startTime: Date | null;
  endDate: Date | null;
  endTime: Date | null;
  tags: Tag[];
  unmatchedTagNames: string[];
}

export const extractTagNames = (text: string): string[] => {
  const lines = text.split('\n');
  const categoryLine = lines.find((line) => line.includes('분류:'));
  if (!categoryLine) return [];

  const backtickRegex = /`([^`]+)`/g;
  const names = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = backtickRegex.exec(categoryLine)) !== null) {
    const normalized = match[1].replace(/\s*\([^)]*\)\s*/g, '').trim();
    if (normalized.length > 0) names.add(normalized);
  }

  return Array.from(names);
};
```

- [ ] **Step 2: 타입 체크 통과 확인**

Run:
```bash
cd /Users/user/Desktop/dev-lab/Dev-Event-Client && pnpm build 2>&1 | tail -30
```

Expected: 빌드 성공 (`Compiled successfully`). `parseEventMarkdown`은 아직 export 안 했지만 어디서도 호출하지 않으므로 영향 없음.

- [ ] **Step 3: 수동 동작 확인 (Node REPL 또는 임시 스크립트)**

빠른 sanity check. 사용자가 직접 한 번 확인하면 좋고, 생략해도 무방.

```bash
cd /Users/user/Desktop/dev-lab/Dev-Event-Client && npx tsx -e "
import { extractTagNames } from './src/util/markdown-event-parser';
const sample = \`
- __[테스트](https://test.com)__
  - 분류: \\\`오프라인(서울 송파구)\\\`, \\\`무료\\\`, \\\`세미나\\\`
  - 주최: 테스트
\`;
console.log(extractTagNames(sample));
" 2>&1 | tail -5
```

Expected output: `[ '오프라인', '무료', '세미나' ]`

(만약 `tsx`가 설치되어 있지 않으면 이 스텝은 skip하고 Task 5의 수동 검증 시점에 함께 확인.)

- [ ] **Step 4: 커밋 (사용자에게 위임)**

사용자가 직접 커밋. 변경 파일: `src/util/markdown-event-parser.ts`.

제안 메시지: `[개발자 행사] 마크다운 태그 추출 유틸 파일 생성`

---

## Task 2: parseEventMarkdown 함수 추가

**Files:**
- Modify: `src/util/markdown-event-parser.ts`

기존 `MarkdownEventInputModal.tsx:67-183`의 `parsingMarkdown` 함수 로직을 그대로 옮긴다. 태그 매칭 추가.

- [ ] **Step 1: 파일에 함수 추가**

`src/util/markdown-event-parser.ts`의 `extractTagNames` 아래에 추가:

```typescript
export const parseEventMarkdown = (
  text: string,
  allTags: Tag[]
): ParsedEventMarkdown => {
  const lines = text.split('\n');
  const firstLine = lines[0] ?? '';

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
  let startDate: Date | null = null;
  let startTime: Date | null = null;
  let endDate: Date | null = null;
  let endTime: Date | null = null;
  let eventTimeType: EventTimeType = 'DATE';

  if (dateLine) {
    eventTimeType = dateLine.includes('접수:') ? 'RECRUIT' : 'DATE';
    const currentYear = new Date().getFullYear();

    const startRegex =
      /(\d{2}\.\s*\d{2})\([\w가-힣]+\)(?:\s*(\d{2}:\d{2}))?\s*~/;
    const startMatch = dateLine.match(startRegex);
    if (startMatch) {
      startDateStr = startMatch[1].replace(/\s+/g, '');
      startTimeStr = startMatch[2] || '00:00';
      startDate = new Date(`${currentYear}.${startDateStr} ${startTimeStr}`);
      if (startTimeStr) {
        startTime = new Date(`${currentYear}.${startDateStr} ${startTimeStr}`);
      }
    }

    const endRegex =
      /~\s*(\d{2}\.\s*\d{2})\([\w가-힣]+\)(?:\s*(\d{2}:\d{2}))?/;
    const endMatch = dateLine.match(endRegex);
    if (endMatch) {
      endDateStr = endMatch[1].replace(/\s+/g, '');
      endTimeStr = endMatch[2] || '23:59';
      endDate = new Date(`${currentYear}.${endDateStr} ${endTimeStr}`);
      if (endTimeStr) {
        endTime = new Date(`${currentYear}.${endDateStr} ${endTimeStr}`);
      }
    } else {
      const endTimeOnlyRegex = /~\s*(\d{2}:\d{2})/;
      const endTimeOnlyMatch = dateLine.match(endTimeOnlyRegex);
      if (endTimeOnlyMatch) {
        endTimeStr = endTimeOnlyMatch[1];
        endDate = new Date(`${currentYear}.${startDateStr} ${endTimeStr}`);
        endTime = new Date(`${currentYear}.${startDateStr} ${endTimeStr}`);
      }
    }
  }

  // 태그 매칭
  const extracted = extractTagNames(text);
  const tags: Tag[] = [];
  const unmatchedTagNames: string[] = [];

  for (const name of extracted) {
    const found = allTags.find((t) => t.tag_name === name);
    if (found) tags.push(found);
    else unmatchedTagNames.push(name);
  }

  return {
    title,
    link,
    organizer,
    eventTimeType,
    startDate,
    startTime,
    endDate,
    endTime,
    tags,
    unmatchedTagNames,
  };
};
```

- [ ] **Step 2: 타입 체크**

Run:
```bash
cd /Users/user/Desktop/dev-lab/Dev-Event-Client && pnpm build 2>&1 | tail -30
```

Expected: 빌드 성공.

- [ ] **Step 3: 커밋 (사용자 위임)**

제안 메시지: `[개발자 행사] parseEventMarkdown 함수 추가 (태그 매칭 포함)`

---

## Task 3: MarkdownEventInputModal에서 util 사용 + setTags 통합

**Files:**
- Modify: `src/components/molecules/MarkdownEventInputModal.tsx`

기존 내부 `parsingMarkdown` 함수를 제거하고 util을 호출. `setTags` prop과 `eventTagsAtom` 구독, 미등록 태그 alert 추가. placeholder 수정.

- [ ] **Step 1: import 변경**

`src/components/molecules/MarkdownEventInputModal.tsx` 상단 import 블록 교체. `EventTimeType`은 props 타입(`setEventTimeType`)에 그대로 사용되므로 유지하고, 새 의존성만 추가한다.

기존:
```typescript
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
```

변경:
```typescript
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
```

- [ ] **Step 2: Props 타입에 setTags 추가**

`MarkdownInputModalProps` 타입 정의에 한 줄 추가:

```typescript
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
```

- [ ] **Step 3: 함수 시그니처에 setTags 구조분해 추가**

```typescript
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
```

- [ ] **Step 4: 내부 `parsingMarkdown` 함수 제거 및 `save` 핸들러 교체**

기존 `parsingMarkdown` 함수(67~183줄) 통째로 삭제하고, `eventTagsAtom` 구독 + 새 `save` 핸들러로 교체:

```typescript
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
```

기존 `console.log` 디버그 출력은 제거된다(코드 청소 차원, 동작 변화 없음).

- [ ] **Step 5: placeholder 문구 수정**

`<textarea>` 의 placeholder 속성을:

기존:
```
"이 곳에 Github 행사 마크다운 텍스트를 입력하면 자동으로 input을 채워줍니다.(단, 태그 자동 입력은 지원하지 않습니다.)"
```

변경:
```
"이 곳에 Github 행사 마크다운 텍스트를 입력하면 자동으로 input을 채워줍니다."
```

- [ ] **Step 6: 타입 체크**

Run:
```bash
cd /Users/user/Desktop/dev-lab/Dev-Event-Client && pnpm build 2>&1 | tail -30
```

Expected: 빌드 성공.

- [ ] **Step 7: 커밋 (사용자 위임)**

제안 메시지: `[개발자 행사] 마크다운 모달에서 태그 자동 추출 적용`

---

## Task 4: Form.tsx에서 setTags 전달

**Files:**
- Modify: `src/components/organisms/event/Form.tsx:66-78`

모달 호출부에 `setTags` 한 줄 추가.

- [ ] **Step 1: prop 추가**

`Form.tsx`의 `<MarkdownEventInputModal>` 호출에 `setTags={setTags}` 한 줄 추가:

```tsx
<MarkdownEventInputModal
  state={state}
  layerRef={layerRef}
  closeLayer={closeLayer}
  setTitle={setTitle}
  setOrganizer={setOrganizer}
  setEventLink={setEventLink}
  setStartDate={setStartDate}
  setStartTime={setStartTime}
  setEndDate={setEndDate}
  setEndTime={setEndTime}
  setEventTimeType={setEventTimeType}
  setTags={setTags}
/>
```

(`setTags`는 이미 `EventForm` 타입에서 받고 있는 props이므로 추가 import나 정의 불필요. `Form.tsx:30`에서 구조분해됨.)

- [ ] **Step 2: 타입 체크**

Run:
```bash
cd /Users/user/Desktop/dev-lab/Dev-Event-Client && pnpm build 2>&1 | tail -30
```

Expected: 빌드 성공.

- [ ] **Step 3: 커밋 (사용자 위임)**

제안 메시지: `[개발자 행사] Form에서 마크다운 모달에 setTags 전달`

---

## Task 5: 수동 검증

**Files:** 변경 없음. 로컬 dev 서버에서 시나리오 실행.

dev 서버는 이미 3000번 포트에서 실행 중일 가능성이 높다. 실행 중이 아니면:

```bash
cd /Users/user/Desktop/dev-lab/Dev-Event-Client && pnpm dev
```

`http://localhost:3000/auth/signIn`에서 로그인 → `/admin/event/create` 또는 `/admin/event/modify/[id]`로 이동 → "마크다운으로 입력" 버튼 클릭.

각 시나리오를 차례로 적용 후, "적용" 버튼을 누른 뒤 태그 영역과 다른 필드의 상태를 확인한다. 시나리오 사이에는 페이지 새로고침으로 폼을 초기화한다.

- [ ] **시나리오 1: 오프라인 + 일반 태그**

입력:
```
- __[테스트 행사](https://example.com)__
  - 분류: `오프라인(서울 송파구)`, `무료`, `세미나`
  - 주최: 테스트 주최자
  - 접수: 04. 20(월) ~ 05. 01(금)
```

확인: 태그 영역에 `오프라인`, `무료`, `세미나` 3개가 표시. 제목/주최/일자도 정상 채워짐.

- [ ] **시나리오 2: 온라인 + 4개 태그**

입력의 분류 라인:
```
  - 분류: `온라인`, `무료`, `대회`, `블록체인`
```

확인: 태그 4개 표시.

- [ ] **시나리오 3: 5개 (제한 우회)**

입력의 분류 라인:
```
  - 분류: `오프라인(서울 강남구)`, `유료`, `모임`, `클라우드`, `AI`
```

확인: 태그 5개 모두 표시. (5개 제한은 수동 추가 경로에만 적용되며, 마크다운 일괄 적용에서는 우회되어야 함.)

이후 같은 폼에서 태그 입력창에 임의의 등록 태그를 추가 시도. 5개 제한 alert가 뜨면 정상(수동 추가 5개 제한은 그대로).

- [ ] **시나리오 4: 미등록 태그**

입력의 분류 라인에 등록되지 않은 토큰을 의도적으로 섞는다 (예: `존재하지않는태그`):
```
  - 분류: `오프라인(서울)`, `무료`, `존재하지않는태그`
```

확인:
- 태그 영역에는 등록된 `오프라인`, `무료` 2개만 표시
- alert 팝업에 "등록되지 않은 태그는 제외되었습니다: • 존재하지않는태그 ..." 표시

- [ ] **시나리오 5: 분류 라인 없음**

입력에서 `분류:` 라인을 통째로 제거:
```
- __[테스트](https://example.com)__
  - 주최: 테스트
  - 접수: 04. 20(월) ~ 05. 01(금)
```

확인: 태그 영역은 비어있음. 제목/주최/일자는 정상 채워짐. alert는 뜨지 않음.

- [ ] **시나리오 6: 기존 태그 완전 교체**

먼저 수동으로 태그 1~2개 추가한 뒤, 마크다운 입력 후 적용. 확인: 기존 수동 추가 태그가 사라지고 마크다운 태그로 완전히 대체.

- [ ] **시나리오 7: 수정 페이지**

`/admin/event/modify/[id]`에 진입(기존 행사가 있어야 함). 폼에 기존 태그가 채워진 상태에서 마크다운 입력 → 적용 → 태그가 교체되는지 확인.

- [ ] **회귀 확인: 기존 파싱 동작**

시나리오 1~3 중 하나로 다시 한 번 확인. 제목, 행사 링크, 주최, eventTimeType(`접수:`는 RECRUIT / `일시:`는 DATE), startDate, endDate가 모두 기존과 동일하게 채워지는지.

- [ ] **모든 시나리오 통과 시 최종 정리 커밋 (사용자 위임)**

이미 Task 1~4에서 커밋된 상태라면 추가 정리 불필요. 일괄 커밋을 선호하면 작업 시작 전에 사용자에게 알리고 마지막에 한 번 커밋.
