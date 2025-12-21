import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Connection {
  id: string;
  user_id: string;
  connected_user_id: string;
  match_id: string | null;
  notes: string | null;
  connected_via: string | null;
  created_at: string;
  profile?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    title: string | null;
    company: string | null;
    location: string | null;
  };
}

export function useConnections() {
  const { session } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(false);

  const loadConnections = useCallback(async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('connections')
        .select('*')
        .or(`user_id.eq.${session.user.id},connected_user_id.eq.${session.user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Get other user IDs
        const otherUserIds = data.map(c =>
          c.user_id === session.user.id ? c.connected_user_id : c.user_id
        );

        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, title, company, location')
          .in('id', otherUserIds);

        const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

        const connectionsWithProfiles = data.map(conn => ({
          ...conn,
          profile: profileMap.get(
            conn.user_id === session.user.id ? conn.connected_user_id : conn.user_id
          ),
        }));

        setConnections(connectionsWithProfiles);
      } else {
        setConnections([]);
      }
    } catch (err) {
      console.error('Error loading connections:', err);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  const createConnection = useCallback(async (
    connectedUserId: string,
    matchId?: string,
    connectedVia: string = 'match'
  ): Promise<boolean> => {
    if (!session?.user?.id) return false;

    try {
      // Check if connection already exists
      const { data: existing } = await supabase
        .from('connections')
        .select('id')
        .or(`and(user_id.eq.${session.user.id},connected_user_id.eq.${connectedUserId}),and(user_id.eq.${connectedUserId},connected_user_id.eq.${session.user.id})`)
        .maybeSingle();

      if (existing) {
        console.log('Connection already exists');
        return true;
      }

      const { error } = await supabase
        .from('connections')
        .insert({
          user_id: session.user.id,
          connected_user_id: connectedUserId,
          match_id: matchId || null,
          connected_via: connectedVia,
        });

      if (error) throw error;

      await loadConnections();
      return true;

    } catch (err) {
      console.error('Error creating connection:', err);
      return false;
    }
  }, [session?.user?.id, loadConnections]);

  const isConnected = useCallback((userId: string): boolean => {
    return connections.some(c =>
      (c.user_id === session?.user?.id && c.connected_user_id === userId) ||
      (c.connected_user_id === session?.user?.id && c.user_id === userId)
    );
  }, [connections, session?.user?.id]);

  // Subscribe to real-time connection updates
  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel('connections-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'connections',
        },
        () => {
          loadConnections();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, loadConnections]);

  useEffect(() => {
    if (session?.user?.id) {
      loadConnections();
    }
  }, [session?.user?.id, loadConnections]);

  return {
    connections,
    loading,
    createConnection,
    isConnected,
    loadConnections,
  };
}
