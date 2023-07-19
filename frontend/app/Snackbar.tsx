'use client'

import { SnackbarProvider } from "notistack"
import { defaultSB, errorSB } from "./_components/SnackbarVariants"

export default function Snackbar() {
  return <>
    <SnackbarProvider
      Components={{
        default: defaultSB,
        error: errorSB
      }}
    />
  </>
}