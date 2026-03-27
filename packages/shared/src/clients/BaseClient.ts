import * as Notifications from 'expo-notifications';
import type { CreateReportPayload, CreateRequestPayload } from '@repo/types';

import { apiFetch } from '../api/apiFetch';
import {
  ChatSocketClient,
  chatSocket,
  type Message,
  type ProposalAcceptedData,
  type ProposalSubmittedData,
  type TypingData,
} from '../socket/ChatSocketClient';
import {
  checkReportExists as checkReportExistsApi,
  createReport as createReportApi,
  uploadReportImages as uploadReportImagesApi,
} from '../api/report';
import { createRequest as createRequestApi } from '../api/request';
import { deleteAvatar, uploadAvatar, uploadMessageImages, uploadRequestImages } from '../api/upload';
import { forwardGeocode, reverseGeocode } from '../api/geolocation';
import {
  getFeaturedServices,
  getServiceDetails,
  getServiceReviews,
  getServiceTypes,
  searchServices,
} from '../api/service';
import { getUserRole } from '../api/user';
import { MatchingSocketClient, matchingSocket } from '../socket/MatchingSocketClient';

export interface ClientOptions {
  baseUrl: string;
  googleMapsApiKey: string;
  authClient: { getCookie: () => string };
}

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export abstract class BaseClient {
  protected readonly baseUrl: string;
  protected readonly googleMapsApiKey: string;
  protected readonly authClient: { getCookie: () => string };
  protected readonly chat: ChatSocketClient;
  protected readonly matching: MatchingSocketClient;

  constructor(options: ClientOptions) {
    this.baseUrl = options.baseUrl;
    this.googleMapsApiKey = options.googleMapsApiKey;
    this.authClient = options.authClient;
    this.chat = chatSocket;
    this.matching = matchingSocket;
  }

  async apiFetch(
    endpoint: string,
    method: RequestMethod = 'GET',
    options?: Omit<RequestInit, 'method'>,
    authenticated = true,
  ): Promise<Response> {
    return apiFetch(this.authClient, this.baseUrl, endpoint, method, options, authenticated);
  }

  async getServiceTypes() {
    return getServiceTypes(this.authClient, this.baseUrl);
  }

  async searchServices(query: string, serviceTypeId?: string) {
    return searchServices(this.authClient, this.baseUrl, query, serviceTypeId);
  }

  async getFeaturedServices(limit?: number) {
    return getFeaturedServices(this.authClient, this.baseUrl, limit);
  }

  async getServiceDetails(serviceId: string) {
    return getServiceDetails(this.authClient, this.baseUrl, serviceId);
  }

  async getServiceReviews(serviceId: string) {
    return getServiceReviews(this.authClient, this.baseUrl, serviceId);
  }

  async getUserRole() {
    return getUserRole(this.authClient, this.baseUrl);
  }

  async createRequest(payload: CreateRequestPayload) {
    return createRequestApi(this.authClient, this.baseUrl, payload);
  }

  async uploadAvatar(uri: string): Promise<{ avatarUrl: string }> {
    return uploadAvatar(this.authClient, this.baseUrl, uri);
  }

  async uploadMessageImages(bookingId: string, imageUris: string[]): Promise<string[]> {
    return uploadMessageImages(this.authClient, this.baseUrl, bookingId, imageUris);
  }

  async uploadRequestImages(requestId: string, imageUris: string[]): Promise<void> {
    return uploadRequestImages(this.authClient, this.baseUrl, requestId, imageUris);
  }

  async deleteAvatar(): Promise<void> {
    return deleteAvatar(this.authClient, this.baseUrl);
  }

  async createReport(payload: CreateReportPayload) {
    return createReportApi(this.authClient, this.baseUrl, payload);
  }

  async uploadReportImages(reportId: string, imageUris: string[]): Promise<string[]> {
    return uploadReportImagesApi(this.authClient, this.baseUrl, reportId, imageUris);
  }

  async checkReportExists(bookingId: string): Promise<boolean> {
    return checkReportExistsApi(this.authClient, this.baseUrl, bookingId);
  }

  async reverseGeocode(lat: number, lng: number): Promise<string> {
    return reverseGeocode(lat, lng, this.googleMapsApiKey);
  }

  async forwardGeocode(address: string): Promise<{ lat: number; lng: number } | null> {
    return forwardGeocode(address, this.googleMapsApiKey);
  }

  async connectChat(cookie: string, userId: string, userRole: 'seeker' | 'provider'): Promise<void> {
    return this.chat.connect(this.baseUrl, cookie, userId, userRole);
  }

  joinBooking(bookingId: string): void {
    this.chat.joinBooking(bookingId);
  }

  leaveBooking(bookingId: string): void {
    this.chat.leaveBooking(bookingId);
  }

  sendMessage(bookingId: string, message: string, imageKeys?: string[]): void {
    this.chat.sendMessage(bookingId, message, imageKeys);
  }

  acceptProposal(bookingId: string): void {
    this.chat.acceptProposal(bookingId);
  }

  declineProposal(bookingId: string): void {
    this.chat.declineProposal(bookingId);
  }

  declineBooking(bookingId: string, requestId: string): void {
    this.chat.declineBooking(bookingId, requestId);
  }

  notifyArrival(bookingId: string): void {
    this.chat.notifyArrival(bookingId);
  }

  notifyBookingCompleted(bookingId: string): void {
    this.chat.notifyBookingCompleted(bookingId);
  }

  cancelBooking(bookingId: string): void {
    this.chat.cancelBooking(bookingId);
  }

  onNewMessage(handler: (message: Message) => void): void {
    this.chat.onNewMessage(handler);
  }

  onTyping(handler: (data: TypingData) => void): void {
    this.chat.onTyping(handler);
  }

  onUserJoined(handler: (data: { userId: string; bookingId: string }) => void): void {
    this.chat.onUserJoined(handler);
  }

  onUserLeft(handler: (data: { userId: string; bookingId: string }) => void): void {
    this.chat.onUserLeft(handler);
  }

  onBookingDeclined(handler: (data: { bookingId: string; requestId: string }) => void): void {
    this.chat.onBookingDeclined(handler);
  }

  onProposalDeclined(handler: (data: { bookingId: string }) => void): void {
    this.chat.onProposalDeclined(handler);
  }

  onProposalSubmitted(handler: (data: ProposalSubmittedData) => void): void {
    this.chat.onProposalSubmitted(handler);
  }

  onProposalAccepted(handler: (data: ProposalAcceptedData) => void): void {
    this.chat.onProposalAccepted(handler);
  }

  onProviderArrived(handler: (data: { bookingId: string }) => void): void {
    this.chat.onProviderArrived(handler);
  }

  onBookingCompleted(handler: (data: { bookingId: string }) => void): void {
    this.chat.onBookingCompleted(handler);
  }

  onBookingCancelled(handler: (data: { bookingId: string }) => void): void {
    this.chat.onBookingCancelled(handler);
  }

  removeAllListeners(): void {
    this.chat.removeAllListeners();
  }

  disconnectChat(): void {
    this.chat.disconnect();
  }

  async connectMatching(
    cookie: string,
    userId: string,
    userRole: 'seeker' | 'provider',
  ): Promise<ReturnType<MatchingSocketClient['connect']>> {
    return this.matching.connect(this.baseUrl, cookie, userId, userRole);
  }

  async watchRequest(requestId: string): Promise<void> {
    return this.matching.watchRequest(requestId);
  }

  async unwatchRequest(requestId: string): Promise<void> {
    return this.matching.unwatchRequest(requestId);
  }

  async cancelRequest(requestId: string): Promise<void> {
    return this.matching.cancelRequest(requestId);
  }

  isMatchingConnected(): boolean {
    return this.matching.isConnected();
  }

  onRequestCancelled(handler: (data: { requestId: string }) => void): void {
    this.matching.onRequestCancelled(handler);
  }

  offRequestCancelled(handler: (data: { requestId: string }) => void): void {
    this.matching.offRequestCancelled(handler);
  }

  onRequestSettling(
    handler: (data: {
      requestId: string;
      bookingId: string;
      provider: { id: string; firstName: string; lastName: string; avatarUrl: string | null };
    }) => void,
  ): void {
    this.matching.onRequestSettling(handler);
  }

  offRequestSettling(
    handler: (data: {
      requestId: string;
      bookingId: string;
      provider: { id: string; firstName: string; lastName: string; avatarUrl: string | null };
    }) => void,
  ): void {
    this.matching.offRequestSettling(handler);
  }

  onMatchingError(handler: (error: { message: string }) => void): void {
    this.matching.onError(handler);
  }

  offMatchingError(handler: (error: { message: string }) => void): void {
    this.matching.offError(handler);
  }

  disconnectMatching(): void {
    this.matching.disconnect();
  }

  async joinProviderRooms(serviceTypeIds: string[]): Promise<void> {
    return this.matching.joinProviderRooms(serviceTypeIds);
  }

  async leaveProviderRooms(serviceTypeIds: string[]): Promise<void> {
    return this.matching.leaveProviderRooms(serviceTypeIds);
  }

  onNewRequest(handler: (request: unknown) => void): void {
    this.matching.onNewRequest(handler);
  }

  offNewRequest(handler: (request: unknown) => void): void {
    this.matching.offNewRequest(handler);
  }

  onRequestRemoved(handler: (data: { requestId: string }) => void): void {
    this.matching.onRequestRemoved(handler);
  }

  offRequestRemoved(handler: (data: { requestId: string }) => void): void {
    this.matching.offRequestRemoved(handler);
  }

  onProviderViewing(handler: (data: { requestId: string; providerId: string; providerName: string }) => void): void {
    this.matching.onProviderViewing(handler);
  }

  offProviderViewing(handler: (data: { requestId: string; providerId: string; providerName: string }) => void): void {
    this.matching.offProviderViewing(handler);
  }

  usePushNotifications(
    authCookie?: string,
    onNotificationReceived?: (notification: Notifications.Notification) => void,
    onNotificationResponse?: (response: Notifications.NotificationResponse) => void,
  ): void {
    const { usePushNotifications: usePushNotificationsOriginal } = require('../usePushNotifications');
    usePushNotificationsOriginal(this.baseUrl, authCookie, onNotificationReceived, onNotificationResponse);
  }

  async unregisterPushToken(token: string, authCookie: string): Promise<void> {
    const { unregisterPushToken: unregisterPushTokenOriginal } = require('../usePushNotifications');
    return unregisterPushTokenOriginal(this.baseUrl, token, authCookie);
  }
}
