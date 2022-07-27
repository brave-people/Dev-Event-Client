import { TagModel } from '../model/Tag';

const getFirstConsonant = ({
  words,
  allWord,
}: {
  words: string;
  allWord: TagModel[];
}) => {
  return allWord.filter(({ tag_name }) => tag_name.includes(words));
};

export default getFirstConsonant;
