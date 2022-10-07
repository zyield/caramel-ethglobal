import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function MarkdownSyntaxModal({ open, setOpen }) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-xl font-medium text-gray-900">
                          Markdown Cheat Sheet
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {/* Replace with your content */}
                      <div className="absolute inset-0 px-4 sm:px-6">
                        <p className="mb-4">
                          Source:{' '}
                          <a
                            target="_blank"
                            className="underline hover:text-gray-400"
                            href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet"
                          >
                            github.com/adam-p/markdown-here
                          </a>
                        </p>

                        <h1 className="text-lg font-bold mb-4">Headers</h1>
                        <div className="prose prose-pre mb-4">
                          <pre>
                            # H1 <br />
                            ## H2 <br />
                            ### H3 <br />
                            #### H4 <br />
                            ##### H5 <br />
                            ###### H6 <br />
                            <br />
                            Alternatively, for H1 and H2, an underline-ish
                            style: <br />
                            <br />
                            Alt-H1 <br />
                            ====== <br />
                            <br />
                            Alt-H2 <br />
                            ------ <br />
                          </pre>
                        </div>

                        <hr />
                        <h1 className="text-lg font-bold mb-4 mt-4">
                          Emphasis
                        </h1>
                        <div className="prose prose-pre mb-4">
                          <pre>
                            <p>
                              Emphasis, aka italics, with{' '}
                              <span className="italic">*asterisks*</span> or{' '}
                              <span className="italic">_underscores_</span>.
                            </p>
                            <p>
                              Strong emphasis, aka bold, with{' '}
                              <span className="font-bold">**asterisks**</span>{' '}
                              or{' '}
                              <span className="font-bold">__underscores__</span>
                              .
                            </p>
                            <p>
                              Combined emphasis with{' '}
                              <span className="font-bold italic">
                                **asterisks and _underscores_**
                              </span>
                              .
                            </p>
                            <p>
                              Strikethrough uses two tildes.{' '}
                              <span className="line-through">
                                ~~Scratch this.~~
                              </span>
                            </p>
                          </pre>
                        </div>
                        <hr />
                        <h1 className="text-lg font-bold mb-4 mt-4">Lists</h1>
                        <div className="prose prose-pre mb-4">
                          <pre>
                            1. First ordered list item
                            <br />
                            2. Another item
                            <br />
                            ⋅⋅* Unordered sub-list.
                            <br />
                            1. Actual numbers don't matter, just that it's a
                            number
                            <br />
                            ⋅⋅1. Ordered sub-list
                            <br />
                            4. And another item.
                            <br />
                            <br />
                            <br />
                            ⋅⋅⋅You can have properly indented paragraphs within
                            list items. Notice the blank line above, and the
                            leading spaces (at least one, but we'll use three
                            here to also align the raw Markdown). <br />
                            <br />
                            ⋅⋅⋅To have a line break without a paragraph, you
                            will need to use two trailing spaces.⋅⋅
                            <br />
                            ⋅⋅⋅Note that this line is separate, but within the
                            same paragraph.⋅⋅
                            <br />
                            ⋅⋅⋅(This is contrary to the typical GFM line break
                            behaviour, where trailing spaces are not required.)
                            <br />
                            <br />
                            * Unordered list can use asterisks
                            <br />
                            - Or minuses
                            <br />
                            + Or pluses
                            <br />
                          </pre>
                        </div>
                        <hr />
                        <h1 className="text-lg font-bold mb-4 mt-4">Links</h1>
                        <div className="prose prose-pre mb-4">
                          <pre>
                            [I'm an inline-style link](https://www.google.com)
                            <br />
                            <br />
                            [I'm an inline-style link with
                            title](https://www.google.com "Google's Homepage")
                            <br />
                            <br />
                            [I'm a reference-style link][Arbitrary
                            case-insensitive reference text]
                            <br />
                            <br />
                            [I'm a relative reference to a repository
                            file](../blob/master/LICENSE)
                            <br />
                            <br />
                            [You can use numbers for reference-style link
                            definitions][1]
                            <br />
                            <br />
                            Or leave it empty and use the [link text itself].
                            <br />
                            <br />
                            Some text to show that the reference links can
                            follow later.
                            <br />
                            <br />
                            [arbitrary case-insensitive reference text]:
                            https://www.mozilla.org
                            <br />
                            [1]: http://slashdot.org
                            <br />
                            [link text itself]: http://www.reddit.com
                            <br />
                          </pre>
                        </div>
                        <hr />
                        <h1 className="text-lg font-bold mb-4 mt-4">Images</h1>
                        <div className="prose prose-pre mb-4">
                          <pre>
                            Inline-style:
                            <br />
                            ![alt
                            text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png
                            "Logo Title Text 1")
                            <br />
                            <br />
                            Reference-style:
                            <br />
                            ![alt text][logo]
                            <br />
                            <br />
                            [logo]:
                            https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png
                            "Logo Title Text 2"
                            <br />
                          </pre>
                        </div>
                      </div>
                      {/* /End replace */}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
