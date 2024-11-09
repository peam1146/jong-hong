import * as AlertDialog from '@radix-ui/react-alert-dialog'
import * as React from 'react'

interface PopupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel: string
  cancelLabel?: string
  onConfirm: () => void
  children?: ReactNode
  icon?: ReactNode
}

{
  /* <NotiPopup
        open={popupOpen}
        onOpenChange={setPopupOpen}
        title="Notification"
        description="Kindly reminder! There is 15 mins left to check out"
        confirmLabel="Got it"
        onConfirm={handleConfirm}
        icon={<SmileyWink weight="regular" size={72} />}
      >
        {/* Optional custom content */
}
// </NotiPopup> */}

export function NotiPopup({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  children,
  icon,
}: PopupProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/50 z-20" />
        <AlertDialog.Content className="fixed inset-0 z-30 flex items-center justify-center p-4">
          <div className="bg-cream border-2 border-black rounded-2xl w-[320px] shadow-lg">
            <div className="bg-orange border-black pt-1 pb-1 pl-4 border-b-2 rounded-t-2xl flex items-center">
              <AlertDialog.Title className="text-h4 text-white">{title}</AlertDialog.Title>
            </div>
            <div className="p-4 pr-12 pl-12 flex flex-col justify-center items-center gap-1">
              {icon}
              <AlertDialog.Description className="text-black text-h5">
                {description}
              </AlertDialog.Description>

              {/* Additional custom content */}
              {children}

              <div className="flex gap-4 mt-4">
                {/* <AlertDialog.Cancel asChild>
                  <button className="bg-gray-200 border-2 border-black rounded-md px-4 py-2">
                    {cancelLabel}
                  </button>
                </AlertDialog.Cancel> */}
                <AlertDialog.Action asChild>
                  <button
                    onClick={onConfirm}
                    className="bg-orange text-white border-2 border-black rounded-md px-6 py-2"
                  >
                    {confirmLabel}
                  </button>
                </AlertDialog.Action>
              </div>
            </div>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
