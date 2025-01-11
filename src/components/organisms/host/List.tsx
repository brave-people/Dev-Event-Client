import { Fragment, useEffect, useState, useRef } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { getHostsApi } from '../../../api/host';
import { deleteHostsApi } from '../../../api/host/delete';
import { HostResponse } from '../../../model/Host';
import { layerAtom } from '../../../store/layer';
import Alert from '../../molecules/Alert';

const HostList = () => {
  const router = useRouter();
  const [layer, setLayer] = useAtom(layerAtom);

  const divRef = useRef<HTMLDivElement>(null);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [maxHeight, setMaxHeight] = useState<string | null>(null);

  const { data, refetch } = useQuery(
    ['fetchHosts'],
    async () => await getHostsApi(),
    { refetchOnWindowFocus: false }
  );

  const clickDeleteButton = (id: number) => {
    setCurrentId(id);
    setLayer(true);
  };

  const deleteHost = async () => {
    if (!currentId) return;
    await deleteHostsApi({ id: currentId });
    setLayer(false);
    await refetch();
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!divRef.current) return;

    const divRefBottom = divRef.current.getBoundingClientRect().bottom;
    const top =
      divRef.current.clientHeight > window.innerHeight
        ? `calc(100vh - 72px)`
        : `${divRefBottom - 24}px`;
    setMaxHeight(top);
  }, [data]);

  return (
    <div ref={divRef} className="list">
      <div className="list__table relative mt-8 border rounded">
        {!data?.length ? (
          <p className="py-24 text-center font-bold text-base">
            아직 등록된 주최가 없어요!
          </p>
        ) : (
          <table className="w-full p-4">
            <thead className="list__table--thead">
              <tr>
                <td className="list__table--title">No</td>
                <td className="list__table--title">주최명</td>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 &&
                data.map((value: HostResponse) => {
                  return (
                    <Fragment key={value.id}>
                      <tr>
                        <td className="list__table--sub-title">{value.id}</td>
                        <td>{value.host_name}</td>
                        <td>
                          <div className="list--group">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={1.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                              />
                            </svg>
                            <div className="list--group__button">
                              <button
                                className="text-blue-500 font-bold"
                                onClick={() =>
                                  router.push(
                                    `/admin/host/modify?id=${value.id}`
                                  )
                                }
                              >
                                수정
                              </button>
                              <button
                                className="text-red-500 font-bold"
                                onClick={() => clickDeleteButton(value.id)}
                              >
                                삭제
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
            </tbody>
          </table>
        )}
        {maxHeight && (
          <button
            type="button"
            className="list__button--pop"
            onClick={() => router.push('/admin/host/create')}
            style={{ top: maxHeight }}
          >
            주최 생성
          </button>
        )}
      </div>
      {layer && (
        <Alert
          alertTitle="정말 삭제할까요?"
          alertDescription="돌이킬 수 없어요 🥲"
          toggleAlert={setLayer}
          onSave={deleteHost}
        />
      )}
    </div>
  );
};

export default HostList;
