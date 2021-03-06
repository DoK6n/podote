import create from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { RemirrorJSON } from 'remirror';
import { WritableDraft } from 'immer/dist/internal';
interface Todo {
  id: string;
  content: RemirrorJSON;
  done: boolean;
  editable: boolean;
}

interface TodoStore {
  todos: Todo[];
  getContentNormalTextFormat(action: { text: string }): RemirrorJSON;
  addItem(action: { text: string }): void;
  editItemText(action: { id: string; content: RemirrorJSON }): void;
  setEditableById(action: { id: string }): void;
  toggleItem(action: { id: string }): void;
  dragItem(action: { draggingItemIndex: number; afterDragItemIndex: number }): void;
  removeItem(action: { id: string }): void;
}

const contentNormalTextFormat = (text: string): RemirrorJSON => ({
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [
        {
          type: 'text',
          text: text,
        },
      ],
    },
  ],
});

const content00: RemirrorJSON = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'done',
        },
      ],
    },
    {
      type: 'callout',
      attrs: {
        type: 'blank',
        emoji: '💡',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'BLANK',
            },
          ],
        },
      ],
    },
  ],
};
const content01: RemirrorJSON = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [
        {
          type: 'text',
          text: 'Content01',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Simple ',
        },
        {
          type: 'text',
          marks: [{ type: 'italic' }],
          text: 'Todo Memo App',
        },
      ],
    },
    {
      type: 'callout',
      attrs: {
        type: 'info',
        emoji: '💡',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'INFO',
            },
          ],
        },
      ],
    },
  ],
};
const content02: RemirrorJSON = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [
        {
          type: 'text',
          text: 'Content02',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Simple ',
        },
        {
          type: 'text',
          marks: [{ type: 'italic' }],
          text: 'Todo Memo App',
        },
      ],
    },
    {
      type: 'callout',
      attrs: {
        type: 'warning',
        emoji: '⚠️',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'WARNING',
            },
          ],
        },
      ],
    },
  ],
};
const content03: RemirrorJSON = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [
        {
          type: 'text',
          text: 'Content03',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Simple ',
        },
        {
          type: 'text',
          marks: [{ type: 'italic' }],
          text: 'Todo Memo App',
        },
      ],
    },
    {
      type: 'callout',
      attrs: {
        type: 'error',
        emoji: '🚨',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'ERROR',
            },
          ],
        },
      ],
    },
  ],
};
const content04: RemirrorJSON = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [
        {
          type: 'text',
          text: 'Content04',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Simple ',
        },
        {
          type: 'text',
          marks: [{ type: 'italic' }],
          text: 'Todo Memo App',
        },
      ],
    },
    {
      type: 'callout',
      attrs: {
        type: 'success',
        emoji: '✅',
      },
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'SUCCESS',
            },
          ],
        },
      ],
    },
  ],
};

const initState: Todo[] = [
  { id: uuidv4(), content: content00, done: true, editable: false },
  { id: uuidv4(), content: content01, done: false, editable: false },
  { id: uuidv4(), content: content02, done: false, editable: false },
  { id: uuidv4(), content: content03, done: false, editable: false },
  { id: uuidv4(), content: content04, done: false, editable: false },
];

/**
 * ## zustand 상태관리 라이브러리
 * - zustand middleware
 *    - devtools : 크롬 Redux DevTools에 적용
 *    - persist : 로컬 스토리지에 저장
 *    - immer : react 배열/객체 업데이트시 불변성 관리
 *
 * Todo Contents 상태값 관리
 */
export const useTodoStore = create<TodoStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        todos: initState,
        getContentNormalTextFormat(action) {
          return contentNormalTextFormat(action.text);
        },
        addItem(action) {
          // 할일 추가
          set(({ todos }) => {
            const newItemId = uuidv4();
            todos.unshift({
              id: newItemId,
              content: contentNormalTextFormat(action.text),
              done: false,
              editable: true,
            });
            todos.forEach(todo => {
              if (todo.id !== newItemId) {
                todo.editable = false;
              }
            });
          });
        },
        editItemText(action) {
          // 할일 내용 수정
          set(({ todos }) => {
            const todo = todos.find(todo => todo.id === action.id);
            todo!.content = action.content; // 해당 피연산자가 null, undeifned가 아니라고 단언
          });
        },
        setEditableById(action) {
          // 할일 수정모드 설정
          set(({ todos }) => {
            todos.forEach(todo => (todo.id === action.id ? (todo.editable = !todo.editable) : (todo.editable = false)));
          });
        },
        toggleItem(action) {
          // 할일/완료 토글, 완료된 할일은 목록의 최하단으로 이동
          set(({ todos }) => {
            const findById = (todo: WritableDraft<Todo>) => todo.id === action.id;

            const todo = todos.find(findById);
            todo!.done = !todo?.done;

            const index = todos.findIndex(findById);
            if (todo?.done === true) {
              // todo 배열에서 토글된 item 제거 후 배열의 맨 뒤로 이동
              const todoWithDoneRemoved = todos.splice(index, 1); // splice의 return 값은 삭제한 값 array
              todos.splice(todos.length, 0, todoWithDoneRemoved[0]); // 3번쨰 인자값을 1번째 인자값 위치로 이동
            }
          });
        },
        dragItem(action) {
          // 할일 드래그 앤 드롭
          set(({ todos }) => {
            const draggingItem = todos.splice(action.draggingItemIndex, 1);
            todos.splice(action.afterDragItemIndex, 0, draggingItem[0]);
          });
        },
        removeItem(action) {
          // 목록에서 할일 제거
          set(({ todos }) => {
            const index = todos.findIndex(todo => todo.id === action.id);
            todos.splice(index, 1);
          });
        },
      })),
    ),
  ),
);
