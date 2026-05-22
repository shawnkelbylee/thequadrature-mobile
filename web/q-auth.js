// THE QUADRATURE: AUTHENTICATION BRIDGE
// Architect: Kelby | Engineer: Kairos
// STATUS: Defensive Lazy-Load Architecture & Active State Listener

window.Q_Auth = {
    initClient: function() {
        if (window.supabaseClient) return true;
        
        if (typeof window.supabase === 'undefined') {
            alert('[ AUTH ERROR ] Supabase CDN not loaded. Check network connection or browser shields.');
            return false;
        }
        
        try {
            window.supabaseClient = window.supabase.createClient('https://wnfpxozpeucrwqmrqpzv.supabase.co', 'sb_publishable_g6JfCH6FefIwEmXztgkdTw_Md1z4se5');
            
            // STATE LISTENER: Bridges backend auth to frontend UI
            window.supabaseClient.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN' || session) {
                    localStorage.setItem('Q_PRO_AUTH', 'true');
                    
                    const authBtn = document.getElementById('hub-main-auth-btn');
                    if (authBtn) {
                        authBtn.innerText = '[ DISCONNECT MATRIX ]';
                        authBtn.style.color = '#39ff14';
                        authBtn.style.borderColor = '#39ff14';
                        authBtn.style.boxShadow = 'inset 0 0 10px rgba(57,255,20, 0.1)';
                    }
                } else if (event === 'SIGNED_OUT') {
                    localStorage.setItem('Q_PRO_AUTH', 'false');
                }
            });

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

// Auto-initialize to ensure the listener is active before user interaction
window.addEventListener('DOMContentLoaded', () => {
    if (window.Q_Auth) window.Q_Auth.initClient();
});