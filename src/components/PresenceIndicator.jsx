import React, { useEffect, useState } from 'react';
import { FaCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';

export default function PresenceIndicator() {
  const { t } = useTranslation();
  const [viewerCount, setViewerCount] = useState(1);

  useEffect(() => {
    const sessionId = Math.random().toString(36).slice(2);
    const channel = supabase.channel('site-presence', {
      config: { presence: { key: sessionId } },
    });

    const updateCount = () => {
      const state = channel.presenceState();
      setViewerCount(Object.keys(state).length || 1);
    };

    channel
      .on('presence', { event: 'sync' }, updateCount)
      .on('presence', { event: 'join' }, updateCount)
      .on('presence', { event: 'leave' }, updateCount)
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div
      className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-gray-600"
      title={t('presence.label')}
    >
      <FaCircle className="text-[6px] text-green-500 animate-pulse" />
      <span>{t('presence.count', { count: viewerCount })}</span>
    </div>
  );
}
