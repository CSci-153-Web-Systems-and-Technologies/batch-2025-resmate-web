
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadPDFFile } from "@/utils/supabase/storage/client";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";

type SubmitDraftModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: {
    recipient: string;
    title: string;
    file: File | null;
    message: string;
  }) => void;
}

export function SubmitDraftModal({
  isOpen,
  onOpenChange,
  onSubmit,
}: SubmitDraftModalProps) {
  const [recipient, setRecipient] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }

  const handleSubmit = async () => {
    try {
      const result = await uploadPDFFile({
        file: file as File,
        bucket: 'thesis-documents',
        folder: 'drafts',
        fileName: `${file?.name}.pdf`
      })
    } catch(error) {
      console.error("File upload failed:", error);
    }

    onSubmit?.({ recipient, title, file, message });
    setRecipient("");
    setTitle("");
    setFile(null);
    setMessage("");
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Submit New Draft
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
          {/* Send to */}
            <Label htmlFor="recipient" className="text-base font-medium">Send To</Label>
            <Input
              id="recipient"
              placeholder="e.g. Juan Dela Cruz"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Draft Submission Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-medium">Draft Submission Title</Label>
            <Input
              id="title"
              placeholder="e.g. Research Proposal on AI"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file" className="sr-only">Choose File</Label>
            <div className="relative">
              <Input
                id="file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <Label
                htmlFor="file"
                className="flex items-center justify-between h-12 px-4 border border-input rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground"
              >
                <span className="text-gray-500">
                  {file ? file.name : "Upload Draft Document (PDF only)"}
                </span>
                <span className="text-gray-400">
                  {!file && "Filename.pdf"}
                </span>
              </Label>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="sr-only">Message</Label>
            <Textarea
              id="message"
              placeholder="Write your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            className="w-full h-12 text-base"
            disabled={!recipient || !title || !file}
          >
            Submit Draft
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}