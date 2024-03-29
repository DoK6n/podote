import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Extension, ProsemirrorNode, RemirrorEventListenerProps, RemirrorJSON } from 'remirror';
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
// import { useTodoStore } from 'lib/stores';
import { ToggleListItemExtension, CodeMirror6Extension } from 'lib/remirror/extensions';
import { EmojiPickerReact, MenuBar, FloatingLinkToolbar, SaveButton, EditButton, CancleButton } from 'components';
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
import { UseEditorType } from 'podote/types';

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
  editorType: UseEditorType;
  setTestOnlyContentJSON?: React.Dispatch<React.SetStateAction<RemirrorJSON>>;
}

interface ChildForwardRefObjects {
  handleClickEmoji: (e?: MouseEvent) => void;
}

function PodoteEditor({ id, editable, content, editorType, setTestOnlyContentJSON }: Props) {
  const [chosenEmoji, setChosenEmoji] = useState<IEmojiData | null>(null);
  // const { findItemById } = useTodoStore();

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
    new BoldExtension(), // 굵게
    new ItalicExtension(), // 기울임
    new StrikeExtension(), // 취소선
    new UnderlineExtension(), // 밑줄
    new HeadingExtension(), // 머리말 1 ~ 6
    new CalloutExtension({ defaultType: 'blank', renderEmoji: renderDialogEmoji, defaultEmoji: '💡' }), // 콜아웃
    new HistoryExtension(), //실행 취소 및 다시 실행 명령을 제공하고 기록 관련 작업을 처리
    new ImageExtension({ enableResizing: true }), // 이미지 삽입
    new DropCursorExtension({ color: '#7963d2', width: 4 }), // 드롭한 대상이 놓일 위치를 표시
    new HorizontalRuleExtension(), // 수평선 추가
    new BlockquoteExtension(), // 인용문
    new CodeExtension(), // Inline Code Blocks
    new BulletListExtension({ enableSpine: true }), // 리스트
    new OrderedListExtension(), // 숫자 리스트
    new TaskListExtension(), // 체크박스
    new ToggleListItemExtension(), // toggling list ( Ctrl/cmd + Enter )
    // new TrailingNodeExtension(), // 마지막에 항상 한줄 띔
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
    }), // 코드블록 ( Shift-Ctrl-Enter : 블록 이전에 새줄 )
  ];

  const { manager, state, setState, getContext } = useRemirror({
    extensions: extensions,
    content: content ? content : { type: 'doc' },
    selection: 'end',
  });

  useEffect(() => {
    /**
     * `cmContentTypeCast`
     * 타입 추론에 의한 Element interface에는
     * ContentEditable 속성 관련 interface가 상속 되어 있지 않아
     * ContentEditable이 상속된 HTMLElement로 강제 타입 캐스팅
     */

    // 수정모드인 상태에서 다른 item을 수정모드로 하면 이전 아이템은 읽기 모드 + 수정중이던 내용 취소
    if (!editable) {
      // const item = findItemById({ id });
      // getContext()?.setContent(item.content);
    }

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

  const onChangeState = useCallback(
    (parameter: RemirrorEventListenerProps<Extension>) => {
      // Update the state to the latest value.
      setState(parameter.state);
      switch (editorType) {
        case 'TODO_ITEM':
          // editItemText({ id, content: parameter.state.doc.toJSON() }); // main page update content object
          break;
        case 'TRASH_VIEW':
          break;
        case 'TEST_PAGE':
          // editor testing page only
          if (setTestOnlyContentJSON) {
            const prosmirrorNodeToRemirrorJson: RemirrorJSON = parameter.state.doc.toJSON();
            setTestOnlyContentJSON(prosmirrorNodeToRemirrorJson);
          }
          break;
      }
    },
    [editorType, setState, setTestOnlyContentJSON],
  );

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
          {editable === true ? <SaveButton id={id} /> : null}
          {editable === true ? <CancleButton id={id} content={content} /> : <EditButton id={id} />}
        </Remirror>
      </ThemeProvider>
    </PodoteTheme>
  );
}

export default PodoteEditor;
