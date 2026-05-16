# 마크다운 입력 시 태그 자동 추출 기능

작성일: 2026-05-12

## 배경

개발자 행사 생성/수정 페이지에는 마크다운 텍스트를 입력하면 제목, 행사 링크, 주최, 시작/종료 일시를 폼에 자동으로 채워주는 기능(`MarkdownEventInputModal`)이 있다. 그러나 태그는 자동으로 채워지지 않아 사용자가 수동으로 다시 입력해야 한다. 모달 placeholder에 "(단, 태그 자동 입력은 지원하지 않습니다.)"가 명시되어 있다.

본 작업은 마크다운의 `분류:` 라인에서 태그를 추출하여 폼에 자동 적용하는 기능을 추가한다.

## 입력 형식 명세

행사 마크다운은 다음 형식이다.

```
- __[행사 제목](https://event-url)__
  - 분류: `오프라인(서울 송파구)`, `무료`, `세미나`
  - 주최: 주최자명
  - 접수: 04. 20(월) ~ 05. 01(금)
```

태그 추출 규칙:

- `분류:` 라인의 백틱(`` ` ``)으로 감싼 모든 토큰이 태그 후보다.
- `오프라인(...)`처럼 괄호와 그 안의 지역 정보가 붙은 경우, 괄호 부분을 제거하고 `오프라인`만 태그로 취급한다.
- `온라인`은 그대로 사용한다.
- 그 외 모든 토큰(`무료`, `유료`, `세미나`, `모임`, `대회`, `기술일반`, `AI`, `클라우드`, `블록체인` 등)도 그대로 사용한다.

## 요구사항

| # | 요구사항 |
|---|---|
| R1 | 마크다운의 `분류:` 라인에서 백틱으로 감싼 토큰을 모두 태그 후보로 추출한다 |
| R2 | 괄호와 그 안의 내용은 제거한다 (예: `오프라인(서울 송파구)` → `오프라인`) |
| R3 | 추출한 태그 이름이 `eventTagsAtom`(서버 등록 태그 목록)에 정확히 일치하는 항목만 폼에 추가한다 (strict, case-sensitive) |
| R4 | 등록되지 않은 태그가 하나 이상 있으면 alert로 목록을 표시한다 |
| R5 | 마크다운 적용 시 폼에 이미 있는 태그는 완전히 교체한다 |
| R6 | 추출된 등록 태그가 5개를 초과해도 모두 추가한다 (기존 수동 추가의 5개 제한은 우회) |
| R7 | `분류:` 라인이 없으면 태그는 빈 배열로 두고 다른 필드는 정상 파싱한다 |
| R8 | 기존 title/link/organizer/dates 파싱 동작은 회귀 없이 유지한다 |

## 설계

### 아키텍처

```
[입력] textarea의 마크다운 텍스트
       ↓
[순수 함수] parseEventMarkdown(text, allTags)
       ↓
[결과] ParsedEventMarkdown { title, link, organizer, eventTimeType, startDate, startTime, endDate, endTime, tags, unmatchedTagNames }
       ↓
[모달] 각 setter에 적용 + unmatchedTagNames 있으면 alert
```

파싱 로직은 `MarkdownEventInputModal` 내부의 `parsingMarkdown` 함수에서 분리하여 `src/util/markdown-event-parser.ts`로 옮긴다. 모달 컴포넌트는 결과를 받아 setter에 매핑하고 alert를 띄우는 역할만 담당한다.

### 파일 변경 범위

| 파일 | 변경 | 설명 |
|---|---|---|
| `src/util/markdown-event-parser.ts` | 신규 | 파싱 순수 함수. 기존 `parsingMarkdown` 로직을 이곳으로 이동 + 태그 파싱 추가 |
| `src/components/molecules/MarkdownEventInputModal.tsx` | 수정 | 내부 `parsingMarkdown` 제거, util 호출, `setTags` props 추가, `eventTagsAtom` 구독, 미등록 태그 경고 alert, placeholder 문구 수정 |
| `src/components/organisms/event/Form.tsx` | 수정 | 모달에 `setTags` prop 추가 전달 |

### 파싱 함수 시그니처

```typescript
// src/util/markdown-event-parser.ts
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

export const parseEventMarkdown = (
  text: string,
  allTags: Tag[]
): ParsedEventMarkdown;

export const extractTagNames = (text: string): string[];
```

### 태그 추출 알고리즘 (`extractTagNames`)

1. 텍스트를 라인 단위로 분할하여 `분류:`를 포함하는 첫 라인을 찾는다. 없으면 빈 배열 반환.
2. 정규식 `` /`([^`]+)`/g ``로 백틱 안 모든 토큰을 추출한다.
3. 각 토큰을 정규화한다: `replace(/\s*\([^)]*\)\s*/g, '').trim()`로 괄호와 그 안의 내용 제거.
4. 빈 문자열을 필터링하고 `Set`으로 중복을 제거한다.

### 매칭 로직 (`parseEventMarkdown` 내부)

```typescript
const extracted = extractTagNames(text);
const matched: Tag[] = [];
const unmatched: string[] = [];

for (const name of extracted) {
  const found = allTags.find(t => t.tag_name === name);
  if (found) matched.push(found);
  else unmatched.push(name);
}
```

정확히 일치(case-sensitive) 매칭만 한다. 운영 중 케이스 차이가 빈번하게 발생하면 그때 normalize 로직을 추가한다.

### 모달 동작

`MarkdownEventInputModal`의 `save` 핸들러는 util을 호출하고 모든 setter에 결과를 매핑한다.

```typescript
const save = () => {
  const result = parseEventMarkdown(text, allTags);

  setTitle?.(result.title);
  setOrganizer?.(result.organizer);
  setEventLink?.(result.link);
  setStartDate?.(result.startDate);
  setStartTime(result.startTime);
  setEndDate(result.endDate);
  setEndTime(result.endTime);
  setEventTimeType?.(result.eventTimeType);
  setTags?.(result.tags);

  if (result.unmatchedTagNames.length > 0) {
    alert(
      `등록되지 않은 태그는 제외되었습니다:\n` +
      result.unmatchedTagNames.map(n => `• ${n}`).join('\n') +
      `\n\n태그 관리 페이지에서 먼저 등록해주세요.`
    );
  }

  closeLayer();
};
```

`setTags`는 `Dispatch<SetStateAction<Tag[]>>` 타입의 optional prop이다. `setTags?.(result.tags)`로 완전 교체한다.

placeholder 문구를 다음과 같이 수정한다.

- 기존: `"이 곳에 Github 행사 마크다운 텍스트를 입력하면 자동으로 input을 채워줍니다.(단, 태그 자동 입력은 지원하지 않습니다.)"`
- 변경: `"이 곳에 Github 행사 마크다운 텍스트를 입력하면 자동으로 input을 채워줍니다."`

### Form.tsx 변경

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
  setTags={setTags}    // 추가
/>
```

### 5개 제한 우회 방식

기존 `form/event/Tag.tsx`의 `updateTag` 함수는 5개 제한과 중복 검사를 수행한다. 마크다운 적용은 이 함수를 거치지 않고 `setTags`로 직접 set하므로 5개 제한이 자연스럽게 우회된다. 사용자의 수동 추가 UX(타이핑/클릭으로 추가)에서는 기존 5개 제한이 그대로 유지된다.

### 엣지 케이스

| 케이스 | 동작 |
|---|---|
| `분류:` 라인 없음 | `tags = []`, `unmatchedTagNames = []`. 다른 필드는 정상 파싱 |
| 모든 추출 태그가 미등록 | `tags = []`, alert 표시 후 모달 닫힘 |
| 백틱 짝이 안 맞음 | 정규식 매칭 실패로 빈 결과. 에러 없음 |
| `allTags`가 아직 빈 배열 | 추출된 모든 이름이 unmatched로 분류. 실사용에선 모달 열기 전 이미 로드됨 |

## 테스트 전략

프로젝트에 jest/vitest 등 테스트 프레임워크가 없고 기존 테스트 파일도 없다. 이 기능만을 위해 테스트 프레임워크를 도입하는 것은 스코프 초과이므로 수동 검증으로 진행한다.

### 자동 검증

`pnpm build`가 통과해야 한다. TypeScript 컴파일 시 시그니처/타입 안전성이 확보된다.

### 수동 검증 시나리오

| # | 입력 마크다운의 `분류:` 라인 | 기대 결과 |
|---|---|---|
| 1 | `오프라인(서울 송파구)`, `무료`, `세미나` | 태그 3개: 오프라인 / 무료 / 세미나 |
| 2 | `온라인`, `무료`, `대회`, `블록체인` | 태그 4개: 온라인 / 무료 / 대회 / 블록체인 |
| 3 | `오프라인(서울 강남구)`, `유료`, `모임`, `클라우드`, `AI` | 태그 5개. 수동 추가 시 5개 제한과 별도로 모두 적용되는지 확인 |
| 4 | 등록되지 않은 태그(예: `XR`) 포함 | 등록 태그만 적용 + alert에 미등록 태그 표시 |
| 5 | `분류:` 라인 자체가 없음 | 태그 빈 배열, 다른 필드만 채워짐 |
| 6 | 폼에 기존 태그 있는 상태에서 마크다운 적용 | 기존 태그가 완전히 교체됨 |
| 7 | 수정 페이지에서 동일 시나리오 | Form.tsx 공유로 자동 검증되지만 한 번 직접 확인 |

### 회귀 방지

마크다운 적용 시 title / link / organizer / startDate / endDate / eventTimeType이 여전히 정상 동작하는지 확인한다. 파싱 로직은 동일 알고리즘을 util로 옮기는 것이므로 변동 없어야 하지만, 함수 이동 자체에 의한 회귀 가능성은 있다.

## 범위 외

- 케이스 무시(case-insensitive) 매칭 또는 자동 정규화
- 미등록 태그를 자동으로 서버에 등록
- 마크다운 적용 외 경로(수동 입력)에서 5개 제한 변경
- replay 등 다른 마크다운 입력 기능에 본 파서 적용 (향후 재사용 여지는 둠)
