
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { getCurrentUser } from "@/lib/auth/actions/auth";
import { closeOlderVersionsForDraft, createConversation, createDraftSubmission, createVersionFeedback, getConversationByParticipants, sendMessage } from "@/lib/db/message-db";
import { searchAdvisersByName } from "@/lib/db/user-db";
import { ChatMessage, Conversation, DraftSubmission } from "@/lib/model/messages";
import { User } from "@/lib/model/user";
import { cn } from "@/lib/utils";
import { uploadPDFFile } from "@/utils/supabase/storage/file-upload";
import { DialogTitle } from "@radix-ui/react-dialog";
import { CommandInput } from "cmdk";
import { is } from "date-fns/locale";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type SubmitDraftModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  // onSubmit?: (data: {
  //   recipient: string;
  //   recipientId: string;
  //   title: string;
  //   file: File | null;
  //   message: string;
  // }) => void;
  draft?: DraftSubmission | null;
}

export function SubmitDraftModal({
  isOpen,
  onOpenChange,
  // onSubmit,
  draft
}: SubmitDraftModalProps) {

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedAdviser, setSelectedAdviser] = useState<User | null>(null);
  const [advisers, setAdvisers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      const currentUser = await getCurrentUser()
      setUser(currentUser);
    }
    loadUser();
  }, [])
    
  // Fetch advisers when search query changes
  useEffect(() => {
    async function fetchAdvisers() {
      setIsLoading(true);

      try {
        const data = await searchAdvisersByName(searchQuery);
        console.log("Fetched advisers:", data);
        setAdvisers(data);
      } catch (error) {
        console.error("Error fetching advisers:", error);
      } finally {
        setIsLoading(false);
      }
    }

    const timeoutId = setTimeout(() => {
      fetchAdvisers()
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery])


  useEffect(() => {
    if(isOpen) {
      setIsLoading(true);
      searchAdvisersByName("").then((data) => {
        console.log('Initial advisers:', data); // Debug log
        setAdvisers(data);
        setIsLoading(false);
      }).catch((error) => {
        console.error('Error loading advisers:', error);
        setAdvisers([]);
        setIsLoading(false);
      });
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }

  const handleSubmit = async () => {

    if(!user) {
      alert("User not authenticated.");
      return;
    }

    const isNewSubmission = !draft;
    const isModifiedSubmission = !!draft;

    // Validate per branch
    if (isNewSubmission) {
      if (!selectedAdviser) {
        alert("Please select an adviser.");
        return;
      }
      if (!title.trim()) {
        alert("Please enter a draft title.");
        return;
      }
    }
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }
    if (!message.trim()) {
      alert("Please enter a message.");
      return;
    }

    setIsSubmitting(true);

    try {
      // For conversation if already existing between student and adviser
      // 1) Get or create conversation
      // 2) Get or create draft submission
      let conversationId: string | undefined;

      // 1) Conversation only needed for New Draft flow
      if (isNewSubmission) {
        const existingConversation = await getConversationByParticipants(user.userId, selectedAdviser!.userId);
        conversationId = existingConversation?.conversation_id;

        if (!conversationId) {
          const createdConversation = await createConversation(user.userId, selectedAdviser!.userId);
          if (!createdConversation) throw new Error("Failed to create conversation.");
          conversationId = createdConversation.conversation_id;
        }
      }

      // 2) Draft: create if New Draft; reuse if Modified
      let draftId: string;
      if (isNewSubmission) {
        const newDraftPayload: DraftSubmission = {
          conversation_id: conversationId!,
          draft_title: title.trim(),
        };
        const createdDraft = await createDraftSubmission(newDraftPayload);
        if (!createdDraft?.draft_id) throw new Error("Failed to create draft submission.");
        draftId = createdDraft.draft_id!;
      } else {
        if (!draft?.draft_id) throw new Error("Draft information is missing.");
        draftId = draft.draft_id!;
      }

      // 3) Upload file
      const { path } = await uploadPDFFile({
        file,
        bucket: "thesis-documents",
        folder: `drafts/${draftId}`,
        fileName: file.name,
      });
      if (!path) throw new Error("File upload failed.");

      await closeOlderVersionsForDraft(draftId);

      // 4) Create version feedback
      const version = await createVersionFeedback({
        draft_id: draftId,
        file_url: path,
        file_name: file.name,
      });
      if (!version?.version_id) throw new Error("Failed to create version feedback.");

      

      // 5) Send initial message (version-scoped)
      const initialMessage = isNewSubmission
      ? `${message.trim()}\n\nDraft: ${title}\n📄 File: ${file.name}`
      : message.trim();

      await sendMessage({
        version_id: version.version_id,
        message: initialMessage,
        sender_id: user.userId,
      });

      // 6) Reset UI and close
      setSelectedAdviser(null);
      setTitle("");
      setFile(null);
      setMessage("");
      setSearchQuery("");
      onOpenChange(false);
      router.refresh();

    } catch(error) {
      console.error("Submission failed:", error);
    
      // More detailed error message
      if (error instanceof Error) {
        alert(`Failed to submit draft: ${error.message}`);
      } else {
        alert("Failed to submit draft. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const getFullName = (adviser: User) => {
    return `${adviser.firstName} ${adviser.lastName}`.trim();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          {!draft ? (
            <DialogTitle className="text-2xl font-semibold">
              Submit New Draft
            </DialogTitle>
          ) : (
            <DialogTitle className="text-2xl font-semibold">
              Submit Modified Draft
            </DialogTitle>
          )}
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Send to */}
          {!draft && (
            <div className="space-y-2">
              <Label htmlFor="recipient" className="text-base font-medium">Send To</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-12"
                  >
                    {selectedAdviser ? (
                      <div className="flex flex-col items-start">
                        <span>{getFullName(selectedAdviser)}</span>
                        <span className="text-xs text-muted-foreground">{selectedAdviser.department}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">Select adviser...</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search advisers..."
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {isLoading ? "Loading..." : "No advisers found."}
                      </CommandEmpty>
                      <CommandGroup>
                        {advisers.map((adviser) => (
                          <CommandItem
                            key={adviser.userId}
                            value={adviser.userId}
                            onSelect={() => {
                              setSelectedAdviser(adviser)
                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedAdviser?.userId === adviser.userId ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span>{getFullName(adviser)}</span>
                              <span className="text-xs text-muted-foreground">
                                {adviser.department}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Draft Submission Title */}
          {!draft && (
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
          )}

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
            disabled={!file || isSubmitting}
          >
            Submit Draft
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}