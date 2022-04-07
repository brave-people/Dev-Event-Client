import moment from 'moment';
import { MouseEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import getToken from '../../../server/api/auth/getToken';
import { STATUS_200 } from '../../../config/constants';
import { useUpdateCookie } from '../../../util/use-cookie';
import { getEventApi } from '../../api/events';
import { modifyEventsApi } from '../../api/events/modify';
import { createTagApi } from '../../api/events/tag';
import EventComponent from '../../../components/Event';
import FormContent from '../../../components/event/Form/Content';
import { useErrorContext } from '../../../components/event/Form/ErrorContext';
import type { NextPageContext } from 'next/types';
import type { TokenModel } from '../../../model/User';
import type { EventModel, EventResponseModel } from '../../../model/Event';

const EventModify = ({
  token,
  event,
}: {
  token: TokenModel;
  event: EventResponseModel;
}) => {
  const router = useRouter();
  const {
    query: { id = '' },
  } = router;
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [organizer, setOrganizer] = useState(event.organizer);
  const [eventLink, setEventLink] = useState(event.event_link);
  const [tags, setTags] = useState<string[]>(
    event.tags.map((tag) => tag.tag_name)
  );

  const { error, validateForm } = useErrorContext({
    title,
    organizer,
    eventLink,
    tags,
  });

  // date
  const [startDate, setStartDate] = useState(new Date(event.start_date_time));
  const [startTime, setStartTime] = useState(new Date(event.start_date_time));
  const [endDate, setEndDate] = useState(new Date(event.end_date_time));
  const [endTime, setEndTime] = useState(new Date(event.end_date_time));

  // image
  const [coverImageUrl, setCoverImageUrl] = useState(event.cover_image_link);

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

  const saveEvent = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!title || !organizer || !eventLink || !tags.length)
      return validateForm();

    for (const tag of tags) {
      const allTags = event.tags;
      if (!allTags.length) {
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
      start_date_time: moment(startDate).format('YYYY-MM-DD HH:MM'),
      start_time: moment(startTime).format('HH:MM'),
      end_date_time: moment(endDate).format('YYYY-MM-DD HH:MM'),
      end_time: moment(endTime).format('HH:MM'),
      tags: tags.map((tag) => ({
        tag_name: tag,
      })),
      cover_image_link: coverImageUrl,
    };

    const data = await modifyEventsApi({ data: body, id: id.toString() });
    if (data.status_code === STATUS_200) return router.reload();
    return alert(data.message);
  };

  useEffect(() => {
    if (token) useUpdateCookie(document, token);
  }, []);

  return (
    <EventComponent>
      <>
        <h2>개발자 행사 수정</h2>
        <FormContent
          {...event}
          eventLink={eventLink}
          tags={tags}
          setTags={setTags}
          allTags={event.tags}
          changeTitle={changeTitle}
          changeDescription={changeDescription}
          changeOrganizer={changeOrganizer}
          changeEventLink={changeEventLink}
          startDate={startDate}
          setStartDate={setStartDate}
          startTime={startTime}
          setStartTime={setStartTime}
          endDate={endDate}
          setEndDate={setEndDate}
          endTime={endTime}
          setEndTime={setEndTime}
          error={error}
          coverImageUrl={coverImageUrl}
          setCoverImageUrl={setCoverImageUrl}
          saveForm={saveEvent}
        />
      </>
    </EventComponent>
  );
};

export const getServerSideProps = async (context: NextPageContext) => {
  const cookies = context.req?.headers.cookie;
  const token = await getToken(cookies);
  const { id = '' } = context.query;

  // token이 없거나 에러나면 로그인 페이지로 이동
  if (!token?.data || token?.error) {
    return {
      redirect: {
        destination: '/auth/signIn',
      },
    };
  }

  // id가 없다면 이벤트 조회 페이지로 이동
  if (!id) return { redirect: { destination: 'admin/event' } };

  const data = await getEventApi({ token: token.data, id: id.toString() });
  return { props: { token: token.data, event: data } };
};

export default EventModify;
