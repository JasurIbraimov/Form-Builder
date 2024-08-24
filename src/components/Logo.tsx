import React from 'react'
import Link from "next/link"

function Logo() {
  return (
    <Link href={"/"} className='font-bold text-3xl bg-gradient-to-r from-green-400 to-teal-400 text-transparent bg-clip-text hover:cursor-pointer'>FormBuilder</Link>
  )
}

export default Logo