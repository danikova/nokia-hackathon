import React from 'react';
import { FaXmark } from 'react-icons/fa6';
import { SnackbarContent, CustomContentProps, closeSnackbar } from 'notistack';

export const defaultSB = React.forwardRef<HTMLDivElement, CustomContentProps>(
  function ReportComplete(props, ref) {
    const { id, message, ...other } = props;

    return (
      <SnackbarContent ref={ref} role="alert" {...other}>
        <div
          className="secondary-foreground group flex cursor-pointer gap-2 rounded-md border-l-4 border-primary/80 bg-primary/20 p-4"
          role="alert"
          onClick={() => {
            closeSnackbar(id);
          }}
        >
          <p>{message}</p>
          <button className="opacity-10 transition delay-100 group-hover:opacity-90">
            <FaXmark className="h-5 w-5" />
          </button>
        </div>
      </SnackbarContent>
    );
  }
);

export const errorSB = React.forwardRef<HTMLDivElement, CustomContentProps>(
  function ReportComplete(props, ref) {
    const { id, message, ...other } = props;

    return (
      <SnackbarContent ref={ref} role="alert" {...other}>
        <div
          className="group flex cursor-pointer gap-2 rounded-md border-l-4 border-red-500 bg-red-100 p-4 text-red-700"
          role="alert"
          onClick={() => {
            closeSnackbar(id);
          }}
        >
          <p>{message}</p>
          <button className="opacity-10 transition delay-100 group-hover:opacity-90">
            <FaXmark className="h-5 w-5" />
          </button>
        </div>
      </SnackbarContent>
    );
  }
);

export const successSB = React.forwardRef<HTMLDivElement, CustomContentProps>(
  function ReportComplete(props, ref) {
    const { id, message, ...other } = props;

    return (
      <SnackbarContent ref={ref} role="alert" {...other}>
        <div
          className="group flex cursor-pointer gap-2 rounded-md border-l-4 border-green-500 bg-green-100 p-4 text-green-700"
          role="alert"
          onClick={() => {
            closeSnackbar(id);
          }}
        >
          <p>{message}</p>
          <button className="opacity-10 transition delay-100 group-hover:opacity-90">
            <FaXmark className="h-5 w-5" />
          </button>
        </div>
      </SnackbarContent>
    );
  }
);
