// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { getUserId } from './_libaction';

// For server components and API routes
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase credentials');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

// For client components only
export const createBrowserClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase credentials');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

// Fetching interests from tags table
interface Interest {
  id: string;
  label: string;
}

export async function fetchInterests(): Promise<Interest[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from('tags')
    .select('id, name')
    .order('name');

  if (error) {
    console.error('Error fetching interests:', error);
    return [];
  }

  return data.map(interest => ({
    id: interest.id.toString(),
    label: interest.name
  }));
}

// Community creation
export interface CommunityCreateData {
  name: string;
  description: string;
  owner_id: number;
  city?: string;
  country?: string;
  cover_image_url?: string;
  is_online?: boolean;
}

export interface ChatRoomCreateData {
  community_id: number;
  name: string;
  type: 'text' | 'voice' | 'video';
}

export interface CommunityTagCreateData {
  community_id: number;
  tag_id: number;  // Changed from tag_name to tag_id
}

// Define types for database responses
interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  owner_id: number;
  city: string | null;
  country: string | null;
  cover_image_url: string | null;
  is_online: boolean;
  member_count: number;
}

interface ChatRoom {
  id: number;
  community_id: number;
  name: string;
  type: 'text' | 'voice' | 'video';
  created_at: string;
}

interface CommunityTag {
  id: number;
  community_id: number;
  tag_id: number;
}

// Define error type
interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

/**
 * Creates a new community in the database
 */
export async function createCommunity(communityData: CommunityCreateData): Promise<{ data: Community | null; error: SupabaseError | null }> {
  const supabase = createBrowserClient();
  
  // Create a new timestamp for created_at and updated_at
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('communities')
    .insert([
      {
        name: communityData.name,
        description: communityData.description,
        created_at: now,
        updated_at: now,
        owner_id: communityData.owner_id,
        city: communityData.city || null,
        country: communityData.country || null,
        cover_image_url: communityData.cover_image_url || null,
        is_online: communityData.is_online || false,
        member_count: 1, // Start with the owner as the first member
      }
    ])
    .select()
    .single();
  
  return { data, error };
}

/**
 * Creates chat rooms for a community
 */
export async function createChatRooms(chatRooms: ChatRoomCreateData[]): Promise<{ data: ChatRoom[] | null; error: SupabaseError | null }> {
  const supabase = createBrowserClient();
  
  const { data, error } = await supabase
    .from('chat_rooms')
    .insert(chatRooms)
    .select();
  
  return { data, error };
}

/**
 * Creates tags for a community
 */
export async function createCommunityTags(tagRelations: { community_id: number; tag_names: string[] }): Promise<{ data: CommunityTag[] | null; error: SupabaseError | null }> {
  const supabase = createBrowserClient();
  const { community_id, tag_names } = tagRelations;
  
  console.log("Creating tags for community:", community_id, "Tags:", tag_names);

  // First ensure all tags exist in the tags table
  const tagNames = [...new Set(tag_names)];
  
  // Check which tags already exist
  const { data: existingTags } = await supabase
    .from('tags')
    .select('id, name')
    .in('name', tagNames);
  
  const existingTagMap = new Map();
  existingTags?.forEach(tag => {
    existingTagMap.set(tag.name, tag.id);
  });
  
  const newTagNames = tagNames.filter(name => !existingTagMap.has(name));
  
  // Create new tags if needed
  if (newTagNames.length > 0) {
    const { data: newTags, error: createError } = await supabase
      .from('tags')
      .insert(newTagNames.map(name => ({ name })))
      .select('id, name');
    
    if (createError) {
      return { data: null, error: createError };
    }
    
    // Add new tags to the map
    newTags?.forEach(tag => {
      existingTagMap.set(tag.name, tag.id);
    });
  }
  
  // Now create the community-tag relationships with proper tag_id values
  const tagRelationsToInsert = tagNames.map(tagName => ({
    community_id,
    tag_id: existingTagMap.get(tagName)
  }));
  
  const { data, error } = await supabase
    .from('community_tags')
    .insert(tagRelationsToInsert)
    .select();
  
  return { data, error };
}

/**
 * Creates a community with its chat rooms and tags
 */
export async function createFullCommunity(
  
  communityData: CommunityCreateData,
  chatRooms: Array<{ name: string; type: 'text' | 'voice' | 'video' }>,
  tags: string[]
): Promise<{ success: boolean; communityId?: number; error?: SupabaseError | Error }> {
  try {
    // 1. Create the community
    const supabase = createBrowserClient();
    const { data: community, error: communityError } = await createCommunity(communityData);
    
    if (communityError) throw communityError;
    if (!community) throw new Error('Failed to create community: No data returned');
    
    const communityId = community.id;
    
    // 2. Create the chat rooms
    const chatRoomsData = chatRooms.map(room => ({
      community_id: communityId,
      name: room.name,
      type: room.type
    }));
    
    const { error: chatRoomsError } = await createChatRooms(chatRoomsData);
    
    if (chatRoomsError) throw chatRoomsError;
    
    // 3. Create the tags
    if (tags.length > 0) {
      const { error: tagsError } = await createCommunityTags({
        community_id: communityId,
        tag_names: tags
      });
      
      if (tagsError) throw tagsError;
    }
    
    // 4. Create membership for the owner
    const { error: membershipError } = await supabase
      .from('community_members')
      .insert([
        {
          community_id: communityId,
          user_id: communityData.owner_id,
          role: 'owner',
          joined_at: new Date().toISOString()
        }
      ]);
    
    if (membershipError) throw membershipError;
    
    return { success: true, communityId };
  } catch (error) {
    console.error('Error creating community:', error);
    return { success: false, error: error as SupabaseError | Error };
  }
}

/**
 * Uploads an image file to Supabase storage
 */
export async function uploadCommunityImage(file: File, userId: number): Promise<{ url: string | null; error: SupabaseError | null }> {
  const supabase = createBrowserClient();
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}_${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `community_images/${fileName}`;
  
  const { error } = await supabase.storage
    .from('community-images')
    .upload(filePath, file);
  
  if (error) {
    return { url: null, error };
  }
  
  const { data } = supabase.storage
    .from('community-images')
    .getPublicUrl(filePath);
  
  return { url: data.publicUrl, error: null };
}

/**
 * This is a client-safe wrapper around the server action
 */
export async function getCurrentUserId(): Promise<number | null> {
  return getUserId();
}