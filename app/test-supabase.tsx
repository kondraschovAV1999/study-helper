// app/page.tsx or app/test-supabase.tsx
'use client';

import { useEffect } from 'react';
import supabase from '@/utils/supabase/client';

export default function TestSupabase() {
  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from('your_table').select();
      console.log({ data, error });
    }
    fetchData();
  }, []);

  return <p>Check console for Supabase data</p>;
}
