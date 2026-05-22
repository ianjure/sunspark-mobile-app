import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const SUPABASE_URL = 'https://irfovyliwuywlwjsrtvv.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyZm92eWxpd3V5d2x3anNydHZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwODcyMjAsImV4cCI6MjA5NDY2MzIyMH0._GGYTNo2jILA35AaYJ2WYl2vd-p1S4ZDDA-VkrCDlqM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
