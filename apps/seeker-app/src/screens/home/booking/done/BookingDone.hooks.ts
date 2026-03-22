import { Alert } from 'react-native';
import { BookingStackParamList } from '@navigation/BookingStack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { seekerClient } from '@lib/seekerClient';
import { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

type BookingCompleteRouteProp = RouteProp<BookingStackParamList, 'BookingDone'>;
type BookingCompleteNavigationProp = NativeStackNavigationProp<BookingStackParamList, 'BookingDone'>;

interface BookingData {
  id: string;
  serviceId: string;
  serviceRating: {
    avgRating: number;
    reviewCount: number;
  };
}

export function useBookingDone() {
  const route = useRoute<BookingCompleteRouteProp>();
  const navigation = useNavigation<BookingCompleteNavigationProp>();
  const { bookingId, providerInfo, serviceTypeName, cost } = route.params;

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isLoadingRating, setIsLoadingRating] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await seekerClient.apiFetch(`/bookings/${bookingId}`, 'GET');
        if (response.ok) {
          const data = await response.json();
          setBookingData(data);
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
      } finally {
        setIsLoadingRating(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const handleGoHome = useCallback(() => {
    navigation.getParent()?.goBack();
  }, [navigation]);

  const handleViewDetails = useCallback(() => {
    navigation.navigate('BookingDetails', { bookingId });
  }, [navigation, bookingId]);

  const handleSubmitReview = useCallback(async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    if (!bookingData) {
      Alert.alert('Error', 'Booking data not loaded. Please try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const serviceId = bookingData.serviceId;

      const response = await seekerClient.apiFetch('/reviews', 'POST', {
        body: JSON.stringify({
          serviceId,
          bookingId,
          rating,
          comment: reviewText,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit review');
      }

      Alert.alert('Success', 'Thank you for your review!', [
        { text: 'OK', onPress: () => navigation.getParent()?.goBack() },
      ]);
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  }, [bookingData, bookingId, navigation, rating, reviewText]);

  const handleReport = useCallback(() => {
    navigation.navigate('Report', {
      bookingId,
      reportedUser: providerInfo,
    });
  }, [bookingId, navigation, providerInfo]);

  return {
    providerInfo,
    serviceTypeName,
    cost,
    rating,
    setRating,
    reviewText,
    setReviewText,
    isSubmitting,
    bookingData,
    isLoadingRating,
    handleGoHome,
    handleViewDetails,
    handleSubmitReview,
    handleReport,
  };
}
