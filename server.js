const express = require('express');
const app = express();
const supabase = require('./db_connection');
const bcrypt = require('bcrypt');

app.set('view engine', 'ejs');
app.use(express.static('public'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', {title: "System Status Dashboard"});
});

app.get('/signin', (req, res) => {
    res.render('sign_in', {title: "Sign In"});
});

// ── API ───────────────────────────────────────────────────

app.get('/api/systems', async (req, res) => {
    const { data, error } = await supabase
        .from('systems')
        .select('*')
        .order('updated_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/systems', async (req, res) => {
    const { title, description, tech, status, uptime, version } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: 'title and description are required' });
    }

    const { data, error } = await supabase
        .from('systems')
        .insert([{
            title,
            description,
            tech: tech || [],
            status: status || 'operational',
            uptime: uptime || 100,
            version: version || 'v1.0.0',
            updated_at: new Date().toISOString()
        }])
        .select()
        .single();

    if (error) return res.status(500).json({ error: error.message });

    await supabase.from('logs').insert([{
        level: 'info',
        system: title,
        action: 'Added',
        detail: 'Registered for monitoring.',
        time: new Date().toISOString()
    }]);

    res.status(201).json(data);
});

app.get('/api/logs', async (req, res) => {
    const { data, error } = await supabase
        .from('logs')
        .select('*')
        .order('time', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.get('/api/stats', async (req, res) => {
    const { data, error } = await supabase
        .from('systems')
        .select('*');

    if (error) return res.status(500).json({ error: error.message });

    const total = data.length;
    const operational = data.filter(s => s.status === 'operational').length;
    const issues = total - operational;
    const avgUptime = total === 0 ? 0 : data.reduce((sum, s) => sum + s.uptime, 0) / total;

    res.json({ total, operational, issues, avgUptime: avgUptime.toFixed(2) });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});