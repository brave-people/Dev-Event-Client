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
      `주최자 이름이 "${host.host_name}"으로 적혀 있는 기존 행사들을 모두 이 주최자에 연결할게요.\n되돌릴 수 없어요. 진행할까요?`
    );
    if (!ok) return;
    setBusy(true);
    const result = await backfillHostEventsApi({ id: host.id });
    setBusy(false);
    alert(result.message ?? '연결이 완료되었어요.');
  };

  return (
    <div className="list">
      <Form mode="modify" initial={host} hostId={host.id} />

      <div className="mt-8 border border-red-200 bg-red-50 rounded-md p-4">
        <h3 className="text-sm font-semibold text-red-700">위험 구역</h3>
        <p className="text-xs text-red-800 mt-1 mb-3">
          아래 액션은 폼 저장과 무관하게 즉시 실행됩니다.
        </p>

        <div className="flex items-center gap-3 bg-white border border-red-200 rounded-md p-3 mb-2">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">인증 마크</p>
            <p className="text-xs text-gray-500">
              켜면 주최자 이름 옆에 ✓ 마크가 표시됩니다. 변경 즉시 반영돼요.
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
          {busy ? '연결 중…' : '⚙ 기존 행사 일괄 연결'}
        </button>
        <p className="text-xs text-red-800 mt-2">
          예전에 등록된 행사 중 주최자 이름이 “{host.host_name}”으로 적혀 있는
          행사들을 모두 이 주최자에 한 번에 연결합니다.
        </p>
      </div>
    </div>
  );
};

export default Modify;
