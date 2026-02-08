import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { apiFetch } from '@lib/helpers';
import { Platform } from 'react-native';
import { useEffect } from 'react';

// Configure how notifications should be presented when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface PushNotificationData {
  type: 'chat_message' | 'booking_declined' | 'new_booking';
  bookingId?: string;
  requestId?: string;
}

export function usePushNotifications(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationResponse?: (response: Notifications.NotificationResponse) => void,
) {
  useEffect(() => {
    registerForPushNotificationsAsync();

    // Listen for incoming notifications
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      onNotificationReceived?.(notification);
    });

    // Listen for notification clicks/responses
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
      onNotificationResponse?.(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [onNotificationReceived, onNotificationResponse]);
}

async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.log('Push notifications are not available on simulator');
    return;
  }

  try {
    // Check existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permissions if not granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push notification permissions');
      return;
    }

    // Get Expo push token
    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;

    console.log('Expo push token:', token);

    // Register token with server
    await registerTokenWithServer(token);

    // Configure for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  } catch (error) {
    console.error('Failed to register for push notifications:', error);
  }
}

async function registerTokenWithServer(token: string) {
  try {
    const platform = Platform.OS;
    const response = await apiFetch('/push-notifications/register', 'POST', {
      body: JSON.stringify({ token, platform }),
    });

    if (response.ok) {
      console.log('Push token registered with server');
    } else {
      console.error('Failed to register push token with server');
    }
  } catch (error) {
    console.error('Error registering push token:', error);
  }
}

export async function unregisterPushToken(token: string) {
  try {
    const response = await apiFetch('/push-notifications/unregister', 'DELETE', {
      body: JSON.stringify({ token }),
    });

    if (response.ok) {
      console.log('Push token unregistered from server');
    }
  } catch (error) {
    console.error('Error unregistering push token:', error);
  }
}
