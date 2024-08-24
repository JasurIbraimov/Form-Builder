import React from 'react'
import { Button } from './ui/button'
import { LuSend } from 'react-icons/lu'

const PublishFormBtn = () => {
  return (
    <Button value="outline" className="gap-2">
    <LuSend className="h-6 w-6" /> Publish
</Button>
  )
}

export default PublishFormBtn