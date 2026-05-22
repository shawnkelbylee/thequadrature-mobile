// THE QUADRATURE: AUTHENTICATION BRIDGE
const sbClient = window.supabase.createClient('https://wnfpxozpeucrwqmrqpzv.supabase.co', 'sb_publishable_g6JfCH6FefIwEmXztgkdTw_Md1z4se5');

window.supabaseClient = sbClient;

window.Q_Auth = {
    triggerOAuth: async function(options) {
        const { data, error } = await window.supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                scopes: options.options.scopes,
                queryParams: { access_type: 'offline', prompt: 'consent' }
            }
        });
        if (error) console.error('OAuth Error:', error);
    },
    signOut: async function() {
        await window.supabaseClient.auth.signOut();
        localStorage.setItem('Q_PRO_AUTH', 'false');
        window.location.reload();
    },
    triggerGoogleCalendarSync: function() {
        this.triggerOAuth({ options: { scopes: 'email profile https://www.googleapis.com/auth/calendar.readonly' }});
    }
};