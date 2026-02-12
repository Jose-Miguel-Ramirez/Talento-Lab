export interface Message {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string | null;
    media_url?: string | null;
    media_type?: 'image' | 'video' | 'file' | null;
    is_read: boolean;
    created_at: string;
}

export interface Conversation {
    id: string;
    client_id: string;
    talent_id: string;
    created_at: string;
    updated_at: string;
}

export interface ConversationPreview {
    conversation_id: string;
    other_user_id: string;
    other_user_name: string;
    other_user_avatar: string | null;
    last_message_content: string | null;
    last_message_time: string | null;
    unread_count: number;
}
