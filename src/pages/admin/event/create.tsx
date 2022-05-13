import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useRouter } from 'next/router';
import 'react-datepicker/dist/react-datepicker.css';
import type { MouseEvent } from 'react';
import type { NextPageContext } from 'next/types';
import type { TokenModel } from '../../../model/User';
import type { TagModel } from '../../../model/Tag';
import type { EventModel } from '../../../model/Event';
import { STATUS_201 } from '../../../config/constants';
import { useUpdateCookie } from '../../../util/use-cookie';
import getToken from '../../../server/api/auth/getToken';
import getTags from '../../../server/api/events/getTags';
import { createEventsApi } from '../../api/events/create';
import { createTagApi } from '../../api/events/tag';
import EventComponent from '../../../components/Event';
import FormContent from '../../../components/event/form/Content';
import { useErrorContext } from '../../../components/event/form/ErrorContext';

const queryClient = new QueryClient();

const EventCreate = (data: { token: TokenModel; allTags: TagModel[] }) => {
  const router = useRouter();
  const { token, allTags } = data || {};

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [eventLink, setEventLink] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const { error, validateForm } = useErrorContext({
    title,
    organizer,
    eventLink,
    tags,
  });

  // date
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  // image
  const [coverImageUrl, setCoverImageUrl] = useState('');

  const changeTitle = (e: { target: { value: string } }) => {
    setTitle(e.target.value);
  };
  const changeDescription = (e: { target: { value: string } }) => {
    setDescription(e.target.value);
  };
  const changeOrganizer = (e: { target: { value: string } }) => {
    setOrganizer(e.target.value);
  };
  const changeEventLink = (e: { target: { value: string } }) => {
    setEventLink(e.target.value);
  };

  const createEvent = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!title || !organizer || !eventLink || !tags.length)
      return validateForm();

    for (const tag of tags) {
      if (!allTags?.length) {
        await createTagApi({ tag_name: tag });
      } else if (allTags.every((prevTag) => prevTag.tag_name !== tag)) {
        await createTagApi({ tag_name: tag });
      }
    }

    const body: EventModel = {
      title,
      description,
      organizer,
      display_sequence: 0,
      event_link: eventLink,
      start_date_time: dayjs(startDate).format('YYYY-MM-DD HH:MM'),
      start_time: dayjs(startTime).format('HH:MM'),
      end_date_time: dayjs(endDate).format('YYYY-MM-DD HH:MM'),
      end_time: dayjs(endTime).format('HH:MM'),
      tags: tags.map((tag) => ({
        tag_name: tag,
      })),
      cover_image_link: coverImageUrl,
    };

    const data = await createEventsApi({ data: body });
    if (data.status_code === STATUS_201) return router.reload();
    return alert(data.message);
  };

  useEffect(() => {
    if (token?.access_token) useUpdateCookie(document, token);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <EventComponent>
        <>
          <h1 className="text-3xl font-bold">개발자 행사 등록</h1>
          <FormContent
            title={title}
            changeTitle={changeTitle}
            error={error}
            description={description}
            changeDescription={changeDescription}
            organizer={organizer}
            changeOrganizer={changeOrganizer}
            eventLink={eventLink}
            changeEventLink={changeEventLink}
            tags={tags}
            setTags={setTags}
            allTags={allTags}
            startDate={startDate}
            setStartDate={setStartDate}
            startTime={startTime}
            setStartTime={setStartTime}
            endDate={endDate}
            setEndDate={setEndDate}
            endTime={endTime}
            setEndTime={setEndTime}
            setCoverImageUrl={setCoverImageUrl}
            saveForm={(e: MouseEvent<HTMLButtonElement>) => createEvent(e)}
          />
        </>
      </EventComponent>
    </QueryClientProvider>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const cookies = context.req?.headers.cookie;
  const token = await getToken(cookies);

  // token이 없거나 에러나면 로그인 페이지로 이동
  if (!token?.data || token?.error) {
    return {
      redirect: {
        destination: '/auth/signIn',
      },
    };
  }

  const tags = await getTags(token.data['access_token']);
  return { props: { token: token.data, allTags: tags } };
};

export default EventCreate;
