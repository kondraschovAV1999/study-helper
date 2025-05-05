'use client';

import { useEffect, useState } from 'react';
import supabase from '@/utils/supabase/client';

export default function TestSupabase() {
  const [message, setMessage] = useState('Testing Supabase...');

  useEffect(() => {
    async function checkConnection() {
      const { data, error } = await supabase.from('test_table').select();

      if (error) {
        console.error('Supabase Error:', error);
        setMessage('❌ Connection failed. Check console and env variables.');
      } else {
        console.log('Supabase Data:', data);
        setMessage('✅ Supabase connection successful!');
      }
    }

    checkConnection();
  }, []);

  return <div className="p-4 text-lg">{message}</div>;
}
