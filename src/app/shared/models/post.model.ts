export interface Author {
  _id: string;
  username: string;
}

export interface Post {
  _id: string;
  text: string;
  author: Author;
  createdAt: string;
  updatedAt?: string;
}
