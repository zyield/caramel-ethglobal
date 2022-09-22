import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function EnsDomain({ domain, checked, setChecked }) {
  return (
    <div
      onClick={() => setChecked(!checked)}
      className={classNames(
        !checked ? '' : '',
        'transition group-hover:scale-100 group-hover:opacity-100 dark:bg-zinc-800/50 py-2 w-1/4 sm:rounded-2xl text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100 cursor-pointer hover:border-zinc-800/80 hover:ring-zinc-200 hover:ring-1 shadow-sm border border-zinc-100 p-6 dark:border-zinc-700/40"'
      )}
    >
      <CheckCircleIcon
        className={classNames(
          !checked ? 'invisible' : '',
          'h-7 w-7 text-indigo-600 absolute -right-3 -top-3 bg-white'
        )}
        aria-hidden="true"
      />

      {domain}
    </div>
  )
}

export default EnsDomain
