import { MinusIcon } from '@heroicons/react/20/solid'

const RemoveButton = ({ className, onClick }) => {
  return (
    <div className={className}>
      <button
        onClick={onClick}
        type="button"
        className="inline-flex items-center rounded-full border border-transparent bg-red-600 p-1.5 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        <MinusIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  )
}

export default RemoveButton
