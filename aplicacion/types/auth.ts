export interface Profile {
    id: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    second_last_name?: string;
    user_type: 'client' | 'talent' | 'admin';
    email?: string;
    phone?: string;
    avatar_url?: string;
    latitude?: number | null;
    longitude?: number | null;
    created_at?: string;
}

export interface TalentProfile extends Profile {
    profession: string;
    experience_years: number;
    bio?: string;
    hourly_rate?: number;
    background_check_url?: string;
    is_verified?: boolean;
}

export interface ClientProfile extends Profile {
    // Add client-specific fields if any
}
