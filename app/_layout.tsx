// THE QUADRATURE: SOVEREIGN MOBILE NODE (NATIVE WRAPPER)
// STATUS: Phase IV Native Engine. Deep-Link Interceptor & Webview Bridge.
// REVISION: SafeAreaView Deprecation Crash Fix

import React, { useEffect, useState } from 'react';
import { StyleSheet, StatusBar, View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Linking from 'expo-linking';
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// ARCHITECT NOTE: Inject your live Supabase credentials here
const supabaseUrl = https://wnfpxozpeucrwqmrqpzv.supabase.co;
const supabaseAnonKey = sb_publishable_g6JfCH6FefIwEmXztgkdTw_Md1z4se5;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
    const [session, setSession] = useState(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // 1. Initialize Session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setIsReady(true);
        });

        // 2. Listen for Auth Transitions
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        // 3. Deep-Link Interceptor
        const handleDeepLink = async (url) => {
            if (!url) return;
            if (url.includes('#access_token') || url.includes('?code=')) {
                const { data, error } = await supabase.auth.getSessionFromUrl(url);
                if (data?.session) setSession(data.session);
            }
        };

        const subscription = Linking.addEventListener('url', (event) => handleDeepLink(event.url));
        Linking.getInitialURL().then(handleDeepLink);

        return () => {
            subscription.remove();
            authListener.subscription.unsubscribe();
        };
    }, []);

    if (!isReady) return <View style={{flex:1, backgroundColor:'#010205'}} />;

    // Push native auth state to the Web DOM
    const INJECTED_JAVASCRIPT = `
        window.localStorage.setItem('Q_PRO_AUTH', '${session ? 'true' : 'false'}');
        window.Q_NATIVE_BRIDGE_ACTIVE = true;
        true;
    `;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#010205" />
            <WebView 
                source={{ uri: 'https://thequadrature.com' }} 
                style={styles.webview}
                injectedJavaScript={INJECTED_JAVASCRIPT}
                allowsInlineMediaPlayback={true}
                bounces={false}
                overScrollMode="never"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#010205', paddingTop: StatusBar.currentHeight || 0 },
    webview: { flex: 1, backgroundColor: '#010205' }
});