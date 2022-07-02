import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

const gruvboxDark = {
  chalky: '#fabd2f',
  coral: '#fb4934',
  cyan: '#56b6c2',
  invalid: '#ebdbb2',
  ivory: '#a89984',
  stone: '#7d8799',
  malibu: '#61afef',
  sage: '#b8bb26',
  html: '#7fc274',
  whiskey: '#d19a66',
  violet: '#d3869b',
  darkBackground: '#483d6b',
  highlightBackground: '#483d6b',
  background: '#483d6b',
  tooltipBackground: '#353a42',
  selection: '#3E4451',
  cursor: '#9595d9',
};
/**
The editor theme styles for Grub Box by Dok6n.
*/
const gruvBoxTheme = /*@__PURE__*/ EditorView.theme(
  {
    '&': {
      color: gruvboxDark.violet,
      backgroundColor: gruvboxDark.background,
      borderRadius: '6px',
      padding: '1em',
      margin: '0.5em',
      fontFamily: '"Fira Code", Consolas, Monaco, "Andale Mono", monospace',
    },
    '.cm-content': {
      caretColor: gruvboxDark.cursor,
    },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: gruvboxDark.cursor },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: gruvboxDark.selection,
    },
    '&.cm-editor.cm-focused': {
      outline: '1px solid #9595d9 !important',
    },
    '.,cm-panels': { backgroundColor: gruvboxDark.darkBackground, color: gruvboxDark.ivory },
    '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
    '.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },
    '.cm-searchMatch': {
      backgroundColor: '#72a1ff59',
      outline: '1px solid #457dff',
    },
    '.cm-searchMatch.cm-searchMatch-selected': {
      backgroundColor: '#6199ff2f',
    },
    '.cm-activeLine': { backgroundColor: gruvboxDark.highlightBackground },
    '.cm-selectionMatch': { backgroundColor: '#aafe661a' },
    '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
      backgroundColor: '#bad0f847',
      outline: '1px solid #515a6b',
    },
    '.cm-gutters': {
      backgroundColor: gruvboxDark.background,
      color: gruvboxDark.stone,
      border: 'none',
    },
    '.cm-activeLineGutter': {
      backgroundColor: gruvboxDark.highlightBackground,
    },
    '.cm-foldPlaceholder': {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#ddd',
    },
    '.cm-tooltip': {
      border: 'none',
      backgroundColor: gruvboxDark.tooltipBackground,
    },
    '.cm-tooltip .cm-tooltip-arrow:before': {
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
    },
    '.cm-tooltip .cm-tooltip-arrow:after': {
      borderTopColor: gruvboxDark.tooltipBackground,
      borderBottomColor: gruvboxDark.tooltipBackground,
    },
    '.cm-tooltip-autocomplete': {
      '& > ul > li[aria-selected]': {
        backgroundColor: gruvboxDark.highlightBackground,
        color: gruvboxDark.ivory,
      },
    },
  },
  { dark: true },
);
/**
The highlighting style for code in the One Dark theme.
*/
const gruvBoxHighlightStyle = /*@__PURE__*/ HighlightStyle.define([
  { tag: tags.keyword, color: gruvboxDark.coral },
  { tag: [tags.name, tags.deleted, tags.character, tags.propertyName, tags.macroName], color: gruvboxDark.chalky },
  { tag: [/*@__PURE__*/ tags.function(tags.variableName), tags.labelName], color: gruvboxDark.chalky },
  {
    tag: [tags.color, /*@__PURE__*/ tags.constant(tags.name), /*@__PURE__*/ tags.standard(tags.name)],
    color: gruvboxDark.whiskey,
  },
  { tag: [/*@__PURE__*/ tags.definition(tags.name), tags.separator], color: gruvboxDark.invalid },
  {
    tag: [
      tags.typeName,
      tags.className,
      tags.number,
      tags.changed,
      tags.annotation,
      tags.modifier,
      tags.self,
      tags.namespace,
    ],
    color: gruvboxDark.html,
  },
  {
    tag: [
      tags.operator,
      tags.operatorKeyword,
      tags.url,
      tags.escape,
      tags.regexp,
      tags.link,
      /*@__PURE__*/ tags.special(tags.string),
    ],
    color: gruvboxDark.cyan,
  },
  { tag: [tags.meta, tags.comment], color: gruvboxDark.stone },
  { tag: tags.strong, fontWeight: 'bold' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.strikethrough, textDecoration: 'line-through' },
  { tag: tags.link, color: gruvboxDark.stone, textDecoration: 'underline' },
  { tag: tags.heading, fontWeight: 'bold', color: gruvboxDark.coral },
  { tag: [tags.atom, tags.bool, /*@__PURE__*/ tags.special(tags.variableName)], color: gruvboxDark.whiskey },
  { tag: [tags.processingInstruction, tags.string, tags.inserted], color: gruvboxDark.sage },
  { tag: tags.invalid, color: gruvboxDark.invalid },
]);
/**
Extension to enable the One Dark theme (both the editor theme and
the highlight style).
*/
const gruvBox = [gruvBoxTheme, /*@__PURE__*/ syntaxHighlighting(gruvBoxHighlightStyle)];

export { gruvBox, gruvBoxHighlightStyle, gruvBoxTheme };
