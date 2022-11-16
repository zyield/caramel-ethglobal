import React, { useCallback, useMemo } from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import {
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
} from 'slate'
import { withHistory } from 'slate-history'

import {
  PlusCircleIcon,
  PlayCircleIcon,
  CodeBracketSquareIcon,
  CodeBracketIcon,
  PhotoIcon,
  ListBulletIcon,
  Bars3CenterLeftIcon,
  Bars3BottomRightIcon,
  Bars3Icon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/react/24/outline'


// TODO:
// * toolbar
// * `clear` button
// * images
// * links
// * more text controls / formatting

const Button = props => <button type="button" {...props} className="mr-5">{ props.children }</button>
const Toolbar = props => <div {...props}>{ props.children }</div>

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

const renderIcon = icon => {
  switch (icon) {
    // case "format_list_bulleted":
    //   return <ListBulletIcon className="w-6" />
    case "format_align_left":
      return  <Bars3CenterLeftIcon title="Align left" className="w-6" />
    case "format_align_center":
      return <Bars3Icon title="Align center" className="w-6"/>
    case "format_align_right":
       return <Bars3BottomRightIcon title="Align right" className="w-6"/>
     case "format_align_justify":
       return <Bars3Icon className="w-6"/>
    case "format_bold":
      return <span className="w-6">Bold</span>
    case "format_italic":
      return <span className="w-6">Italic</span>
    case "format_underlined":
      return <span className="w-6">Underline</span>
    case "block_code":
      return <CodeBracketSquareIcon title="Block of code" className="w-6"/>
    case "code":
      return <CodeBracketIcon title="Code" className="w-6"/>
    case "looks_one":
      return <span className="w-6">H1</span>
    case "looks_two":
      return <span className="w-6">H2</span>
    case "format_quote":
      return <ChatBubbleBottomCenterTextIcon title="Quote" className="w-6"/>
    case "format_list_numbered":
    default:
      return null
  }
}

const MainEditor = () => {
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const initialValue = useMemo(
    () =>
    JSON.parse(localStorage.getItem('content')) || [
      {
        type: 'paragraph',
        children: [{ text: 'Please type your content here' }],
      },
    ],
    []
  )

  const onChange = value => {
      let isAstChange = editor.operations.some(
        op => 'set_selection' !== op.type
      )
      if (isAstChange) {
        // Save the value to Local Storage.
        let content = JSON.stringify(value)
        localStorage.setItem('content', content)
      }
    }

  return (
    <Slate onChange={onChange} editor={editor} value={initialValue}>
      <Toolbar className="flex text-zinc-100 mb-10">
        <MarkButton format="bold" icon="format_bold" />
        <MarkButton format="italic" icon="format_italic" />
        <MarkButton format="underline" icon="format_underlined" />
        <MarkButton format="code" icon="code" />
        <BlockButton format="block-code" icon="block_code" />
        <BlockButton format="heading-one" icon="looks_one" />
        <BlockButton format="heading-two" icon="looks_two" />
        <BlockButton format="block-quote" icon="format_quote" />
        { /* <BlockButton format="numbered-list" icon="format_list_numbered" /> */ }
        { /* <BlockButton format="bulleted-list" icon="format_list_bulleted" /> */ }
        <BlockButton format="left" icon="format_align_left" />
        <BlockButton format="center" icon="format_align_center" />
        <BlockButton format="right" icon="format_align_right" />
        { /* <BlockButton format="justify" icon="format_align_justify" /> */ }
      </Toolbar>
      <Editable
        className="prose text-white"
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={event => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event)) {
              event.preventDefault()
              const mark = HOTKEYS[hotkey]
              toggleMark(editor, mark)
            }
          }
        }}
      />
    </Slate>
  )
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })
  let newProperties: Partial<SlateElement>
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
  }
  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  )

  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

export const Element = ({ attributes, children, element }) => {
  const style = { textAlign: element.align }
  switch (element.type) {
    case 'paragraph':
      return (
        <p style={style} {...attributes} className="dark:text-zinc-400">
          { children }
        </p>
      )
    case 'block-code':
      return (
        <pre style={style} {...attributes}>
          <code>{children}</code>
        </pre>
      )
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      )
    case 'heading-one':
      return (
        <h1 style={style} {...attributes} className="mt-2 block text-center text-3xl font-bold leading-8 tracking-tight sm:text-4xl">
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 style={style} {...attributes} className="mt-2 block text-center text-xl font-bold leading-8 tracking-tight sm:text-2xl">
          {children}
        </h2>
      )
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

export const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      {renderIcon(icon)}
    </Button>
  )
}

const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      {renderIcon(icon)}
    </Button>
  )
}

export default MainEditor
