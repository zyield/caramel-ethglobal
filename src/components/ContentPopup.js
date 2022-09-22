import { CheckCircleIcon } from '@heroicons/react/20/solid'

export default function ContentPopup({ url }) {
  if (!url) return null

  return (
    <div className="rounded-md bg-zinc-700 p-4 text-center">
      <div className="flex justify-center">
        <div className="flex-shrink-0">
          <CheckCircleIcon
            className="h-5 w-5 text-green-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <p className="break-all text-sm font-medium text-zinc-100 text-center">
            Successfully uploaded to {'\n'}
            <a href={url} target="_blank" rel="noreferrer">
              {url}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
