import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { Props } from './types';

export function PaymentMethodLinkingScreen({ apiFetch, navigation }: Props) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const paymentSessionIdRef = useRef<string | null>(null);
  const sessionStatus = useRef(false);
  const sessionHandled = useRef(false);

  useEffect(() => {
    let mounted = true;

    const createSession = async () => {
      setLoading(true);
      try {
        const res = await apiFetch('/payment-engine/session', 'POST');
        if (!mounted) return;

        if (!res.ok) {
          const errBody = await res.json().catch(() => null);
          throw new Error(errBody?.message || 'Failed to create payment session');
        }

        const data = await res.json();
        const payment_session_id_temp = (data && (data.payment_session_id || data.payment_session_id)) ?? null;
        const paymentUrl = (data && (data.payment_link_url || data.payment_link_url)) ?? null;
        if (!mounted) return;
        if (!payment_session_id_temp) throw new Error('payment_session_id missing from session response');
        paymentSessionIdRef.current = payment_session_id_temp;
        if (!paymentUrl) throw new Error('payment_link_url missing from session response');
        setUrl(String(paymentUrl));
      } catch (err) {
        if (!mounted) return;
        setError((err as { message: string })?.message ?? String(err));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    createSession();

    // Intercept navigation so we can await the cancel API before leaving
    const unsubscribeBeforeRemove = navigation.addListener('beforeRemove', e => {
      if (sessionHandled.current) return;
      e.preventDefault();
      const doCancelThenNavigate = async () => {
        mounted = false;
        try {
          console.debug('Cleaning up session before navigation');
          await apiFetch(`/payment-engine/session/${paymentSessionIdRef.current}/cancel`, 'POST');
        } catch (err) {
          console.error(err);
        }
        navigation.dispatch(e.data.action);
      };
      doCancelThenNavigate();
    });

    return () => {
      console.debug('Closing Screen');
      mounted = false;
      console.debug(`Payment Session Id: ${paymentSessionIdRef.current}`);
      console.debug(`Payment Session Status: ${sessionStatus.current}`);
      // Fallback: if not handled already, fire a non-blocking cancel
      if (!sessionHandled.current) {
        console.debug('Cleaning up session (fallback)');
        apiFetch(`/payment-engine/session/${paymentSessionIdRef.current}/cancel`, 'POST').catch(err => {
          console.error(err);
        });
      }
      unsubscribeBeforeRemove();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Payments are currently unavailable</Text>
      </View>
    );
  }

  if (!url) {
    return (
      <View style={styles.center}>
        <Text>No payment URL available</Text>
      </View>
    );
  }

  const handleSuccess = async () => {
    if (sessionHandled.current) return;
    sessionHandled.current = true;
    sessionStatus.current = true;
    try {
      await apiFetch(`/payment-engine/session/${paymentSessionIdRef.current}/success`, 'POST');
    } catch (err) {
      console.error(err);
    }
    navigation.goBack();
  };

  return (
    <WebView
      source={{ uri: url }}
      onNavigationStateChange={nav => {
        const navUrl = nav.url;
        console.log(navUrl);
        if (navUrl.startsWith('https://checkout-staging.xendit.co/session/')) {
          //
        }
        if (navUrl.includes('/xendit-success')) {
          handleSuccess();
        }
      }}
      onShouldStartLoadWithRequest={req => {
        if (req.url.startsWith('https://checkout-staging.xendit.co/session/')) {
          //
        }
        if (req.url.endsWith('/xendit-success')) {
          // prevent WebView from trying to open system handler, handle success then close
          handleSuccess();
          return false;
        }
        return true;
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  webview: { flex: 1 },
  errorText: { color: 'red' },
});
