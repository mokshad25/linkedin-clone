import { z } from 'zod'

export const createPostSchema = z.object({
    content: z
        .string()
        .min(1, 'Post cannot be empty')
        .max(3000, 'Post cannot exceed 3000 characters'),
})

export const createCommentSchema = z.object({
    content: z
        .string()
        .min(1, 'Comment cannot be empty')
        .max(1000, 'Comment cannot exceed 1000 characters'),
})

export type CreatePostValues = z.infer<typeof createPostSchema>
export type CreateCommentValues = z.infer<typeof createCommentSchema>