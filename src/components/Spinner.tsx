import React from 'react'
import { Loader } from 'lucide-react'

const Spinner = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
        <Loader className='animate-spin text-blue-500' size={48} />
        <span className='ml-2 text-lg'>Loading...</span>
    </div>
  )
}

export default Spinner