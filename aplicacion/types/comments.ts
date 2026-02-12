export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at: string;
    // Joined profile data
    profiles?: {
        first_name: string;
        last_name: string;
        avatar_url: string;
    };
}
