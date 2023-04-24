import { useQuery } from 'react-query';
import {
  createTagApi,
  modifyTagApi,
  deleteTagApi,
  getTagsApi,
} from '../../../api/replay/tag';
import type { Tag } from '../../../model/Tag';
import TagComponent from '../../molecules/Tag';

const TagList = ({ tags }: { tags: Tag[] }) => {
  const { data, refetch } = useQuery(
    ['fetchReplayTags'],
    async () => await getTagsApi(),
    { refetchOnWindowFocus: false }
  );

  return (
    <TagComponent
      tags={tags}
      data={data}
      refetch={refetch}
      createTag={createTagApi}
      modifyTag={modifyTagApi}
      deleteTag={deleteTagApi}
    />
  );
};

export default TagList;
