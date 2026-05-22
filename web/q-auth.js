// THE QUADRATURE: AUTHENTICATION BRIDGE
// Architect: Kelby | Engineer: Kairos
// STATUS: Defensive Lazy-Load Architecture

window.Q_Auth = {
    initClient: function() {
        if (window.supabaseClient) return true;
        
        if (typeof window.supabase === 'undefined') {
            alert('[ AUTH ERROR ] Supabase CDN not loaded. Check network connection or browser shields.');
            return false;
        }
        
        try {
            window.supabaseClient = window.supabase.createClient('https://wnfpxozpeucrwqmrqpzv.supabase.co', 'sb_publishable_g6JfCH6FefIwEmXztgkdTw_Md1z4se5');
            return true;
        } catch (err) {
            alert('[ AUTH ERROR ] Client initialization failed: ' + err.message);
            return false;
        }
    },

    triggerOAuth: async function(options) {
        if (!this.initClient()) return;
        
        try {
            const { data, error } = await window.supabaseClient.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    scopes: options?.options?.scopes || 'email profile https://www.googleapis.com/auth/calendar.readonly',
                    queryParams: { access_type: 'offline', prompt: 'consent' }
                }
            });
            if (error) console.error('OAuth Error:', error);
        } catch (err) {
            console.error('OAuth Exception:', err);
        }
    },

    signOut: async function() {
        if (this.initClient()) {
            await window.supabaseClient.auth.signOut();
        }
        localStorage.setItem('Q_PRO_AUTH', 'false');
        window.location.reload();
    },

    triggerGoogleCalendarSync: function() {
        this.triggerOAuth({ options: { scopes: 'email profile https://www.googleapis.com/auth/calendar.readonly' }});
    }
};