import { SnackbarProvider } from 'notistack';
import { defaultSB, errorSB, successSB } from './snackbarVariants';

export default function Snackbar() {
  return (
    <SnackbarProvider
      Components={{
        default: defaultSB,
        error: errorSB,
        success: successSB,
      }}
    />
  );
}
