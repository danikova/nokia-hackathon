import { SnackbarProvider } from "notistack";
import { defaultSB, errorSB, successSB } from "./SnackbarVariants";

export default function Snackbar() {
  return (
    <>
      <SnackbarProvider
        Components={{
          default: defaultSB,
          error: errorSB,
          success: successSB,
        }}
      />
    </>
  );
}
