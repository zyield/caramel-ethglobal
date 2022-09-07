import { CheckCircleIcon } from '@heroicons/react/20/solid'

export default function ContentPopup({ url }) {
  if (!url) return null

  return (
    <div className="rounded-md bg-green-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon
            className="h-5 w-5 text-green-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <p className="break-all text-sm font-medium text-green-800">
            Successfully uploaded to &nbsp;
            <a href={url} target="_blank" rel="noreferrer">
              {url}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
