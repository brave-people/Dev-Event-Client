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

const FIELD_CLASS =
  'appearance-none w-full h-10 px-3 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm';

const SECTION_TITLE_CLASS =
  'form__content__title inline-block text-base font-medium text-gray-600';

const CLASSIFICATION_OPTIONS: { value: HostClassification; label: string }[] = [
  { value: 'COMPANY', label: '회사' },
  { value: 'COMMUNITY', label: '커뮤니티' },
  { value: 'ACADEMIC', label: '학회/학술' },
  { value: 'GOVERNMENT', label: '정부/공공' },
  { value: 'EDUCATION', label: '교육기관' },
  { value: 'MEDIA', label: '미디어' },
];

const LINK_TYPE_LABEL: Record<HostLinkType, string> = {
  HOMEPAGE: '홈페이지',
  YOUTUBE: 'YouTube',
  INSTAGRAM: 'Instagram',
  FACEBOOK: 'Facebook',
  LINKEDIN: 'LinkedIn',
  GITHUB: 'GitHub',
  BLOG: '블로그',
  ETC: '기타',
};

const LINK_TYPES = Object.keys(LINK_TYPE_LABEL) as HostLinkType[];

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

  const seed: Host = {
    ...emptyHost,
    ...(initial ?? {}),
    links: initial?.links ?? [],
    topics: initial?.topics ?? [],
    display_order: initial?.display_order ?? 0,
    description: initial?.description ?? '',
    image_link: initial?.image_link ?? '',
    host_name: initial?.host_name ?? '',
  };
  const [hostName, setHostName] = useState(seed.host_name);
  const [description, setDescription] = useState(seed.description);
  const [classification, setClassification] =
    useState<HostClassification | null>(seed.classification);
  const [domain, setDomain] = useState(seed.domain ?? '');
  const [metaLocation, setMetaLocation] = useState(seed.meta_location ?? '');
  const [displayOrder, setDisplayOrder] = useState<number>(seed.display_order);
  const [links, setLinks] = useState<HostLink[]>(seed.links);
  const [topics, setTopics] = useState<HostTopic[]>(seed.topics);
  const [topicsAuto, setTopicsAuto] = useState<boolean>(
    seed.topics.length === 0
  );

  const [logoBlob, setLogoBlob] = useState<FormData | null>(null);
  const [bannerBlob, setBannerBlob] = useState<FormData | null>(null);
  const initialLogoUrl = seed.image_link;
  const initialBannerUrl = seed.banner_image_link ?? '';

  const [classificationError, setClassificationError] = useState(false);
  const { formErrors, validateForm } = useErrorContext({
    hostName,
  });

  const uploadOne = async (blob: FormData | null): Promise<string> => {
    if (blob === null) return '';
    const data = await fetchUploadImage({ fileType: 'HOST', body: blob });
    if (data.message) alert(data.message);
    if (data.file_url) return data.file_url;
    return '';
  };

  const updateLink = (index: number, patch: Partial<HostLink>) => {
    setLinks((prev) =>
      prev.map((l, i) => (i === index ? { ...l, ...patch } : l))
    );
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
    setTopics((prev) =>
      prev.map((t, i) => (i === index ? { ...t, ...patch } : t))
    );
  };
  const removeTopic = (index: number) => {
    setTopics((prev) => prev.filter((_, i) => i !== index));
  };
  const addTopic = () => {
    setTopics((prev) => [...prev, { name: '', display_order: prev.length }]);
  };

  const submit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!hostName || !classification) {
      if (!hostName) validateForm();
      setClassificationError(!classification);
      return;
    }
    setClassificationError(false);

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

    const finalBannerUrl = newBanner || initialBannerUrl;

    const body: Host = {
      host_name: hostName,
      description,
      image_link: newLogo || initialLogoUrl,
      classification,
      domain: domain.trim() === '' ? null : domain.trim(),
      banner_image_link: finalBannerUrl.trim() === '' ? null : finalBannerUrl,
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
      <div className="form__content space-y-6">
        <Input
          text="주최명"
          value={hostName}
          onChange={(e) => setHostName(e.target.value)}
          isRequired={true}
          customClass={{
            'border-red-400': !!(formErrors.hostName && !hostName),
          }}
        >
          {formErrors.hostName && !hostName && <ErrorContext />}
        </Input>

        <div className="form__content__input">
          <label className={SECTION_TITLE_CLASS}>
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
            className={FIELD_CLASS}
          >
            <option value="">선택…</option>
            {CLASSIFICATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {classificationError && !classification && <ErrorContext />}
        </div>

        <Input
          text="활동 분야"
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

        <div className="form__content__input">
          <label className={SECTION_TITLE_CLASS}>주최 설명</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="주최자에 대한 소개를 입력해주세요."
            className="appearance-none w-full px-3 py-2 border rounded border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm leading-relaxed resize-y"
          />
        </div>

        <div className="form__content__input">
          <span className={SECTION_TITLE_CLASS}>로고 이미지</span>
          <ImageUpload
            width={360}
            height={360}
            coverImageUrl={initialLogoUrl || undefined}
            setBlob={setLogoBlob}
          />
        </div>
        <div className="form__content__input">
          <span className={SECTION_TITLE_CLASS}>상단 배너 이미지</span>
          <ImageUpload
            width={1200}
            height={300}
            coverImageUrl={initialBannerUrl || undefined}
            setBlob={setBannerBlob}
          />
        </div>

        <section className="pt-2 border-t border-gray-200">
          <h3 className="text-base font-medium text-gray-600 mt-4 mb-3">
            외부 링크
          </h3>
          <div className="space-y-3">
            {links.map((link, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-3 items-end p-3 rounded-md border border-gray-100 bg-gray-50"
              >
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">
                    타입
                  </label>
                  <select
                    value={link.type}
                    onChange={(e) =>
                      updateLink(i, { type: e.target.value as HostLinkType })
                    }
                    className={`${FIELD_CLASS} bg-white`}
                  >
                    {LINK_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {LINK_TYPE_LABEL[t]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="block text-xs text-gray-500 mb-1">
                    표시 문구
                  </label>
                  <input
                    type="text"
                    value={link.description}
                    placeholder="공식 홈페이지"
                    onChange={(e) =>
                      updateLink(i, { description: e.target.value })
                    }
                    className={`${FIELD_CLASS} bg-white`}
                  />
                </div>
                <div className="col-span-4">
                  <label className="block text-xs text-gray-500 mb-1">
                    URL
                  </label>
                  <input
                    type="url"
                    value={link.url}
                    placeholder="https://"
                    onChange={(e) => updateLink(i, { url: e.target.value })}
                    className={`${FIELD_CLASS} bg-white`}
                  />
                </div>
                <div className="col-span-1 flex flex-col items-center">
                  <label className="block text-xs text-gray-500 mb-1">
                    대표
                  </label>
                  <input
                    type="radio"
                    name="primary-link"
                    checked={link.primary}
                    onChange={() => setPrimaryLink(i)}
                    className="h-5 w-5 mt-2"
                    aria-label="대표 링크"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs text-gray-500 mb-1">
                    순서
                  </label>
                  <input
                    type="number"
                    value={link.display_order}
                    onChange={(e) =>
                      updateLink(i, {
                        display_order: Number(e.target.value) || 0,
                      })
                    }
                    className={`${FIELD_CLASS} bg-white`}
                  />
                </div>
                <div className="col-span-1">
                  <button
                    type="button"
                    onClick={() => removeLink(i)}
                    className="h-10 w-full text-sm text-red-600 border border-red-200 rounded bg-white hover:bg-red-50"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addLink}
              className="w-full h-10 text-sm font-medium text-gray-600 border border-dashed border-gray-300 rounded hover:bg-gray-50"
            >
              + 링크 추가
            </button>
          </div>
        </section>

        <section className="pt-2 border-t border-gray-200">
          <h3 className="text-base font-medium text-gray-600 mt-4 mb-3">
            수동 토픽
          </h3>
          <label className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <input
              type="checkbox"
              checked={topicsAuto}
              onChange={(e) => setTopicsAuto(e.target.checked)}
              className="h-4 w-4"
            />
            자동 집계 사용 — 비워두면 행사 태그에서 자동 산출됩니다
          </label>
          {!topicsAuto && (
            <div className="space-y-3">
              {topics.map((topic, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-3 items-end p-3 rounded-md border border-gray-100 bg-gray-50"
                >
                  <div className="col-span-9">
                    <label className="block text-xs text-gray-500 mb-1">
                      토픽 이름
                    </label>
                    <input
                      type="text"
                      value={topic.name}
                      placeholder="예: 백엔드, SRE / 인프라"
                      onChange={(e) => updateTopic(i, { name: e.target.value })}
                      className={`${FIELD_CLASS} bg-white`}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">
                      순서
                    </label>
                    <input
                      type="number"
                      value={topic.display_order}
                      onChange={(e) =>
                        updateTopic(i, {
                          display_order: Number(e.target.value) || 0,
                        })
                      }
                      className={`${FIELD_CLASS} bg-white`}
                    />
                  </div>
                  <div className="col-span-1">
                    <button
                      type="button"
                      onClick={() => removeTopic(i)}
                      className="h-10 w-full text-sm text-red-600 border border-red-200 rounded bg-white hover:bg-red-50"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addTopic}
                className="w-full h-10 text-sm font-medium text-gray-600 border border-dashed border-gray-300 rounded hover:bg-gray-50"
              >
                + 토픽 추가
              </button>
            </div>
          )}
        </section>
      </div>

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
