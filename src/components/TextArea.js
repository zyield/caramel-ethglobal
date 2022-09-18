import { useState } from 'react'
import { Tab } from '@headlessui/react'
import {
  AtSymbolIcon,
  CodeBracketIcon,
  LinkIcon
} from '@heroicons/react/20/solid'

import { convert } from '../blog/converter'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function TextArea({ onSubmit }) {
  const [text, setText] = useState('')
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSumit = async e => {
    e.preventDefault()
    setLoading(true)

    let payload = text
    if (title) {
      payload = `# ${title}\n${text}`
    }

    await onSubmit(payload)

    setLoading(false)
  }

  return (
    <form className="w-full" onSubmit={handleSumit}>
      <div className="relative rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
        <label
          htmlFor="title"
          className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
        >
          Title
        </label>
        <input
          type="text"
          name="title"
          onChange={e => setTitle(e.target.value)}
          id="title"
          className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
          placeholder="My perfect post"
        />
      </div>
      <Tab.Group>
        {({ selectedIndex }) => (
          <>
            <Tab.List className="flex items-center mt-5">
              <Tab
                className={({ selected }) =>
                  classNames(
                    selected
                      ? 'text-gray-900 bg-gray-100 hover:bg-gray-200'
                      : 'text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100',
                    'rounded-md border border-transparent px-3 py-1.5 text-sm font-medium'
                  )
                }
              >
                Write
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    selected
                      ? 'text-gray-900 bg-gray-100 hover:bg-gray-200'
                      : 'text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100',
                    'ml-2 rounded-md border border-transparent px-3 py-1.5 text-sm font-medium'
                  )
                }
              >
                Preview
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-2">
              {({ selectedIndex }) => (
                <>
                  <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
                    <label htmlFor="comment" className="sr-only">
                      Comment
                    </label>
                    <div>
                      <textarea
                        rows={5}
                        onChange={e => setText(e.target.value)}
                        name="comment"
                        id="comment"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Add your text..."
                        value={text}
                      />
                    </div>
                  </Tab.Panel>
                  <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
                    <div className="border-b">
                      <div className="mx-px mt-px px-3 pt-2 pb-12 text-sm leading-5 text-gray-800">
                        <div
                          className="markdown-preview text-left"
                          dangerouslySetInnerHTML={{
                            __html:
                              selectedIndex == 1 ? convert(text) : 'Preview'
                          }}
                        ></div>
                      </div>
                    </div>
                  </Tab.Panel>
                </>
              )}
            </Tab.Panels>
          </>
        )}
      </Tab.Group>
      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Post
        </button>
      </div>
    </form>
  )
}
