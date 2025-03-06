export interface Author {
  _id: string;
  username: string;
}

export interface PostBrief {
  _id: string;
}

export interface Comment {
  _id: string;
  text: string;
  author: Author;
  post: PostBrief;
  createdAt: string;
  updatedAt: string;
}
