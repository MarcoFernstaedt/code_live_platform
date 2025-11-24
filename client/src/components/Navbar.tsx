import { SparklesIcon } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router'

const Navbar = () => {
    return (
        <nav className='bg-base-100/80 backdrop-blur-md border-b border-primar/20 sticky top-0 z-50 shadow-lg'>
            <div className='max-w-7xl mx-auto p-4 flex items-center justify-between'>
                <Link to='/'
                    className='group flex items-center gap-3 hover:scale-105 transition-transform duration-200'
                >
                    <div className='size-10 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent flex items-center justify-center shadow-lg'>
                        <SparklesIcon className='size-6 text-white' />
                    </div>

                    <div className="flex flex-col">
                        <span className="font-black text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
                            InterviewLab
                        </span>
                        <span className="text-xs text-base-content/60 font-medium -mt-1">Code Together</span>
                    </div>
                </Link>
            </div>
        </nav>
    )
}

export default Navbar