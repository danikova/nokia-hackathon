'use client'

import { SnackbarContent, CustomContentProps, closeSnackbar } from 'notistack'
import { FaXmark } from 'react-icons/fa6';
import React from 'react'

export const defaultSB = React.forwardRef<HTMLDivElement, CustomContentProps>(function ReportComplete(props, ref) {
  const {
    id,
    message,
    ...other
  } = props

  return (
    <SnackbarContent ref={ref} role="alert" {...other}>
      <div
        className="group flex gap-2 bg-primary/20 border-l-4 border-primary/80 secondary-foreground p-4 rounded-md cursor-pointer"
        role="alert"
        onClick={() => {
          closeSnackbar(id);
        }}
      >
        <p>{message}</p>
        <button className='transition delay-[75ms] opacity-10 group-hover:opacity-90'><FaXmark className="h-5 w-5" /></button>
      </div>
    </SnackbarContent>
  )
})

export const errorSB = React.forwardRef<HTMLDivElement, CustomContentProps>(function ReportComplete(props, ref) {
  const {
    id,
    message,
    ...other
  } = props

  return (
    <SnackbarContent ref={ref} role="alert" {...other}>
      <div
        className="group flex gap-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md cursor-pointer"
        role="alert"
        onClick={() => {
          closeSnackbar(id);
        }}
      >
        <p>{message}</p>
        <button className='transition delay-[75ms] opacity-10 group-hover:opacity-90'><FaXmark className="h-5 w-5" /></button>
      </div>
    </SnackbarContent>
  )
})

export const successSB = React.forwardRef<HTMLDivElement, CustomContentProps>(function ReportComplete(props, ref) {
  const {
    id,
    message,
    ...other
  } = props

  return (
    <SnackbarContent ref={ref} role="alert" {...other}>
      <div
        className="group flex gap-2 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md cursor-pointer"
        role="alert"
        onClick={() => {
          closeSnackbar(id);
        }}
      >
        <p>{message}</p>
        <button className='transition delay-[75ms] opacity-10 group-hover:opacity-90'><FaXmark className="h-5 w-5" /></button>
      </div>
    </SnackbarContent>
  )
})