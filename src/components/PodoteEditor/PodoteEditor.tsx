import React, { useEffect, useRef, useState } from 'react';
import { ProsemirrorNode, RemirrorJSON } from 'remirror';
import { EditorView } from '@remirror/pm/view';
import { IEmojiData } from 'emoji-picker-react';
import {
  componentsStyledCss,
  coreStyledCss,
  extensionBlockquoteStyledCss,
  extensionCodeBlockStyledCss,
  extensionEmojiStyledCss,
  extensionFileStyledCss,
  extensionGapCursorStyledCss,
  extensionImageStyledCss,
  extensionListStyledCss,
  extensionMentionAtomStyledCss,
  extensionNodeFormattingStyledCss,
  extensionPlaceholderStyledCss,
  extensionPositionerStyledCss,
  extensionTablesStyledCss,
  extensionWhitespaceStyledCss,
  extensionYjsStyledCss,
  themeStyledCss,
} from '@remirror/styles/styled-components';
import { EditorComponent, Remirror, ThemeProvider, useRemirror } from '@remirror/react';
import {
  BoldExtension,
  CalloutExtension,
  HeadingExtension,
  HistoryExtension,
  ItalicExtension,
  UnderlineExtension,
  ImageExtension,
  DropCursorExtension,
  StrikeExtension,
  HorizontalRuleExtension,
  BlockquoteExtension,
  CodeExtension,
  BulletListExtension,
  OrderedListExtension,
  TaskListExtension,
  IframeExtension,
  LinkExtension,
  TableExtension,
  NodeFormattingExtension,
  // TrailingNodeExtension,
} from 'remirror/extensions';
import styled, { TodoStylesProps } from 'styled-components';

import { extensionCalloutStyledCss, extensionCountStyledCss, podoteThemeStyledCss, gruvBox } from 'styles';
import { useTodoStore, ToggleListItemExtension, CodeMirror6Extension } from 'hooks';
import { EmojiPickerReact, MenuBar, FloatingLinkToolbar } from 'components';
import { languages } from '@codemirror/language-data';
import { history, historyKeymap } from '@codemirror/commands';
import { bracketMatching, foldGutter, foldKeymap } from '@codemirror/language';
import { defaultKeymap, indentMore, indentLess } from '@codemirror/commands';

import {
  drawSelection,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  rectangularSelection,
} from '@codemirror/view';
import { EditorState as CodeMirrorEditorState } from '@codemirror/state';
import { autocompletion, completionKeymap } from '@codemirror/autocomplete';

const PodoteTheme = styled.div<TodoStylesProps>`
  ${componentsStyledCss}
  ${coreStyledCss}
  ${extensionBlockquoteStyledCss}
  ${extensionCalloutStyledCss}
  ${extensionCodeBlockStyledCss}
  ${extensionCountStyledCss}
  ${extensionEmojiStyledCss}
  ${extensionFileStyledCss}
  ${extensionGapCursorStyledCss}
  ${extensionImageStyledCss}
  ${extensionListStyledCss}
  ${extensionMentionAtomStyledCss}
  ${extensionNodeFormattingStyledCss}
  ${extensionPlaceholderStyledCss}
  ${extensionPositionerStyledCss}
  ${extensionTablesStyledCss}
  ${extensionWhitespaceStyledCss}
  ${extensionYjsStyledCss}
  ${themeStyledCss}
  ${podoteThemeStyledCss}
`;

interface Props {
  id: string;
  editable: boolean;
  content: RemirrorJSON;
  setTestOnlyContentJSON?: React.Dispatch<React.SetStateAction<RemirrorJSON>>;
}

interface ChildForwardRefObjects {
  handleClickEmoji: (e?: MouseEvent) => void;
}

function PodoteEditor({ id, editable, content, setTestOnlyContentJSON }: Props) {
  const [chosenEmoji, setChosenEmoji] = useState<IEmojiData | null>(null);
  const { editItemText } = useTodoStore();
  const childRef = useRef<ChildForwardRefObjects>({
    handleClickEmoji: () => {},
  });

  const renderDialogEmoji = (node: ProsemirrorNode, view: EditorView, getPos: () => number) => {
    const { emoji: prevEmoji } = node.attrs;
    const emoji = document.createElement('span');
    emoji.dataset.emojiContainer = '';
    emoji.textContent = prevEmoji;
    emoji.style.cursor = 'pointer';
    emoji.dataset.id = id;
    emoji.addEventListener('mousedown', e => e.preventDefault());
    if (childRef.current) {
      emoji.addEventListener('click', childRef.current.handleClickEmoji);
    }
    return emoji;
  };

  const extensions = () => [
    new BoldExtension(), // ??????
    new ItalicExtension(), // ?????????
    new StrikeExtension(), // ?????????
    new UnderlineExtension(), // ??????
    new HeadingExtension(), // ????????? 1 ~ 6
    new CalloutExtension({ defaultType: 'blank', renderEmoji: renderDialogEmoji, defaultEmoji: '????' }), // ?????????
    new HistoryExtension(), //?????? ?????? ??? ?????? ?????? ????????? ???????????? ?????? ?????? ????????? ??????
    new ImageExtension({ enableResizing: true }), // ????????? ??????
    new DropCursorExtension({ color: '#7963d2', width: 4 }), // ????????? ????????? ?????? ????????? ??????
    new HorizontalRuleExtension(), // ????????? ??????
    new BlockquoteExtension(), // ?????????
    new CodeExtension(), // Inline Code Blocks
    new BulletListExtension({ enableSpine: true }), // ?????????
    new OrderedListExtension(), // ?????? ?????????
    new TaskListExtension(), // ????????????
    new ToggleListItemExtension(), // toggling list ( Ctrl/cmd + Enter )
    // new TrailingNodeExtension(), // ???????????? ?????? ?????? ???
    new IframeExtension({ enableResizing: true }),
    new LinkExtension({ autoLink: true }),
    new TableExtension(),
    new NodeFormattingExtension(),
    new CodeMirror6Extension({
      languages,
      extensions: [
        gruvBox,
        history(),
        foldGutter({
          openText: 'expand_more',
          closedText: 'chevron_right',
        }),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        drawSelection(),
        CodeMirrorEditorState.allowMultipleSelections.of(true),
        rectangularSelection(),
        bracketMatching(),
        autocompletion(),
        keymap.of([
          ...historyKeymap,
          ...foldKeymap,
          ...defaultKeymap,
          ...completionKeymap,
          {
            key: 'Tab',
            preventDefault: true,
            run: indentMore,
          },
          {
            key: 'Shift-Tab',
            preventDefault: true,
            run: indentLess,
          },
        ]),
      ],
    }), // ???????????? ( Shift-Ctrl-Enter : ?????? ????????? ?????? )
  ];

  const { manager, state, setState, getContext } = useRemirror({
    extensions: extensions,
    content: content ? content : { type: 'doc' },
    selection: 'end',
  });

  useEffect(() => {
    /**
     * `cmContentTypeCast`
     * ?????? ????????? ?????? Element interface??????
     * ContentEditable ?????? ?????? interface??? ?????? ?????? ?????? ??????
     * ContentEditable??? ????????? HTMLElement??? ?????? ?????? ?????????
     */

    const viewDomList = getContext()?.view.dom.children;
    if (viewDomList !== undefined) {
      for (const cmEditor of viewDomList) {
        if (cmEditor.classList.contains('cm-editor')) {
          for (const cmScroller of cmEditor.children) {
            if (cmScroller.classList.contains('cm-scroller')) {
              for (const cmContent of cmScroller.children) {
                if (cmContent.classList.contains('cm-content')) {
                  const cmContentTypeCast = cmContent as HTMLElement;
                  cmContentTypeCast.contentEditable = `${editable}`;
                }
              }
            }
          }
        }
      }
    }
  }, [editable]);

  const onChangeState = (parameter: any) => {
    // Update the state to the latest value.
    setState(parameter.state);

    // editor testing page only
    if (setTestOnlyContentJSON) setTestOnlyContentJSON(parameter.state.doc);
    else editItemText({ id, content: parameter.state.doc }); // main page update content object
  };

  return (
    <PodoteTheme editable={editable}>
      <ThemeProvider>
        <Remirror
          manager={manager}
          initialContent={state}
          autoFocus={'end'}
          onChange={onChangeState}
          editable={editable}
        >
          {editable ? <MenuBar /> : null}
          <EditorComponent />
          {editable ? (
            <EmojiPickerReact
              itemId={id}
              editable={editable}
              chosenEmoji={chosenEmoji}
              setChosenEmoji={setChosenEmoji}
              ref={childRef}
            />
          ) : null}
          <FloatingLinkToolbar />
        </Remirror>
      </ThemeProvider>
    </PodoteTheme>
  );
}

export default PodoteEditor;
