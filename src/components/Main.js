import Profile from './Profile'
import TextArea from './TextArea'

function Main() {
  return (
    <main className="flex justify-center">
      <div className="flex flex-1 flex-col justify-center items-center">
        <Profile />
        <div className="mt-20 w-2/5">
          <TextArea />
        </div>
      </div>
    </main>
  )
}

export default Main
