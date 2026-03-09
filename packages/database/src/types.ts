import {user, userRole, roleEnum, session, account, verification, agency, provider, seeker, service, portfolio, portfolioImage, review, reviewImage, request, requestImage, requestStatusEnum, bookingStatusEnum, booking, interestStatusEnum, providerInterest, address, message, messageImage, paymentMethod, pushToken, serviceType } from "./schema"


export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Role = (typeof roleEnum.enumValues)[number];

export type UserRole = typeof userRole.$inferSelect;
export type NewUserRole = typeof userRole.$inferInsert;

export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;

export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;

export type Agency = typeof agency.$inferSelect;
export type NewAgency = typeof agency.$inferInsert;

export type Provider = typeof provider.$inferSelect;
export type NewProvider = typeof provider.$inferInsert;


export type Seeker = typeof seeker.$inferSelect;
export type NewSeeker = typeof seeker.$inferInsert;


export type Service = typeof service.$inferSelect;
export type NewService = typeof service.$inferInsert;


export type ServiceType = typeof serviceType.$inferSelect;
export type NewServiceType = typeof serviceType.$inferInsert;

export type Portfolio = typeof portfolio.$inferSelect;
export type NewPortfolio = typeof portfolio.$inferInsert;

export type PortfolioImage = typeof portfolioImage.$inferSelect;
export type NewPortfolioImage = typeof portfolioImage.$inferInsert;

export type Review = typeof review.$inferSelect;
export type NewReview = typeof review.$inferInsert;

export type ReviewImage = typeof reviewImage.$inferSelect;
export type NewReviewImage = typeof reviewImage.$inferInsert;
export type RequestStatus = (typeof requestStatusEnum.enumValues)[number];

export type Request = typeof request.$inferSelect;
export type NewRequest = typeof request.$inferInsert;

export type RequestImage = typeof requestImage.$inferSelect;
export type NewRequestImage = typeof requestImage.$inferInsert;

export type BookingStatus = (typeof bookingStatusEnum.enumValues)[number];

export type Booking = typeof booking.$inferSelect;
export type NewBooking = typeof booking.$inferInsert;

export type InterestStatus = (typeof interestStatusEnum.enumValues)[number];

export type ProviderInterest = typeof providerInterest.$inferSelect;
export type NewProviderInterest = typeof providerInterest.$inferInsert;

export type Address = typeof address.$inferSelect;
export type NewAddress = typeof address.$inferInsert;

export type Message = typeof message.$inferSelect;
export type NewMessage = typeof message.$inferInsert;

export type MessageImage = typeof messageImage.$inferSelect;
export type NewMessageImage = typeof messageImage.$inferInsert;

export type PaymentMethod = typeof paymentMethod.$inferSelect;
export type NewPaymentMethod = typeof paymentMethod.$inferInsert;

export type PushToken = typeof pushToken.$inferSelect;
export type NewPushToken = typeof pushToken.$inferInsert;
