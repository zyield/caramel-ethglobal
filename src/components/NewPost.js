import Editor from './Editor'

const NewPost = ({ onSubmit, onCancel, loading }) => {
  const handleSubmit = async e => {
    e.preventDefault()

    let raw = localStorage.getItem('content')
    let content = JSON.parse(raw)

    await onSubmit(content)

    localStorage.removeItem('content')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex justify-end mb-8 border-b-grey-400">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none bg-zinc-50 font-medium text-zinc-900 hover:bg-zinc-100 active:bg-zinc-100 active:text-zinc-900/60 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:active:bg-zinc-800/50 dark:active:text-zinc-50/70"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="ml-5 bg-zinc-800 font-semibold text-zinc-100 hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70 inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none"
        >
          Publish
        </button>
      </div>

      <Editor />
    </form>
  )
}

export default NewPost
