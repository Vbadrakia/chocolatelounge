import { Button } from './ui/button'; // Corrected relative import
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"; // Corrected relative import

/**
 * Dialog component
 * @returns {JSX.Element} Dialog component
 */
const DialogComponent = () => {
  return (
    <Dialog>
      <DialogContent>
        <div>
          {/* Dialog content */}
          <div>
            {/* Button container */}
            <Button onClick={() => console.log('Button clicked')} children="Click Me" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogComponent;
