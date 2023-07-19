'use client'

import { SnackbarProvider } from "notistack"
import { defaultSB, errorSB, successSB } from "./_components/SnackbarVariants"

export default function Snackbar() {
  return <>
    <SnackbarProvider
      Components={{
        default: defaultSB,
        error: errorSB,
        success: successSB
      }}
    />
  </>
}