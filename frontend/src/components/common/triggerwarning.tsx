import { Dispatch, SetStateAction } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "shadcn/components/ui/alert-dialog";
import { Checkbox } from "shadcn/components/ui/checkbox"

const TriggerWarning = (props: { isOpen: boolean, setIsOpen: Dispatch<SetStateAction<boolean>>, onCheckedChange: (checkedState: boolean) => void }) => {
  return (
    <AlertDialog open={props?.isOpen} onOpenChange={() => props?.setIsOpen(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl">CONTENT WARNING</AlertDialogTitle>
          <AlertDialogDescription className="text-lg">
            This digital history exhibition contains degrading depictions of women and people of color from the late 1800s and early 1900s.
            The tradecards and postcards (many of which are racist and sexist) have been historically contextualized to understand the visual culture
            of domestic labor in the age of New Imperialism, Jim Crow segregation, and Asian Exclusion
            <div className="flex items-center space-x-2 my-4 rounded-md">
              <Checkbox id="terms" onCheckedChange={props?.onCheckedChange} />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-neutral-700"
              >
                Don't show again for the next 30 days
              </label>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="text-md">Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default TriggerWarning;