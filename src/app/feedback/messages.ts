export type Author = {
  type: "reviewer" | "me";
  initials: string;
};

export type Message = {
  author: Author;
  text: string;
  timestamp: string;
}

export type Version = {
  id: string;
  number: number;
  fileName: string;
  date: string;
  status: string;
  statusColor: string;
  footer?: string;
  messages: Message[];
};

export type Conversation = {
  id: string;
  initials: string;
  name: string;
  subtitle: string;
  preview: string;
  versions: Version[];
};

// Seed data that mimics the design
export const conversations: Conversation[] = [
  {
    id: "1",
    initials: "MR",
    name: "Maria Ramos",
    subtitle: "Associate Professor IV",
    preview: "I'll revise the problem..",
    versions: [
      {
        id: "1-v1",
        number: 1,
        fileName: "Proposal_v1.pdf",
        date: "August 10, 2025",
        status: "Rejected",
        statusColor: "text-red-600",
        footer: "Feedback for version 1 is closed.",
        messages: [
          {
            author: { type: "reviewer", initials: "CN" },
            text:
              "The research methodology section needs more detail on data collection procedures. Please expand on the sampling strategy and include justification for your chosen approach.",
            timestamp: "August 10, 2025, 2:30 PM"
          },
          {
            author: { type: "me", initials: "ME" },
            text:
              "Thank you for the feedback. I'll expand on the sampling strategy and add more details about the data collection procedures.",
            timestamp: "August 10, 2025, 2:30 PM"
          }
        ]
      }
    ]
  },
  {
    id: "2",
    initials: "JC",
    name: "Juan Dela Cruz",
    subtitle: "Associate Professor IV",
    preview: "I'll revise the problem..",
    versions: [
      {
        id: "2-v1",
        number: 1,
        fileName: "Proposal_v1.pdf",
        date: "August 10, 2025",
        status: "Rejected",
        statusColor: "text-red-600",
        footer: "Feedback for version 1 is closed.",
        messages: [
          {
            author: { type: "reviewer", initials: "CN" },
            text:
              "The research methodology section needs more detail on data collection procedures. Please expand on the sampling strategy and include justification for your chosen approach.",
            timestamp: "August 10, 2025, 2:30 PM"
          },
          {
            author: { type: "me", initials: "ME" },
            text:
              "Thank you for the feedback. I'll expand on the sampling strategy and add more details about the data collection procedures.",
            timestamp: "August 10, 2025, 2:30 PM"
          }
        ]
      },
      {
        id: "2-v2",
        number: 2,
        fileName: "Proposal_v2.pdf",
        date: "August 30, 2025",
        status: "In Review",
        statusColor: "text-slate-600",
        messages: [
          {
            author: { type: "reviewer", initials: "CN" },
            text:
              "The research methodology section needs more detail on data collection procedures. Please expand on the sampling strategy and include justification for your chosen approach.",
            timestamp: "August 30, 2025, 2:30 PM"
          },
          {
            author: { type: "me", initials: "ME" },
            text:
              "Thank you for the feedback. I'll expand on the sampling strategy and add more details about the data collection procedures.",
            timestamp: "August 30, 2025, 2:30 PM"
          }
        ]
      }
    ]
  },
  {
    id: "3",
    initials: "PR",
    name: "Pedro Reyes",
    subtitle: "Associate Professor IV",
    preview: "I'll revise the problem..",
    versions: []
  },
  {
    id: "4",
    initials: "FG",
    name: "Fidel Garcia",
    subtitle: "Associate Professor IV",
    preview: "I'll revise the problem..",
    versions: []
  }
];