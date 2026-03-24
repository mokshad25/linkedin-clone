import { Post, Profile, PostComment } from './database'

export interface PostWithAuthor extends Post {
    author: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'headline' | 'username'>
    is_liked: boolean
    is_owner: boolean
}

export interface CommentWithAuthor extends PostComment {
    author: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'headline' | 'username'>
    is_owner: boolean
}