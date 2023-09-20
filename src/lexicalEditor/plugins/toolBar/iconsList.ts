import { FormatHeader1, FormatHeader2, FormatHeader3 } from 'mdi-material-ui';
import RedoRoundedIcon from '@mui/icons-material/RedoRounded';
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
import TextFormatRoundedIcon from '@mui/icons-material/TextFormatRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded';
import FormatBoldRoundedIcon from '@mui/icons-material/FormatBoldRounded';
import FormatItalicRoundedIcon from '@mui/icons-material/FormatItalicRounded';
import FormatUnderlinedRoundedIcon from '@mui/icons-material/FormatUnderlinedRounded';
import FormatAlignLeftRoundedIcon from '@mui/icons-material/FormatAlignLeftRounded';
import FormatAlignRightRoundedIcon from '@mui/icons-material/FormatAlignRightRounded';
import FormatAlignCenterRoundedIcon from '@mui/icons-material/FormatAlignCenterRounded';

export const eventTypes = {
  paragraph: "paragraph",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  ul: "ul",
  ol: "ol",
  formatCode: "formatCode",
  formatUndo: "formatUndo",
  formatRedo: "formatRedo",
  formatBold: "formatBold",
  formatItalic: "formatItalic",
  formatUnderline: "formatUnderline",
  //formatStrike: "formatStrike",
  //formatInsertLink: "formatInsertLink",
  formatAlignLeft: "formatAlignLeft",
  formatAlignCenter: "formatAlignCenter",
  formatAlignRight: "formatAlignRight",
  formatAlignJustify: "formatAlignJustify",
  //insertImage: "insertImage",
};

const pluginsList = [
  {
    id: 1,
    Icon: UndoRoundedIcon,
    event: eventTypes.formatUndo,
  },
  {
    id: 2,
    Icon: RedoRoundedIcon,
    event: eventTypes.formatRedo,
  },
  {
    id: 3,
    Icon: FormatHeader1,
    event: eventTypes.h1,
  },
  {
    id: 4,
    Icon: FormatHeader2,
    event: eventTypes.h2,
  },
  {
    id: 5,
    Icon: FormatHeader3,
    event: eventTypes.h3,
  },
  {
    id: 6,
    Icon: TextFormatRoundedIcon,
    event: eventTypes.paragraph,
  },

  {
    id: 7,
    Icon: FormatListBulletedRoundedIcon,
    event: eventTypes.ul,
  },
  {
    id: 8,
    Icon: FormatListNumberedRoundedIcon,
    event: eventTypes.ol,
  },
  {
    id: 9,
    Icon: FormatBoldRoundedIcon,
    event: eventTypes.formatBold,
  },
  {
    id: 10,
    Icon: FormatItalicRoundedIcon,
    event: eventTypes.formatItalic,
  },
  {
    id: 11,
    Icon: FormatUnderlinedRoundedIcon,
    event: eventTypes.formatUnderline,
  },
  {
    id: 12,
    Icon: FormatAlignLeftRoundedIcon,
    event: eventTypes.formatAlignLeft,
  },
  {
    id: 13,
    Icon: FormatAlignCenterRoundedIcon,
    event: eventTypes.formatAlignCenter,
  },

  {
    id: 14,
    Icon: FormatAlignRightRoundedIcon,
    event: eventTypes.formatAlignRight,
  },
];

export default pluginsList;