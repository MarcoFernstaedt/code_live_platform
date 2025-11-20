import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react'
import './App.css'

const App = () => {
  return (
    <>
      <h1>Welcome to the app</h1>

      <SignedOut>
        <SignInButton mode='modal' />
      </SignedOut>

      <SignedIn>
        <SignInButton mode='modal' />
      </SignedIn>
    </>
  )
}

export default App
