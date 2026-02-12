import { supabase } from '@/lib/supabase';

export async function getOrCreateConversation(clientId: string, talentId: string) {
    try {
        // Check if conversation already exists
        const { data: existingConv, error: fetchError } = await supabase
            .from('conversations')
            .select('id')
            .or(`and(client_id.eq.${clientId},talent_id.eq.${talentId}),and(client_id.eq.${talentId},talent_id.eq.${clientId})`)
            .maybeSingle();

        if (fetchError) throw fetchError;

        if (existingConv) {
            return existingConv.id;
        }

        // Create new conversation
        const { data: newConv, error: createError } = await supabase
            .from('conversations')
            .insert({
                client_id: clientId,
                talent_id: talentId
            })
            .select('id')
            .single();

        if (createError) throw createError;

        return newConv.id;
    } catch (error) {
        console.error('Error in getOrCreateConversation:', error);
        throw error;
    }
}
