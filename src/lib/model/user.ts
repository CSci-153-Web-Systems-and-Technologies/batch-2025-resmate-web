export type User = {
  userId: string;
  email?: string;
  firstName: string;
  lastName: string;
  role?: string;
  department?: string;
}

export type Thesis = {
  thesisId: string;
  userId: string;
  title: string;
  description: string;
  createdAt?: string;
}