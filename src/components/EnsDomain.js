import { CheckCircleIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


function EnsDomain({ domain, checked, setChecked }) {

  return (
    <div 
      onClick={() => setChecked(!checked) }
      className={classNames(!checked ? 'border-gray-200' : 'border-indigo-500 ring-1 ring-indigo-500', 'border border-gray-200 shadow-sm bg-white p-3 rounded-lg text-gray-800 text-lg font-medium rounded-l-md relative hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 cursor-pointer')}>

      <CheckCircleIcon
        className={classNames(!checked ? 'invisible' : '', 'h-7 w-7 text-indigo-600 absolute -right-3 -top-3 bg-white')}
        aria-hidden="true"
      />

      {domain}
    </div>
  )

}

export default EnsDomain
