# /admin/host 주최자 관리 페이지 설계

> 작성일: 2026-05-25
> 대상: Dev-Event-Client (Next.js 13 App Router, TypeScript, pnpm)
> 서버: Dev-Event-Server `feature/host-260518` (uncommitted) — `docs/host-api-design.md` 기준
> 목업: [`docs/admin-host-mockup.html`](../../admin-host-mockup.html)

---

## 1. 배경

`Dev-Event-Server`의 미커밋 브랜치에서 `EventHost`에 신규 필드 8개와 두 개의 보조 테이블(`HostLink`, `HostTopic`)이 추가됐고, `/admin/v1/hosts/**` API가 다음과 같이 확장되었다.

| 메서드 | 경로 | 비고 |
|--------|------|------|
| GET | `/admin/v1/hosts` | 단건/페이지 X — 전체 반환 (기존) |
| GET | `/admin/v1/hosts/{id}` | (기존) |
| POST | `/admin/v1/hosts` | body 확장 — links/topics 포함 |
| PUT | `/admin/v1/hosts/{id}` | body 확장 — links/topics 전체 교체 |
| DELETE | `/admin/v1/hosts/{id}` | (기존) |
| PATCH | `/admin/v1/hosts/{id}/verified` | 신규 — 인증 토글 |
| POST | `/admin/v1/hosts/{id}/backfill-events` | 신규 — organizer 텍스트 일괄 매핑 |
| POST/DELETE | `/admin/v1/hosts/{id}/links*`, `/topics*` | 신규 — 본 설계에서는 **미사용** |

현재 클라이언트 `/admin/host`는 `host_name / description / image_link` 3개만 다루어 신규 필드를 전혀 반영하지 못한다. 본 설계는 해당 페이지를 신규 모델 전체를 지원하도록 확장한다.

---

## 2. 목표 / 비목표

**목표**
- `/admin/host` (List), `/admin/host/create`, `/admin/host/modify` 세 페이지에 신규 필드 전부 반영
- 인증(verified) 토글과 backfill 액션을 안전한 위치에서 노출
- 폼은 PUT/POST 한 번에 일괄 저장 (links/topics 메모리 편집 → 제출 시 전체 교체)
- 기존 어드민 톤(Tailwind 기반 단순 어드민)을 유지

**비목표**
- 공개 페이지 `/hosts`, `/hosts/[id]` 구현 — 별도 작업
- `/admin/v1/hosts/{id}/links*`, `/topics*` 개별 API 사용 — PUT 일괄 교체로 충분
- 서버 API 페이지네이션·검색 — 현재 GET 전체 반환 형식 그대로 사용. 필터는 클라이언트 측

---

## 3. 페이지/컴포넌트 구조

```
src/app/admin/host/
 ├─ page.tsx                  (List 진입)
 ├─ client.tsx                (HostList 호출)
 ├─ create/
 │   ├─ page.tsx
 │   └─ client.tsx
 └─ modify/
     ├─ page.tsx
     └─ client.tsx

src/components/organisms/host/
 ├─ List.tsx                  ← 확장 (컬럼 추가, 필터)
 ├─ Create.tsx                ← 재구성 (Form 컴포넌트 호출)
 ├─ Modify.tsx                ← 재구성 (Form 컴포넌트 호출 + verified/backfill)
 └─ Form.tsx                  ← 신규: Create/Modify 공용 폼 본체
```

`Form.tsx`를 신설해 `Create`/`Modify`의 중복 로직(필드 상태, 이미지 업로드, links/topics repeater, 제출 직렬화)을 한 곳으로 모은다. 기존 [event/Form.tsx](../../../src/components/organisms/event/Form.tsx)와 동일한 패턴.

---

## 4. 모델·타입 변경

### 4.1 `src/model/Host.ts` 확장

```ts
export type HostClassification =
  | 'COMPANY' | 'COMMUNITY' | 'ACADEMIC'
  | 'GOVERNMENT' | 'EDUCATION' | 'MEDIA';

export type HostLinkType =
  | 'HOMEPAGE' | 'YOUTUBE' | 'INSTAGRAM' | 'FACEBOOK'
  | 'LINKEDIN' | 'GITHUB' | 'BLOG' | 'ETC';

export type HostLink = {
  id?: number;             // 응답에만 존재
  type: HostLinkType;
  description: string;
  url: string;
  primary: boolean;
  display_order: number;
};

export type HostTopic = {
  id?: number;
  name: string;
  display_order: number;
};

export type Host = {
  host_name: string;
  description: string;
  image_link: string;
  classification: HostClassification | null;
  domain: string | null;
  banner_image_link: string | null;
  meta_location: string | null;
  display_order: number;
  links: HostLink[];
  topics: HostTopic[];
};

export type HostResponse = Host & {
  id: number;
  verified: boolean;       // 폼 제출에 포함 X (별도 PATCH)
};
```

> 서버 응답은 snake_case, 요청은 camelCase로 매핑되어 있다 — 기존 패턴 그대로 유지. `links`/`topics`는 PUT body로 camelCase 직렬화 한다.

### 4.2 API 클라이언트

| 파일 | 변경 |
|------|------|
| `src/api/host/index.ts` | `getHostsApi`/`getHostApi` 반환 타입을 새 `HostResponse`로 |
| `src/api/host/modify.ts` | body 타입을 새 `Host`로. links/topics 필드 포함하도록 직렬화 함수 추가 |
| `src/api/host/create.ts` | 동일 |
| `src/api/host/delete.ts` | 변경 없음 |
| `src/api/host/verified.ts` *(신규)* | `PATCH /admin/v1/hosts/{id}/verified` `{ verified: boolean }` |
| `src/api/host/backfill.ts` *(신규)* | `POST /admin/v1/hosts/{id}/backfill-events` |

직렬화 헬퍼는 `src/api/host/_serialize.ts`로 분리 (snake_case ↔ camelCase 변환).

---

## 5. 페이지별 동작

### 5.1 List `/admin/host`

**컬럼**: No / 주최(로고+이름) / 분류(badge) / 도메인 / 활동지역 / 인증(읽기 전용 토글) / 정렬값 / 관리(⋯)

**필터/검색** (클라이언트 측 — 현재 서버 API는 정렬·필터 미지원)
- 검색: `host_name` 부분일치 (대소문자 무시)
- 분류 select: `all` | 6개 enum
- 정렬: 기본은 `display_order DESC, host_name ASC` (서버 응답이 정렬돼 오면 그대로 사용, 아니면 클라이언트 정렬)

**액션**
- 행의 ⋯ 메뉴 → 수정 / 삭제 (기존 동작 유지)
- 인증 토글은 표시 전용. 변경은 수정 페이지에서만 (오조작/감사 추적 명확화)
- 상단에 `전체 N건 · 인증 M건` 카운터

### 5.2 Create `/admin/host/create`

`Form.tsx` 호출 with `mode="create"`, `initial=null`.

- 필수: `host_name`, `classification`
- 선택: 그 외 전부 + 이미지 2종 + links/topics repeater
- 위험 구역(verified/backfill)은 **숨김** — 생성 직후 의미 없음
- 제출: `POST /admin/v1/hosts` 후 `/admin/host`로 이동

### 5.3 Modify `/admin/host/modify?id=N`

`page.tsx`에서 `getHostApi`로 단건 SSR fetch → `Modify` 클라이언트에 props 전달 → `Form.tsx` 호출 with `mode="modify"`, `initial=hostResponse`.

폼 본체는 Create와 동일. 추가로:

- **위험 구역 (Danger zone)** — 폼 하단에 시각적으로 분리된 박스
  - **인증 토글**: 변경 즉시 `PATCH /admin/v1/hosts/{id}/verified` 호출. 성공 시 상태 갱신, 실패 시 토스트로 롤백
  - **backfill 버튼**: confirm dialog 후 `POST .../backfill-events`. 실행 중 로딩, 결과 토스트
- 위 두 액션은 폼의 "확인(PUT)" 과 **독립** — 폼 dirty 여부와 상관없이 즉시 실행

제출: `PUT /admin/v1/hosts/{id}` 후 `/admin/host`로 이동

---

## 6. Form 컴포넌트 구조 (`Form.tsx`)

```tsx
type Props = {
  mode: 'create' | 'modify';
  initial: HostResponse | null;
  hostId?: number;            // modify일 때만
};
```

내부 섹션:

1. **기본 정보**: host_name(필수), classification(필수 select), domain, meta_location, display_order, description(textarea)
2. **이미지**: image_link(로고, 1:1) + banner_image_link(배너, 4:1). 둘 다 기존 `ImageUpload` 재사용. fileType은 `'HOST'` 공유
3. **외부 링크 repeater**: row = `[type select, description input, url input, primary radio(단 하나만), order number, 삭제]`. `+ 링크 추가` 버튼. 대표 라디오는 같은 name으로 묶어 단일 선택 보장
4. **수동 토픽 repeater**: row = `[name input, order number, 삭제]`. `자동 집계 사용` 토글 ON 시 입력 disabled + 제출 body의 `topics = []`로 전송 (서버 §5.2: 수동 topic 비어있으면 자동 집계)
5. **(modify 전용) 위험 구역**: §5.3
6. **푸터**: 확인 / 취소

**검증**
- `host_name` 빈 값 → 기존 `ErrorContext` 패턴
- `classification` 미선택 → 동일 패턴
- 링크 row의 `url` 빈 값이면 해당 row 제출 제외(또는 빨갛게 표시 — 단순화 위해 제출 제외 선택)
- primary radio가 0개면 첫 링크를 primary로 자동 지정

**제출 직렬화** (snake↔camel)
```
{
  hostName, description, imageLink,
  classification, domain, bannerImageLink, metaLocation, displayOrder,
  links: [{ type, description, url, primary, displayOrder }, ...],
  topics: [{ name, displayOrder }, ...]
}
```

---

## 7. 스타일

기존 `list__*`, `form__*` Tailwind 기반 클래스를 그대로 따른다. 새로 필요한 패턴:

| 요소 | 처리 |
|------|------|
| 분류 배지 | `Badge` atom 신규(또는 inline tailwind) — 6개 분류별 색 매핑 |
| 토글 스위치 | 어드민 전반에 없음 → `Toggle` atom 신규 (간단한 button + transition) |
| Repeater | `host/Form.tsx` 내부에 격리 (재사용 필요 시 추후 추출) |
| Danger zone | inline Tailwind |

`Toggle`은 `src/components/atoms/Toggle.tsx`로 추출 — verified 토글에서 재사용.

---

## 8. 에러/엣지 케이스

- 단건 조회 시 호스트가 없으면 → 기존 동작(에러 페이지) 유지
- 이미지 업로드 실패 시 폼 제출 차단, 기존 URL 유지
- verified 토글 PATCH 실패 → 즉시 원상태 복귀 + 토스트(`useToast` 기존 사용)
- backfill 실행 도중 중복 클릭 방지: 로딩 중 비활성화
- links 배열에 동일 URL이 두 번 있어도 서버에서 막지 않음 → 클라이언트에서 경고만 (차단은 안 함)
- topics "자동 집계 사용" ON 상태에서 입력값 보존? → ON일 때는 클라이언트 메모리에서만 보존하고 제출 시 `[]` 전송. OFF로 돌리면 다시 나타남

---

## 9. 빌드 검증

CLAUDE.md 규칙대로 작업 종료 전 `pnpm run build` 통과를 확인한다. `next build`로 prettier(`trailingComma: "es5"` 함수 인자 콤마 금지) / 타입 / 런타임 그래프 한 번에 잡는다.

---

## 10. 작업 순서 (개요)

1. 모델/타입 확장 (`src/model/Host.ts`) + 직렬화 헬퍼
2. API 클라이언트 확장 + 신규(`verified.ts`, `backfill.ts`)
3. atoms (`Toggle`, `Badge`)
4. `Form.tsx` 신설 (Create/Modify 공용)
5. `Create.tsx` / `Modify.tsx` 리팩토 — Form 호출
6. `List.tsx` 확장 — 컬럼/필터/검색
7. 빌드 통과 확인 + 손수 시나리오 점검(목록 표시·생성·수정·인증 토글·backfill confirm)

세부 단계는 `writing-plans` 스킬로 별도 작성.

---

## 11. 미결정 / 사용자 확인 필요

- **이미지 fileType**: 배너용도 `'HOST'` 그대로 재사용 가정. 별도 분리(`'HOST_BANNER'`)가 필요한지는 운영 정책 확인 필요 — 일단 그대로 진행
- **`Toast`**: 위 8장에서 가정한 토스트 컴포넌트는 release/1.5.1 에서 추가됐다는 커밋 메시지 확인됨 — 사용 가능 가정
- **`react-query` 캐시 무효화**: List 페이지가 `['fetchHosts']` 키로 캐싱 중. Create/Modify 후 List로 돌아갈 때 invalidate 필요 — Form 제출 성공 후 `queryClient.invalidateQueries(['fetchHosts'])` 처리
