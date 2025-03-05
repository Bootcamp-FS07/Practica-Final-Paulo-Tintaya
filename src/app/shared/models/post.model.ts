export interface Author {
  _id: string;
  username: string; // Will be empty if not provided
}

export interface Post {
  _id: string;
  text: string;
  author: Author;  // Always an object
  createdAt: string;
  updatedAt?: string;
}
