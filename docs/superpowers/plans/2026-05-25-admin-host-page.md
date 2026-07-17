# /admin/host 주최자 관리 페이지 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/admin/host` (List / Create / Modify) 세 페이지를 서버 신규 `EventHost` 모델(분류·도메인·인증·배너·지역·정렬·외부링크·토픽)에 맞춰 확장한다.

**Architecture:**
- Create/Modify는 공용 `Form` 컴포넌트로 통합. 폼 제출은 `EventHostModifyRequestDTO`(links/topics 포함)를 PUT/POST 한 번에 전송.
- `verified` 토글과 `backfill-events`는 Modify 페이지 하단 "위험 구역"에 분리. 폼 PUT과 독립된 별도 API 호출.
- 서버 GET 응답은 snake_case, PUT/POST body는 camelCase. 직렬화 헬퍼로 변환.

**Tech Stack:** Next.js 13 App Router, TypeScript, react-query v3, Tailwind CSS, pnpm 빌드 검증.

**Spec:** [docs/superpowers/specs/2026-05-25-admin-host-page-design.md](../specs/2026-05-25-admin-host-page-design.md)
**Mockup:** [docs/admin-host-mockup.html](../../admin-host-mockup.html)

**전역 검증 규칙 (CLAUDE.md)**
- `pnpm run build` 가 통과해야 작업 완료. `pnpm lint` 단독은 불충분.
- Prettier `trailingComma: "es5"` — 함수 인자 끝 콤마 금지.

---

## Task 1: 모델/타입 확장

**Files:**
- Modify: `src/model/Host.ts`

- [ ] **Step 1: 타입 정의 교체**

`src/model/Host.ts` 전체를 아래로 교체.

```ts
export type HostClassification =
  | 'COMPANY'
  | 'COMMUNITY'
  | 'ACADEMIC'
  | 'GOVERNMENT'
  | 'EDUCATION'
  | 'MEDIA';

export type HostLinkType =
  | 'HOMEPAGE'
  | 'YOUTUBE'
  | 'INSTAGRAM'
  | 'FACEBOOK'
  | 'LINKEDIN'
  | 'GITHUB'
  | 'BLOG'
  | 'ETC';

export type HostLink = {
  id?: number;
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
  verified: boolean;
};
```

- [ ] **Step 2: 빌드로 타입 영향 범위 확인**

Run: `pnpm run build`
Expected: `src/api/host/create.ts`, `src/api/host/modify.ts`, `src/components/organisms/host/Create.tsx`, `Modify.tsx`, `List.tsx` 등에서 누락 필드 타입 에러 다수 발생.

이 에러들은 후속 태스크에서 차례로 해결한다. 이번 태스크에서는 **확인만** 한다.

- [ ] **Step 3: Commit**

```bash
git add src/model/Host.ts
git commit -m "[host] EventHost 신규 필드 타입 정의 추가"
```

---

## Task 2: snake↔camel 직렬화 헬퍼

**Files:**
- Create: `src/api/host/_serialize.ts`

- [ ] **Step 1: 헬퍼 작성**

서버는 응답 snake_case, 요청 camelCase. 폼 메모리 모델은 응답에 가깝게 snake_case로 유지하고, 보내기 직전에만 변환한다.

```ts
import type { Host, HostLink, HostTopic } from '../../model/Host';

export type HostRequestBody = {
  hostName: string;
  description: string;
  imageLink: string;
  classification: Host['classification'];
  domain: string | null;
  bannerImageLink: string | null;
  metaLocation: string | null;
  displayOrder: number;
  links: Array<{
    type: HostLink['type'];
    description: string;
    url: string;
    primary: boolean;
    displayOrder: number;
  }>;
  topics: Array<{
    name: string;
    displayOrder: number;
  }>;
};

export const toHostRequestBody = (data: Host): HostRequestBody => ({
  hostName: data.host_name,
  description: data.description,
  imageLink: data.image_link,
  classification: data.classification,
  domain: data.domain,
  bannerImageLink: data.banner_image_link,
  metaLocation: data.meta_location,
  displayOrder: data.display_order,
  links: data.links.map((l) => ({
    type: l.type,
    description: l.description,
    url: l.url,
    primary: l.primary,
    displayOrder: l.display_order,
  })),
  topics: data.topics.map((t) => ({
    name: t.name,
    displayOrder: t.display_order,
  })),
});
```

> Prettier 주의: `map((l) => ({ ... }))` 객체 리터럴의 마지막 프로퍼티 뒤에 콤마 OK. 함수 호출 인자 마지막 콤마는 금지(`es5`이므로 함수 인자에는 콤마 안 붙음 — 위 코드는 그대로 OK).

- [ ] **Step 2: 임시 import 확인 빌드**

Run: `pnpm run build`
Expected: 이 파일 자체는 타입 에러 없음. 기존 에러는 그대로(Task 3에서 해결).

- [ ] **Step 3: Commit**

```bash
git add src/api/host/_serialize.ts
git commit -m "[host] 요청 body 직렬화 헬퍼 추가"
```

---

## Task 3: 기존 API 클라이언트 (`create.ts`, `modify.ts`) 직렬화 적용

**Files:**
- Modify: `src/api/host/create.ts`
- Modify: `src/api/host/modify.ts`

- [ ] **Step 1: `create.ts` 갱신**

`src/api/host/create.ts` 전체 교체:

```ts
import Cookie from 'cookie';
import { Headers } from '../../config/headers';
import type { RequestHeaders } from '../../model/Api';
import type { Host } from '../../model/Host';
import { toHostRequestBody } from './_serialize';

export const createHostApi = async ({ data }: { data: Host }) => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/hosts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
    body: JSON.stringify(toHostRequestBody(data)),
  }).then((res) => res.json());
};
```

- [ ] **Step 2: `modify.ts` 갱신**

`src/api/host/modify.ts` 전체 교체:

```ts
import Cookie from 'cookie';
import { Headers } from '../../config/headers';
import type { RequestHeaders } from '../../model/Api';
import type { Host } from '../../model/Host';
import { toHostRequestBody } from './_serialize';

export const modifyHostApi = async ({
  data,
  id,
}: {
  data: Host;
  id: string;
}) => {
  return await fetch(`${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/hosts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: Cookie.parse(document.cookie)['access_token'],
      ...Headers(),
    } as RequestHeaders,
    body: JSON.stringify(toHostRequestBody(data)),
  }).then((res) => res.json());
};
```

- [ ] **Step 3: 빌드 확인 (조직 안쪽 에러는 후속 태스크에서 해결)**

Run: `pnpm run build`
Expected: `src/components/organisms/host/Create.tsx`, `Modify.tsx`, `List.tsx`에서 `Host` 객체 생성 시 누락 필드(`classification`, `domain` 등) 에러는 계속 발생. `api/host/*`는 통과.

- [ ] **Step 4: Commit**

```bash
git add src/api/host/create.ts src/api/host/modify.ts
git commit -m "[host] create/modify API에 신규 필드 직렬화 적용"
```

---

## Task 4: `verified` 토글 API

**Files:**
- Create: `src/api/host/verified.ts`

- [ ] **Step 1: API 작성**

```ts
import Cookie from 'cookie';
import { Headers } from '../../config/headers';
import type { RequestHeaders } from '../../model/Api';

export const updateHostVerifiedApi = async ({
  id,
  verified,
}: {
  id: number;
  verified: boolean;
}) => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/hosts/${id}/verified`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cookie.parse(document.cookie)['access_token'],
        ...Headers(),
      } as RequestHeaders,
      body: JSON.stringify({ verified }),
    }
  ).then((res) => res.json());
};
```

- [ ] **Step 2: 빌드 확인**

Run: `pnpm run build`
Expected: 이 파일 단독은 에러 없음.

- [ ] **Step 3: Commit**

```bash
git add src/api/host/verified.ts
git commit -m "[host] verified PATCH API 추가"
```

---

## Task 5: `backfill-events` API

**Files:**
- Create: `src/api/host/backfill.ts`

- [ ] **Step 1: API 작성**

```ts
import Cookie from 'cookie';
import { Headers } from '../../config/headers';
import type { RequestHeaders } from '../../model/Api';

export const backfillHostEventsApi = async ({ id }: { id: number }) => {
  return await fetch(
    `${process.env.NEXT_PUBLIC_ADMIN_V1_URL}/hosts/${id}/backfill-events`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: Cookie.parse(document.cookie)['access_token'],
        ...Headers(),
      } as RequestHeaders,
    }
  ).then((res) => res.json());
};
```

- [ ] **Step 2: 빌드 확인**

Run: `pnpm run build`
Expected: 이 파일 단독은 에러 없음.

- [ ] **Step 3: Commit**

```bash
git add src/api/host/backfill.ts
git commit -m "[host] organizer backfill API 추가"
```

---

## Task 6: `Toggle` atom

**Files:**
- Create: `src/components/atoms/Toggle.tsx`

- [ ] **Step 1: 컴포넌트 작성**

```tsx
type Props = {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
};

const Toggle = ({ checked, onChange, disabled, ariaLabel }: Props) => {
  const handleClick = () => {
    if (disabled) return;
    onChange(!checked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={handleClick}
      className={[
        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
        checked ? 'bg-blue-600' : 'bg-gray-300',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      <span
        className={[
          'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-4' : 'translate-x-0.5',
        ].join(' ')}
      />
    </button>
  );
};

export default Toggle;
```

- [ ] **Step 2: 빌드 확인**

Run: `pnpm run build`
Expected: 통과 (사용처 없음).

- [ ] **Step 3: Commit**

```bash
git add src/components/atoms/Toggle.tsx
git commit -m "[ui] Toggle atom 추가"
```

---

## Task 7: 분류 Badge atom

**Files:**
- Create: `src/components/atoms/HostClassificationBadge.tsx`

- [ ] **Step 1: 컴포넌트 작성**

```tsx
import type { HostClassification } from '../../model/Host';

const LABEL: Record<HostClassification, string> = {
  COMPANY: '회사',
  COMMUNITY: '커뮤니티',
  ACADEMIC: '학회/학술',
  GOVERNMENT: '정부/공공',
  EDUCATION: '교육기관',
  MEDIA: '미디어',
};

const COLOR: Record<HostClassification, string> = {
  COMPANY: 'bg-blue-50 text-blue-700',
  COMMUNITY: 'bg-emerald-50 text-emerald-700',
  ACADEMIC: 'bg-fuchsia-50 text-fuchsia-700',
  GOVERNMENT: 'bg-violet-50 text-violet-700',
  EDUCATION: 'bg-orange-50 text-orange-700',
  MEDIA: 'bg-red-50 text-red-700',
};

type Props = { value: HostClassification | null };

const HostClassificationBadge = ({ value }: Props) => {
  if (!value) {
    return (
      <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">
        미분류
      </span>
    );
  }
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${COLOR[value]}`}
    >
      {LABEL[value]}
    </span>
  );
};

export default HostClassificationBadge;
export { LABEL as HOST_CLASSIFICATION_LABEL };
```

- [ ] **Step 2: 빌드 확인**

Run: `pnpm run build`
Expected: 통과.

- [ ] **Step 3: Commit**

```bash
git add src/components/atoms/HostClassificationBadge.tsx
git commit -m "[ui] HostClassificationBadge atom 추가"
```

---

## Task 8: 공용 `Form` 컴포넌트 (Create/Modify 본체)

**Files:**
- Create: `src/components/organisms/host/Form.tsx`

큰 파일 하나로 두지만 내부는 섹션 단위로 정리. 책임: 폼 상태 보관, 이미지 업로드(로고+배너), links/topics repeater, 제출 직렬화. **위험 구역(verified/backfill)은 포함하지 않음** — Modify.tsx에서 추가.

- [ ] **Step 1: 파일 작성**

```tsx
'use client';

import { useState, type MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from 'react-query';
import { createHostApi } from '../../../api/host/create';
import { modifyHostApi } from '../../../api/host/modify';
import { fetchUploadImage } from '../../../api/image';
import { STATUS_200, STATUS_201 } from '../../../config/constants';
import type {
  Host,
  HostClassification,
  HostLink,
  HostLinkType,
  HostResponse,
  HostTopic,
} from '../../../model/Host';
import Input from '../../atoms/input/Input';
import ErrorContext, { useErrorContext } from '../../layouts/ErrorContext';
import ImageUpload from '../../molecules/image-upload';

const CLASSIFICATION_OPTIONS: { value: HostClassification; label: string }[] = [
  { value: 'COMPANY', label: '회사 (COMPANY)' },
  { value: 'COMMUNITY', label: '커뮤니티 (COMMUNITY)' },
  { value: 'ACADEMIC', label: '학회/학술 (ACADEMIC)' },
  { value: 'GOVERNMENT', label: '정부/공공 (GOVERNMENT)' },
  { value: 'EDUCATION', label: '교육기관 (EDUCATION)' },
  { value: 'MEDIA', label: '미디어 (MEDIA)' },
];

const LINK_TYPES: HostLinkType[] = [
  'HOMEPAGE',
  'YOUTUBE',
  'INSTAGRAM',
  'FACEBOOK',
  'LINKEDIN',
  'GITHUB',
  'BLOG',
  'ETC',
];

type Props = {
  mode: 'create' | 'modify';
  initial: HostResponse | null;
  hostId?: number;
};

const emptyHost: Host = {
  host_name: '',
  description: '',
  image_link: '',
  classification: null,
  domain: null,
  banner_image_link: null,
  meta_location: null,
  display_order: 0,
  links: [],
  topics: [],
};

const Form = ({ mode, initial, hostId }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const seed: Host = initial ?? emptyHost;
  const [hostName, setHostName] = useState(seed.host_name);
  const [description, setDescription] = useState(seed.description);
  const [classification, setClassification] = useState<HostClassification | null>(
    seed.classification
  );
  const [domain, setDomain] = useState(seed.domain ?? '');
  const [metaLocation, setMetaLocation] = useState(seed.meta_location ?? '');
  const [displayOrder, setDisplayOrder] = useState<number>(seed.display_order);
  const [links, setLinks] = useState<HostLink[]>(seed.links);
  const [topics, setTopics] = useState<HostTopic[]>(seed.topics);
  const [topicsAuto, setTopicsAuto] = useState<boolean>(seed.topics.length === 0);

  const [logoBlob, setLogoBlob] = useState<FormData | null>(null);
  const [bannerBlob, setBannerBlob] = useState<FormData | null>(null);
  const initialLogoUrl = seed.image_link;
  const initialBannerUrl = seed.banner_image_link ?? '';

  const { formErrors, validateForm } = useErrorContext({
    hostName,
    classification: classification ?? '',
  });

  const uploadOne = async (blob: FormData | null): Promise<string> => {
    if (blob === null) return '';
    const data = await fetchUploadImage({ fileType: 'HOST', body: blob });
    if (data.message) alert(data.message);
    if (data.file_url) return data.file_url;
    return '';
  };

  const updateLink = (index: number, patch: Partial<HostLink>) => {
    setLinks((prev) => prev.map((l, i) => (i === index ? { ...l, ...patch } : l)));
  };
  const setPrimaryLink = (index: number) => {
    setLinks((prev) => prev.map((l, i) => ({ ...l, primary: i === index })));
  };
  const removeLink = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };
  const addLink = () => {
    setLinks((prev) => [
      ...prev,
      {
        type: 'HOMEPAGE',
        description: '',
        url: '',
        primary: prev.length === 0,
        display_order: prev.length,
      },
    ]);
  };

  const updateTopic = (index: number, patch: Partial<HostTopic>) => {
    setTopics((prev) => prev.map((t, i) => (i === index ? { ...t, ...patch } : t)));
  };
  const removeTopic = (index: number) => {
    setTopics((prev) => prev.filter((_, i) => i !== index));
  };
  const addTopic = () => {
    setTopics((prev) => [
      ...prev,
      { name: '', display_order: prev.length },
    ]);
  };

  const submit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!hostName || !classification) return validateForm();

    const newLogo = await uploadOne(logoBlob);
    const newBanner = await uploadOne(bannerBlob);

    const cleanedLinks = links
      .filter((l) => l.url.trim() !== '')
      .map((l, i) => ({ ...l, display_order: i }));
    const ensurePrimary =
      cleanedLinks.length > 0 && !cleanedLinks.some((l) => l.primary)
        ? cleanedLinks.map((l, i) => ({ ...l, primary: i === 0 }))
        : cleanedLinks;

    const cleanedTopics = topicsAuto
      ? []
      : topics
          .filter((t) => t.name.trim() !== '')
          .map((t, i) => ({ ...t, display_order: i }));

    const body: Host = {
      host_name: hostName,
      description,
      image_link: newLogo || initialLogoUrl,
      classification,
      domain: domain.trim() === '' ? null : domain.trim(),
      banner_image_link:
        (newBanner || initialBannerUrl).trim() === ''
          ? null
          : newBanner || initialBannerUrl,
      meta_location: metaLocation.trim() === '' ? null : metaLocation.trim(),
      display_order: Number.isFinite(displayOrder) ? displayOrder : 0,
      links: ensurePrimary,
      topics: cleanedTopics,
    };

    const result =
      mode === 'create'
        ? await createHostApi({ data: body })
        : await modifyHostApi({ data: body, id: String(hostId) });

    const okStatus = mode === 'create' ? STATUS_201 : STATUS_200;
    if (result.status_code === okStatus) {
      await queryClient.invalidateQueries(['fetchHosts']);
      router.push('/admin/host');
      return;
    }
    alert(result.message);
  };

  return (
    <form className="form--large">
      <div className="form__content space-y-4">
        {/* 기본 정보 */}
        <Input
          text="주최명"
          value={hostName}
          onChange={(e) => setHostName(e.target.value)}
          isRequired={true}
          customClass={{ 'border-red-400': !!(formErrors.hostName && !hostName) }}
        >
          {formErrors.hostName && !hostName && <ErrorContext />}
        </Input>

        <div>
          <label className="inline-block text-base text-gray-600">
            분류<span className="text-red-500">*</span>
          </label>
          <select
            value={classification ?? ''}
            onChange={(e) =>
              setClassification(
                e.target.value === ''
                  ? null
                  : (e.target.value as HostClassification)
              )
            }
            className="block w-full mt-1 p-2 border rounded"
          >
            <option value="">선택…</option>
            {CLASSIFICATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {formErrors.classification && !classification && <ErrorContext />}
        </div>

        <Input
          text="도메인 라벨"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <Input
          text="활동 지역"
          value={metaLocation}
          onChange={(e) => setMetaLocation(e.target.value)}
        />
        <Input
          text="정렬 우선순위"
          value={String(displayOrder)}
          onChange={(e) => setDisplayOrder(Number(e.target.value) || 0)}
        />
        <Input
          text="주최 설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* 이미지 */}
        <div className="relative">
          <span className="form__content__title inline-block text-base text-gray-600">
            로고 이미지 (image_link)
          </span>
          <ImageUpload
            width={360}
            height={360}
            coverImageUrl={initialLogoUrl || undefined}
            setBlob={setLogoBlob}
          />
        </div>
        <div className="relative">
          <span className="form__content__title inline-block text-base text-gray-600">
            상단 배너 이미지 (banner_image_link)
          </span>
          <ImageUpload
            width={1200}
            height={300}
            coverImageUrl={initialBannerUrl || undefined}
            setBlob={setBannerBlob}
          />
        </div>

        {/* 외부 링크 */}
        <fieldset className="border-t pt-4">
          <legend className="text-base text-gray-600 font-semibold">
            외부 링크
          </legend>
          <div className="space-y-2 mt-2">
            {links.map((link, i) => (
              <div
                key={i}
                className="grid grid-cols-[120px_1fr_2fr_60px_60px_60px] gap-2 items-center"
              >
                <select
                  value={link.type}
                  onChange={(e) =>
                    updateLink(i, { type: e.target.value as HostLinkType })
                  }
                  className="p-1 border rounded text-sm"
                >
                  {LINK_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={link.description}
                  placeholder="표시 문구"
                  onChange={(e) => updateLink(i, { description: e.target.value })}
                  className="p-1 border rounded text-sm"
                />
                <input
                  type="url"
                  value={link.url}
                  placeholder="https://"
                  onChange={(e) => updateLink(i, { url: e.target.value })}
                  className="p-1 border rounded text-sm"
                />
                <label className="text-center text-xs">
                  <input
                    type="radio"
                    name="primary-link"
                    checked={link.primary}
                    onChange={() => setPrimaryLink(i)}
                  />{' '}
                  대표
                </label>
                <input
                  type="number"
                  value={link.display_order}
                  onChange={(e) =>
                    updateLink(i, {
                      display_order: Number(e.target.value) || 0,
                    })
                  }
                  className="p-1 border rounded text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeLink(i)}
                  className="text-xs text-red-600 border border-red-200 rounded p-1"
                >
                  삭제
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addLink}
              className="text-sm text-gray-700 border border-dashed rounded px-3 py-1"
            >
              + 링크 추가
            </button>
          </div>
        </fieldset>

        {/* 수동 토픽 */}
        <fieldset className="border-t pt-4">
          <legend className="text-base text-gray-600 font-semibold">
            수동 토픽
          </legend>
          <label className="flex items-center gap-2 text-sm mt-2">
            <input
              type="checkbox"
              checked={topicsAuto}
              onChange={(e) => setTopicsAuto(e.target.checked)}
            />
            자동 집계 사용 (직접 입력 시 끄세요)
          </label>
          {!topicsAuto && (
            <div className="space-y-2 mt-2">
              {topics.map((topic, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_80px_60px] gap-2 items-center"
                >
                  <input
                    type="text"
                    value={topic.name}
                    placeholder="토픽 이름"
                    onChange={(e) =>
                      updateTopic(i, { name: e.target.value })
                    }
                    className="p-1 border rounded text-sm"
                  />
                  <input
                    type="number"
                    value={topic.display_order}
                    onChange={(e) =>
                      updateTopic(i, {
                        display_order: Number(e.target.value) || 0,
                      })
                    }
                    className="p-1 border rounded text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeTopic(i)}
                    className="text-xs text-red-600 border border-red-200 rounded p-1"
                  >
                    삭제
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTopic}
                className="text-sm text-gray-700 border border-dashed rounded px-3 py-1"
              >
                + 토픽 추가
              </button>
            </div>
          )}
        </fieldset>
      </div>

      {/* 푸터 */}
      <div className="relative pt-8 pb-6">
        <button
          type="submit"
          onClick={submit}
          className="form__button form__button--center w-20 inline-flex items-center justify-center my-4 p-2 rounded-md text-white bg-blue-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        >
          확인
        </button>
        <a
          href="/admin/host"
          className="form__button form__button--right w-20 inline-flex items-center justify-center my-4 p-2 rounded-md text-gray-400 text-white bg-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        >
          취소
        </a>
      </div>
    </form>
  );
};

export default Form;
```

- [ ] **Step 2: 빌드**

Run: `pnpm run build`
Expected: Form 자체는 통과. 기존 `Create.tsx`/`Modify.tsx`에서 `Host` 타입 누락 필드 에러는 계속.

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/host/Form.tsx
git commit -m "[host] Create/Modify 공용 Form 컴포넌트 추가"
```

---

## Task 9: `Create.tsx` 리팩토

**Files:**
- Modify: `src/components/organisms/host/Create.tsx`

- [ ] **Step 1: Create.tsx 교체**

```tsx
import Form from './Form';

export const Create = () => {
  return (
    <div className="list">
      <Form mode="create" initial={null} />
    </div>
  );
};

export default Create;
```

- [ ] **Step 2: 빌드 확인**

Run: `pnpm run build`
Expected: Create 관련 에러 해소.

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/host/Create.tsx
git commit -m "[host] Create.tsx를 공용 Form으로 리팩토"
```

---

## Task 10: `Modify.tsx` 리팩토 + 위험 구역

**Files:**
- Modify: `src/components/organisms/host/Modify.tsx`
- Modify: `src/app/admin/host/modify/page.tsx` (HostResponse 전달 확인용)

먼저 현 `modify/page.tsx`가 어떤 형태로 호스트를 fetch해 Modify에 넘기는지 확인. 만약 `getHostApi`로 SSR fetch 후 props 전달하는 패턴이면 그대로 유지.

- [ ] **Step 1: 현재 modify/page.tsx 확인**

Run: `cat src/app/admin/host/modify/page.tsx`
Expected: `getHostApi`로 단건 조회 후 `<Modify host={...} />` 형태로 전달하는 코드 (또는 `<ClientComponent token=...>` 안에서 fetch).
- 만약 client-side에서 fetch 하는 구조라면 그대로 두고, props 타입만 `HostResponse`로 받게 보장.
- 만약 page.tsx가 `host` prop을 넘기지 않는 구조라면, Modify 내부에서 `useSearchParams`로 id를 받아 `useQuery(['fetchHost', id], () => getHostApi({id}))`로 fetch하도록 변경.

- [ ] **Step 2: Modify.tsx 교체**

`src/components/organisms/host/Modify.tsx` 전체 교체. host를 prop으로 받는 기존 시그니처 유지:

```tsx
'use client';

import { useState } from 'react';
import { backfillHostEventsApi } from '../../../api/host/backfill';
import { updateHostVerifiedApi } from '../../../api/host/verified';
import { STATUS_200 } from '../../../config/constants';
import type { HostResponse } from '../../../model/Host';
import Toggle from '../../atoms/Toggle';
import Form from './Form';

type Props = { host: HostResponse };

export const Modify = ({ host }: Props) => {
  const [verified, setVerified] = useState(host.verified);
  const [busy, setBusy] = useState(false);

  const toggleVerified = async (next: boolean) => {
    const previous = verified;
    setVerified(next);
    const result = await updateHostVerifiedApi({ id: host.id, verified: next });
    if (result.status_code !== STATUS_200) {
      setVerified(previous);
      alert(result.message ?? '인증 상태 변경에 실패했어요.');
    }
  };

  const runBackfill = async () => {
    const ok = window.confirm(
      `"${host.host_name}"과(와) 정확히 일치하는 organizer 텍스트를 가진 행사들을 일괄 매핑합니다.\n돌이킬 수 없습니다. 진행할까요?`
    );
    if (!ok) return;
    setBusy(true);
    const result = await backfillHostEventsApi({ id: host.id });
    setBusy(false);
    alert(result.message ?? '백필이 완료되었습니다.');
  };

  return (
    <div className="list">
      <Form mode="modify" initial={host} hostId={host.id} />

      {/* 위험 구역 */}
      <div className="mt-8 border border-red-200 bg-red-50 rounded-md p-4">
        <h3 className="text-sm font-semibold text-red-700">위험 구역</h3>
        <p className="text-xs text-red-800 mt-1 mb-3">
          아래 액션은 폼 저장과 무관하게 즉시 실행됩니다.
        </p>

        <div className="flex items-center gap-3 bg-white border border-red-200 rounded-md p-3 mb-2">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">인증 (verified)</p>
            <p className="text-xs text-gray-500">
              PATCH /admin/v1/hosts/{host.id}/verified · 즉시 반영
            </p>
          </div>
          <Toggle
            checked={verified}
            onChange={toggleVerified}
            ariaLabel="인증 토글"
          />
        </div>

        <button
          type="button"
          onClick={runBackfill}
          disabled={busy}
          className="text-xs text-red-700 border border-red-300 rounded px-3 py-2 bg-white disabled:opacity-50"
        >
          {busy ? '실행 중…' : '⚙ organizer 텍스트 일괄 매핑 (backfill)'}
        </button>
        <p className="text-xs text-red-800 mt-2">
          DevEvent.organizer가 이 주최명과 정확히 일치하는 행사들을
          EventHostMeta로 매핑합니다.
        </p>
      </div>
    </div>
  );
};

export default Modify;
```

- [ ] **Step 3: 빌드 확인**

Run: `pnpm run build`
Expected: Modify 관련 에러 해소. List만 남음.

- [ ] **Step 4: Commit**

```bash
git add src/components/organisms/host/Modify.tsx
git commit -m "[host] Modify.tsx 공용 Form + 위험 구역(verified/backfill) 적용"
```

---

## Task 11: `List.tsx` 컬럼/검색/필터 확장

**Files:**
- Modify: `src/components/organisms/host/List.tsx`

기존 List를 유지하되, 컬럼을 확장하고 클라이언트 측 검색/필터를 추가한다.

- [ ] **Step 1: List 본문 교체**

`src/components/organisms/host/List.tsx`의 `return` 직전 로직과 테이블 부분만 교체. 데이터 fetch / 메뉴 토글 / 삭제 로직은 그대로 유지하고 아래 변경만 적용:

1. 파일 상단 import에 다음 추가:

```tsx
import { useMemo } from 'react';
import HostClassificationBadge from '../../atoms/HostClassificationBadge';
import Toggle from '../../atoms/Toggle';
import type { HostClassification } from '../../../model/Host';
```

2. `useQuery` 직후에 검색·필터 state 추가:

```tsx
const [q, setQ] = useState('');
const [filterClass, setFilterClass] = useState<HostClassification | 'ALL'>(
  'ALL'
);

const filtered = useMemo(() => {
  if (!data) return [];
  const sorted = [...data].sort((a, b) => {
    if (b.display_order !== a.display_order)
      return b.display_order - a.display_order;
    return a.host_name.localeCompare(b.host_name, 'ko');
  });
  return sorted.filter((h) => {
    const qq = q.trim().toLowerCase();
    const matchQ = qq === '' || h.host_name.toLowerCase().includes(qq);
    const matchClass =
      filterClass === 'ALL' || h.classification === filterClass;
    return matchQ && matchClass;
  });
}, [data, q, filterClass]);

const verifiedCount = useMemo(
  () => (data ?? []).filter((h) => h.verified).length,
  [data]
);
```

3. 테이블 영역의 `<thead>` 와 `<tbody>` 를 교체:

```tsx
<table className="list__table">
  <thead>
    <tr>
      <th className="list__table-header" style={{ width: '60px' }}>
        No
      </th>
      <th className="list__table-header list__table-header--title">주최명</th>
      <th className="list__table-header" style={{ width: '120px' }}>분류</th>
      <th className="list__table-header" style={{ width: '160px' }}>도메인</th>
      <th className="list__table-header" style={{ width: '140px' }}>활동 지역</th>
      <th className="list__table-header" style={{ width: '80px' }}>인증</th>
      <th className="list__table-header" style={{ width: '80px' }}>순서</th>
      <th
        className="list__table-header list__table-header--actions"
        style={{ width: '80px' }}
      >
        관리
      </th>
    </tr>
  </thead>
  <tbody>
    {filtered.map((value, index) => (
      <tr key={value.id} className="list__table-row">
        <td className="list__table-cell list__table-cell--number">
          {index + 1}
        </td>
        <td className="list__table-cell list__table-cell--title">
          <div className="flex items-center gap-2">
            {value.image_link ? (
              <img
                src={value.image_link}
                alt=""
                className="w-7 h-7 rounded object-cover"
              />
            ) : (
              <span className="w-7 h-7 rounded bg-gray-100 inline-block" />
            )}
            <span className="list__table-title-text">{value.host_name}</span>
          </div>
        </td>
        <td className="list__table-cell">
          <HostClassificationBadge value={value.classification} />
        </td>
        <td className="list__table-cell">{value.domain ?? '—'}</td>
        <td className="list__table-cell">{value.meta_location ?? '—'}</td>
        <td className="list__table-cell">
          <Toggle
            checked={value.verified}
            onChange={() => undefined}
            disabled={true}
            ariaLabel={`${value.host_name} 인증 상태(읽기 전용)`}
          />
        </td>
        <td className="list__table-cell">{value.display_order}</td>
        <td className="list__table-cell list__table-cell--actions">
          {/* 기존 메뉴 ⋯ 그대로 유지 */}
          <div className="list__actions-menu">
            <button
              ref={(el) => (buttonRefs.current[value.id] = el)}
              className="list__actions-menu-trigger"
              aria-label="메뉴"
              onClick={(e) => toggleMenu(e, value.id)}
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
            {openMenuId === value.id && menuPosition && (
              <div
                className="list__actions-dropdown"
                style={{
                  display: 'block',
                  position: 'fixed',
                  top: `${menuPosition.top}px`,
                  left: `${menuPosition.left}px`,
                  zIndex: 10000,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="list__actions-dropdown-wrapper">
                  <button
                    className="list__actions-dropdown-item list__actions-dropdown-item--edit"
                    onClick={() => {
                      setOpenMenuId(null);
                      router.push(`/admin/host/modify?id=${value.id}`);
                    }}
                  >
                    수정
                  </button>
                  <button
                    className="list__actions-dropdown-item list__actions-dropdown-item--delete"
                    onClick={() => {
                      setOpenMenuId(null);
                      clickDeleteButton(value.id);
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>
            )}
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

4. 테이블 위(`<div className="list__table-wrapper">` 직전)에 툴바를 추가:

```tsx
<div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
  <span>
    전체 <strong className="text-gray-900">{data?.length ?? 0}</strong>건 ·
    인증 <strong className="text-gray-900">{verifiedCount}</strong>건
  </span>
  <div className="ml-auto flex gap-2">
    <input
      type="search"
      value={q}
      onChange={(e) => setQ(e.target.value)}
      placeholder="주최명 검색…"
      className="px-2 py-1 border rounded text-sm w-56"
    />
    <select
      value={filterClass}
      onChange={(e) =>
        setFilterClass(e.target.value as HostClassification | 'ALL')
      }
      className="px-2 py-1 border rounded text-sm"
    >
      <option value="ALL">전체 분류</option>
      <option value="COMPANY">회사 (COMPANY)</option>
      <option value="COMMUNITY">커뮤니티 (COMMUNITY)</option>
      <option value="ACADEMIC">학회/학술 (ACADEMIC)</option>
      <option value="GOVERNMENT">정부/공공 (GOVERNMENT)</option>
      <option value="EDUCATION">교육기관 (EDUCATION)</option>
      <option value="MEDIA">미디어 (MEDIA)</option>
    </select>
  </div>
</div>
```

5. 기존 empty state(`아직 등록된 주최가 없어요!`)는 `data?.length === 0` 일 때만 표시, 필터 결과 0건일 때는 별도 메시지 — 단순화 위해 기존 empty state 유지하고 `filtered.length === 0 && data?.length > 0` 일 때 테이블 안에 `<tr><td colSpan={8}>검색 결과 없음</td></tr>` 한 줄 추가.

- [ ] **Step 2: 빌드 확인**

Run: `pnpm run build`
Expected: 전체 통과.

- [ ] **Step 3: Commit**

```bash
git add src/components/organisms/host/List.tsx
git commit -m "[host] 목록에 분류/지역/인증/검색/필터 컬럼 추가"
```

---

## Task 12: 시나리오 수동 검증 + 최종 빌드

**Files:** (변경 없음 — 검증만)

- [ ] **Step 1: 개발 서버 실행 (백그라운드)**

Run: `pnpm dev` (background)
Expected: `http://localhost:3000`에서 접속 가능.

- [ ] **Step 2: 시나리오 점검**

다음을 차례로 확인:

1. `/admin/host` 진입 → 컬럼이 새 컬럼 구성으로 표시되는지, 검색·분류 필터가 동작하는지
2. ⋯ 메뉴 → 수정 → 새 필드 폼이 prefill 되는지
3. 폼에서 분류 선택 + 도메인/지역/순서 변경 + 링크 1개 추가 + 토픽 1개 추가 → 확인 클릭 → 목록으로 돌아오고 변경 반영
4. 수정 페이지의 verified 토글 클릭 → 네트워크 PATCH 1회 발사, 토글 상태 즉시 반영
5. backfill 버튼 → confirm dialog → 확인 시 POST 1회 발사
6. `/admin/host/create` → 빈 폼에서 필수만 채우고 저장 → 목록에 새 행 등장
7. 삭제 → 기존 동작 유지

각 시나리오에서 콘솔 에러가 없어야 함.

- [ ] **Step 3: 최종 빌드**

Run: `pnpm run build`
Expected: 통과. 어떤 prettier/eslint/타입 에러도 없어야 함.

- [ ] **Step 4: 단일 통합 커밋 또는 빈 변경 시 skip**

이 태스크에서 새 파일 변경은 없음. 시나리오 점검만.

---

## 자체 검토 (Self-Review)

- 스펙 §3 파일 구조 → Tasks 8/9/10/11 + atoms(6,7) 커버
- 스펙 §4 모델·API → Tasks 1/2/3/4/5
- 스펙 §5 페이지 동작 → Tasks 9/10/11 (verified·backfill = Task 10, 필터 = Task 11)
- 스펙 §6 Form 섹션 → Task 8 (기본정보·이미지·링크·토픽 + 단일 primary 자동 보정 + topicsAuto 빈 배열 처리)
- 스펙 §7 atoms → Tasks 6/7
- 스펙 §8 에러 처리 → Task 10 (verified 실패 시 원상태 복귀)
- 스펙 §9 빌드 검증 → Task 12 및 각 태스크 끝의 `pnpm run build`
- 스펙 §11 미결정 — Toast 미사용(`alert`) 으로 단순화하고 react-query 캐시 무효화는 Task 8 `submit`에서 `invalidateQueries(['fetchHosts'])`로 처리됨.
