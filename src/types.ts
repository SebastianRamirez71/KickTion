export interface User {
  id?: string;
  kick_id: string;
  email: string;
  username: string;
  is_moderator?: boolean;
  is_stremear?: boolean;
  created_at: Date;
  updated_at: Date;

}

export interface Post {
  id: string;
  created_at: Date;
  posts_id: string | null;
  youtube_url: string;
  title: string;
  upvotes: number;
  downvotes: number;
  is_approved: boolean;
  updated_at: Date;
  user_id: string;
}

export interface Posts {
  id: string;
  stremear_id: string;
  title: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Votes {
  id: string;
  post_id: string;
  user_id: string;
  is_upvote: boolean;
  created_at: Date;
}

export interface KickUser {
  data: Array<{
    user_id: string;
    email: string;
    name: string;
    profile_picture: string;
  }>;
  message: string;
}
