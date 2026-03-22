import { Alert } from 'react-native';
import { authClient } from '@lib/authClient';
import { HistoryStackParamList } from '@navigation/HistoryStack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { seekerClient } from '@lib/seekerClient';
import { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

type TransactionDetailsRouteProp = RouteProp<HistoryStackParamList, 'BookingLogs'>;
type TransactionDetailsNavigationProp = NativeStackNavigationProp<HistoryStackParamList, 'BookingLogs'>;

interface TransactionData {
  id: string;
  status: string;
  cost: number;
  specifications: string | null;
  createdAt: string;
  serviceId: string;
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  } | null;
  address: {
    label: string | null;
    coordinates: [number, number];
  } | null;
  serviceRating: {
    avgRating: number;
    reviewCount: number;
  };
  serviceType: {
    id: string;
    name: string;
    iconUrl: string | null;
  };
}

interface ReviewWithUser {
  reviewerUserId: string;
  reviewerName: string;
  rating: number | null;
  comment?: string | null;
  createdAt: string;
}

export function useBookingLogs() {
  const navigation = useNavigation<TransactionDetailsNavigationProp>();
  const route = useRoute<TransactionDetailsRouteProp>();
  const { bookingId } = route.params;

  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const session = authClient.useSession();
  const currentUserId = session.data?.user?.id;

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await seekerClient.apiFetch(`/bookings/${bookingId}`, 'GET');
        if (response.ok) {
          const data = await response.json();
          setTransaction(data);
        } else {
          throw new Error('Failed to fetch transaction');
        }
      } catch (error) {
        console.error('Error fetching transaction:', error);
        Alert.alert('Error', 'Failed to load transaction details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransaction();
  }, [bookingId]);

  useEffect(() => {
    const loadReviews = async () => {
      if (!transaction?.serviceId) return;

      try {
        setIsLoadingReviews(true);
        const response = await seekerClient.apiFetch(`/services/${transaction.serviceId}/reviews`, 'GET');
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    loadReviews();
  }, [transaction?.serviceId]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleViewServiceDetails = useCallback(() => {
    if (transaction?.serviceId) {
      navigation.getParent()?.navigate('HomeStack', {
        screen: 'ServiceDetails',
        params: { serviceId: transaction.serviceId },
      });
    }
  }, [navigation, transaction?.serviceId]);

  const handleViewRequestDetails = useCallback(() => {
    navigation.navigate('RequestLogs', { bookingId });
  }, [navigation, bookingId]);

  const handleViewChatLogs = useCallback(() => {
    if (transaction?.provider) {
      navigation.navigate('ChatLogs', {
        bookingId,
        otherUser: {
          id: transaction.provider.id,
          firstName: transaction.provider.firstName,
          lastName: transaction.provider.lastName,
          avatarUrl: transaction.provider.avatarUrl,
        },
      });
    }
  }, [navigation, transaction?.provider, bookingId]);

  const handleSubmitReview = useCallback(async () => {
    if (!transaction?.serviceId || rating === 0) return;

    setIsSubmitting(true);
    try {
      const response = await seekerClient.apiFetch('/reviews', 'POST', {
        body: JSON.stringify({
          serviceId: transaction.serviceId,
          bookingId,
          rating,
          comment: comment.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to submit review');
      }

      navigation.getParent()?.navigate('HomeStack', {
        screen: 'ServiceDetails',
        params: { serviceId: transaction.serviceId },
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  }, [transaction?.serviceId, bookingId, rating, comment, navigation]);

  const handleReport = useCallback(() => {
    if (transaction?.provider) {
      navigation.navigate('Report', {
        bookingId,
        reportedUser: {
          id: transaction.provider.id,
          firstName: transaction.provider.firstName,
          lastName: transaction.provider.lastName,
          avatarUrl: transaction.provider.avatarUrl,
        },
      });
    }
  }, [bookingId, navigation, transaction?.provider]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return {
    transaction,
    isLoading,
    reviews,
    isLoadingReviews,
    rating,
    setRating,
    comment,
    setComment,
    isSubmitting,
    currentUserId,
    handleGoBack,
    handleViewServiceDetails,
    handleViewRequestDetails,
    handleViewChatLogs,
    handleSubmitReview,
    handleReport,
    formatDateTime,
  };
}
