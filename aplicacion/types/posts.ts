export interface Post {
    id: string;
    talent_id: string;
    content: string;
    image_url?: string;
    likes_count: number;
    created_at: string;
    profiles?: {
        first_name: string;
        last_name: string;
        avatar_url?: string;
    };
}
