import React from 'react'
import Link from "next/link"

function Logo() {
  return (
    <Link href={"/"} className='font-bold text-3xl bg-gradient-to-r from-orange-400 to-red-400 text-transparent bg-clip-text hover:cursor-pointer'>FormBuilder</Link>
  )
}

export default Logo