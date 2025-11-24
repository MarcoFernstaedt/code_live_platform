import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/clerk-react'
import React from 'react'

const HomePage = () => {
    return (
        <div>
            <button className='btn btn-secondary'>Click Me</button>

            <SignedOut>
                <SignInButton mode='modal'>
                    <button >
                        Login
                    </button>
                </SignInButton>
            </SignedOut>

            <SignedIn>
                <SignOutButton />
            </SignedIn>
        </div>
    )
}

export default HomePage