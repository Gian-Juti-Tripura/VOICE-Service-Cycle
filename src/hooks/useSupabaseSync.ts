import { useEffect } from 'react';
import { supabase } from '../supabase/supabaseClient';

export function useSupabaseSync(tables: string[], onUpdate: () => void) {
  useEffect(() => {
    const channels = tables.map((table) => {
      return supabase
        .channel(`public:${table}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: table }, () => {
          onUpdate();
        })
        .subscribe();
    });

    return () => {
      channels.forEach((channel) => supabase.removeChannel(channel));
    };
  }, [tables, onUpdate]);
}
