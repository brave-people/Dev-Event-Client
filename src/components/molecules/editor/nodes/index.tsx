import {
  Klass,
  LexicalNode,
  LineBreakNode,
  ParagraphNode,
  TextNode,
} from 'lexical';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { HashtagNode } from '@lexical/hashtag';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { OverflowNode } from '@lexical/overflow';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { MarkNode } from '@lexical/mark';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { ImageNode } from './imageNode';
import { InlineImageNode } from './inlineImageNode/InlineImageNode';

export const LexicalNodes: Klass<LexicalNode>[] = [
  HeadingNode,
  ParagraphNode,
  TextNode,
  HashtagNode,
  LinkNode,
  QuoteNode,
  AutoLinkNode,
  ListNode,
  ListItemNode,
  CodeNode,
  CodeHighlightNode,
  OverflowNode,
  TableCellNode,
  TableNode,
  TableRowNode,
  LineBreakNode,
  MarkNode,
  HorizontalRuleNode,
  ImageNode,
  InlineImageNode,
];
