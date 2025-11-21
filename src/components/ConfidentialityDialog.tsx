import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield } from "lucide-react";

interface ConfidentialityDialogProps {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

const ConfidentialityDialog = ({ open, onAccept, onDecline }: ConfidentialityDialogProps) => {
  const [agreed, setAgreed] = useState(false);

  const handleAccept = () => {
    if (agreed) {
      onAccept();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onDecline()}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl">Confidentiality Agreement</DialogTitle>
          </div>
          <DialogDescription>
            Please read and accept the confidentiality agreement to view this idea's details
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[300px] flex-1 rounded-md border border-border p-4 my-4">
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-2">1. Purpose</h3>
              <p className="text-muted-foreground">
                This Confidentiality Agreement ("Agreement") is entered into between the idea owner
                ("Discloser") and you, the investor ("Recipient"), to protect confidential business
                information shared through the ThriveNation platform.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">2. Confidential Information</h3>
              <p className="text-muted-foreground">
                "Confidential Information" includes all business plans, financial projections,
                technical data, trade secrets, customer lists, marketing strategies, and any other
                proprietary information disclosed by the Discloser.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">3. Obligations</h3>
              <p className="text-muted-foreground mb-2">The Recipient agrees to:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Keep all Confidential Information strictly confidential</li>
                <li>Not disclose any information to third parties without written consent</li>
                <li>Use the information solely for evaluating investment opportunities</li>
                <li>Not reproduce or reverse engineer any disclosed materials</li>
                <li>Return or destroy all materials upon request</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">4. Exclusions</h3>
              <p className="text-muted-foreground">
                This agreement does not apply to information that: (a) is publicly available, (b)
                was known to Recipient before disclosure, (c) is independently developed by
                Recipient, or (d) is required to be disclosed by law.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">5. Term</h3>
              <p className="text-muted-foreground">
                This Agreement remains in effect for a period of five (5) years from the date of
                acceptance or until the information becomes publicly available.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-2">6. Legal Remedies</h3>
              <p className="text-muted-foreground">
                The Recipient acknowledges that breach of this Agreement may cause irreparable harm
                and that the Discloser shall be entitled to seek injunctive relief in addition to
                any other available remedies.
              </p>
            </section>
          </div>
        </ScrollArea>

        <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg flex-shrink-0">
          <Checkbox
            id="agree"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked === true)}
          />
          <label
            htmlFor="agree"
            className="text-sm leading-relaxed cursor-pointer"
          >
            I have read and agree to the terms of this Confidentiality Agreement. I understand
            that I am legally bound to maintain the confidentiality of all information disclosed.
          </label>
        </div>

        <DialogFooter className="flex-shrink-0 gap-2">
          <Button variant="outline" onClick={onDecline}>
            Decline
          </Button>
          <Button onClick={handleAccept} disabled={!agreed}>
            Accept & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfidentialityDialog;
