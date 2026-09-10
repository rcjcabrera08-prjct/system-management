require('dotenv').config();
const supabaseJS = require('@supabase/supabase-js');

const supabase = supabaseJS.createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);
    

module.exports = supabase;