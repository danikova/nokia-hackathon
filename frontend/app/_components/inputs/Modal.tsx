'use client'

import { useRouter } from "next/navigation";
import { ReactElement, SyntheticEvent, useCallback } from "react";
import Button from "./Button";

export default function Modal({
  title,
  children,
  acknowledgeBtn,
  onCancel
}: {
  title: string,
  children: string | ReactElement | ReactElement[],
  acknowledgeBtn: ReactElement<typeof Button>;
  onCancel?: (e: SyntheticEvent) => void
}) {
  const router = useRouter();
  const _onCancel = useCallback((e: SyntheticEvent) => {
    onCancel && onCancel(e);
    router.back();
  }, [router, onCancel]);

  return (
    <div className="relative z-[100]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-900/70 transition-opacity backdrop-blur-sm"></div>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-md bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">{title}</h3>
                  <div className="mt-2">
                    {children}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 flex sm:flex-row-reverse sm:px-6 gap-4">
              {acknowledgeBtn}
              <Button className="from-inherit via-inherit to-inherit text-primary border-primary border-2 py-[8px]" onClick={_onCancel}>Cancel</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
