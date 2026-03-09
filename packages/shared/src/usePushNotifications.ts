import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { useEffect } from 'react';

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
  baseUrl: string,
  authCookie?: string,
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationResponse?: (response: Notifications.NotificationResponse) => void,
) {
  useEffect(() => {
    if (authCookie) {
      registerForPushNotificationsAsync(baseUrl, authCookie);
    }

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      onNotificationReceived?.(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response received:', response);
      onNotificationResponse?.(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [baseUrl, authCookie, onNotificationReceived, onNotificationResponse]);
}

async function registerForPushNotificationsAsync(baseUrl: string, authCookie: string) {
  if (!Device.isDevice) {
    console.log('Push notifications are not available on simulator');
    return;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push notification permissions');
      return;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;

    console.log('Expo push token:', token);

    await registerTokenWithServer(baseUrl, token, authCookie);

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

async function registerTokenWithServer(baseUrl: string, token: string, authCookie: string) {
  try {
    const platform = Platform.OS;
    const response = await fetch(`${baseUrl}/push-notifications/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: authCookie,
      },
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

export async function unregisterPushToken(baseUrl: string, token: string, authCookie: string) {
  try {
    const response = await fetch(`${baseUrl}/push-notifications/unregister`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Cookie: authCookie,
      },
      body: JSON.stringify({ token }),
    });

    if (response.ok) {
      console.log('Push token unregistered from server');
    }
  } catch (error) {
    console.error('Error unregistering push token:', error);
  }
}
