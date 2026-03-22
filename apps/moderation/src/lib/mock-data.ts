import type {
  AdminUser,
  AuditEntry,
  Booking,
  Note,
  Report,
  User,
} from './types'

export const MOCK_USERS: User[] = [
  {
    id: 'usr_01',
    email: 'alice.santos@example.com',
    firstName: 'Alice',
    middleName: 'R.',
    lastName: 'Santos',
    phoneNumber: '+639171234567',
    avatarUrl: null,
    role: 'seeker',
  },
  {
    id: 'usr_02',
    email: 'bob.reyes@example.com',
    firstName: 'Bob',
    middleName: '',
    lastName: 'Reyes',
    phoneNumber: '+639181234567',
    avatarUrl: null,
    role: 'provider',
  },
  {
    id: 'usr_03',
    email: 'carla.cruz@example.com',
    firstName: 'Carla',
    middleName: 'M.',
    lastName: 'Cruz',
    phoneNumber: '+639191234567',
    avatarUrl: null,
    role: 'seeker',
  },
  {
    id: 'usr_04',
    email: 'david.garcia@example.com',
    firstName: 'David',
    middleName: '',
    lastName: 'Garcia',
    phoneNumber: '+639201234567',
    avatarUrl: null,
    role: 'provider',
  },
  {
    id: 'usr_05',
    email: 'ella.torres@example.com',
    firstName: 'Ella',
    middleName: 'B.',
    lastName: 'Torres',
    phoneNumber: '+639211234567',
    avatarUrl: null,
    role: 'seeker',
  },
  {
    id: 'usr_06',
    email: 'francis.lim@example.com',
    firstName: 'Francis',
    middleName: 'D.',
    lastName: 'Lim',
    phoneNumber: '+639221234567',
    avatarUrl: null,
    role: 'provider',
  },
  {
    id: 'usr_07',
    email: 'grace.mendoza@example.com',
    firstName: 'Grace',
    middleName: '',
    lastName: 'Mendoza',
    phoneNumber: '+639231234567',
    avatarUrl: null,
    role: 'seeker',
  },
  {
    id: 'usr_08',
    email: 'hans.dela.cruz@example.com',
    firstName: 'Hans',
    middleName: 'P.',
    lastName: 'Dela Cruz',
    phoneNumber: '+639241234567',
    avatarUrl: null,
    role: 'provider',
  },
]

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'bk_01',
    providerUserId: 'usr_02',
    seekerUserId: 'usr_01',
    serviceId: 'svc_01',
    status: 'completed',
    cost: 1500,
    specifications: 'Deep cleaning for 2-bedroom unit',
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-03-01T14:00:00Z',
  },
  {
    id: 'bk_02',
    providerUserId: 'usr_04',
    seekerUserId: 'usr_03',
    serviceId: 'svc_02',
    status: 'completed',
    cost: 800,
    specifications: null,
    createdAt: '2026-03-05T10:00:00Z',
    updatedAt: '2026-03-05T12:30:00Z',
  },
  {
    id: 'bk_03',
    providerUserId: 'usr_06',
    seekerUserId: 'usr_05',
    serviceId: 'svc_03',
    status: 'cancelled',
    cost: 2000,
    specifications: 'AC installation for living room',
    createdAt: '2026-03-08T09:00:00Z',
    updatedAt: '2026-03-08T11:00:00Z',
  },
  {
    id: 'bk_04',
    providerUserId: 'usr_08',
    seekerUserId: 'usr_07',
    serviceId: 'svc_01',
    status: 'completed',
    cost: 1200,
    specifications: 'Weekly laundry service',
    createdAt: '2026-03-10T07:00:00Z',
    updatedAt: '2026-03-10T16:00:00Z',
  },
  {
    id: 'bk_05',
    providerUserId: 'usr_02',
    seekerUserId: 'usr_05',
    serviceId: 'svc_04',
    status: 'completed',
    cost: 3500,
    specifications: 'Full home pest control treatment',
    createdAt: '2026-03-12T08:30:00Z',
    updatedAt: '2026-03-12T13:00:00Z',
  },
  {
    id: 'bk_06',
    providerUserId: 'usr_04',
    seekerUserId: 'usr_01',
    serviceId: 'svc_02',
    status: 'completed',
    cost: 600,
    specifications: null,
    createdAt: '2026-03-14T14:00:00Z',
    updatedAt: '2026-03-14T16:00:00Z',
  },
]

export const MOCK_REPORTS: Report[] = [
  {
    id: 'rpt_001',
    reporterUserId: 'usr_01',
    reportedUserId: 'usr_02',
    bookingId: 'bk_01',
    reason: 'harassment',
    description:
      'The provider was verbally abusive during the service and made threatening comments when I asked for adjustments. This behavior is completely unacceptable and made me feel unsafe in my own home.',
    status: 'open',
    createdAt: '2026-03-15T10:30:00Z',
    updatedAt: '2026-03-15T10:30:00Z',
    reportImages: [
      {
        id: 'img_01',
        url: '/placeholder-screenshot.jpg',
        caption: 'Screenshot of messages',
      },
      {
        id: 'img_02',
        url: '/placeholder-photo.jpg',
        caption: 'Photo of damaged area',
      },
    ],
  },
  {
    id: 'rpt_002',
    reporterUserId: 'usr_03',
    reportedUserId: 'usr_04',
    bookingId: 'bk_02',
    reason: 'fraudulent_payment',
    description:
      'Provider demanded additional cash payment on top of the app fee. When I refused, they threatened to cancel the service midway.',
    status: 'open',
    createdAt: '2026-03-14T09:15:00Z',
    updatedAt: '2026-03-14T09:15:00Z',
    reportImages: [
      {
        id: 'img_03',
        url: '/placeholder-receipt.jpg',
        caption: 'Photo of extra charge demand',
      },
    ],
  },
  {
    id: 'rpt_003',
    reporterUserId: 'usr_05',
    reportedUserId: 'usr_06',
    bookingId: 'bk_03',
    reason: 'no_show',
    description:
      'Provider did not show up at the scheduled time. Waited for over 2 hours with no communication. Had to cancel and reschedule with another provider.',
    status: 'under_review',
    createdAt: '2026-03-13T14:45:00Z',
    updatedAt: '2026-03-13T16:00:00Z',
    reportImages: [],
  },
  {
    id: 'rpt_004',
    reporterUserId: 'usr_07',
    reportedUserId: 'usr_08',
    bookingId: 'bk_04',
    reason: 'poor_service',
    description:
      'The laundry service quality was extremely poor. Several items were returned stained and two garments were damaged beyond repair. Provider refused to acknowledge the issue.',
    status: 'open',
    createdAt: '2026-03-12T18:20:00Z',
    updatedAt: '2026-03-12T18:20:00Z',
    reportImages: [
      {
        id: 'img_04',
        url: '/placeholder-damage1.jpg',
        caption: 'Stained shirt',
      },
      {
        id: 'img_05',
        url: '/placeholder-damage2.jpg',
        caption: 'Torn garment',
      },
      {
        id: 'img_06',
        url: '/placeholder-damage3.jpg',
        caption: 'Color bleed on white fabric',
      },
    ],
  },
  {
    id: 'rpt_005',
    reporterUserId: 'usr_05',
    reportedUserId: 'usr_02',
    bookingId: 'bk_05',
    reason: 'inappropriate_behavior',
    description:
      'Provider made inappropriate personal comments and kept asking for my social media accounts. Made the entire service experience uncomfortable.',
    status: 'under_review',
    createdAt: '2026-03-11T11:00:00Z',
    updatedAt: '2026-03-11T14:30:00Z',
    reportImages: [
      {
        id: 'img_07',
        url: '/placeholder-chat.jpg',
        caption: 'Chat log screenshot',
      },
    ],
  },
  {
    id: 'rpt_006',
    reporterUserId: 'usr_01',
    reportedUserId: 'usr_04',
    bookingId: 'bk_06',
    reason: 'unfair_cancellation',
    description:
      'Provider cancelled the booking 30 minutes before the scheduled time without a valid reason. I was charged a cancellation fee despite it being the provider who cancelled.',
    status: 'resolved',
    createdAt: '2026-03-10T16:00:00Z',
    updatedAt: '2026-03-10T20:00:00Z',
    reportImages: [],
  },
  {
    id: 'rpt_007',
    reporterUserId: 'usr_03',
    reportedUserId: 'usr_02',
    bookingId: 'bk_01',
    reason: 'other',
    description:
      'Provider showed up intoxicated. Smelled strongly of alcohol and could barely stand. This is a serious safety concern.',
    status: 'resolved',
    createdAt: '2026-03-09T08:30:00Z',
    updatedAt: '2026-03-09T12:00:00Z',
    reportImages: [],
  },
  {
    id: 'rpt_008',
    reporterUserId: 'usr_07',
    reportedUserId: 'usr_06',
    bookingId: 'bk_03',
    reason: 'harassment',
    description:
      'After I left a negative review, the provider started sending threatening messages through the app and found my personal social media to continue harassing me.',
    status: 'dismissed',
    createdAt: '2026-03-08T20:00:00Z',
    updatedAt: '2026-03-08T22:00:00Z',
    reportImages: [
      {
        id: 'img_08',
        url: '/placeholder-threat1.jpg',
        caption: 'Threatening message 1',
      },
      {
        id: 'img_09',
        url: '/placeholder-threat2.jpg',
        caption: 'Threatening message 2',
      },
    ],
  },
  {
    id: 'rpt_009',
    reporterUserId: 'usr_05',
    reportedUserId: 'usr_08',
    bookingId: 'bk_04',
    reason: 'fraudulent_payment',
    description:
      'Provider completed only half the work but marked the job as fully completed to collect the full payment. The second half of the laundry was never returned.',
    status: 'open',
    createdAt: '2026-03-07T15:00:00Z',
    updatedAt: '2026-03-07T15:00:00Z',
    reportImages: [],
  },
  {
    id: 'rpt_010',
    reporterUserId: 'usr_01',
    reportedUserId: 'usr_06',
    bookingId: 'bk_03',
    reason: 'no_show',
    description:
      'Provider confirmed the booking but never arrived. No response to messages or calls. Wasted my entire afternoon waiting.',
    status: 'open',
    createdAt: '2026-03-06T13:00:00Z',
    updatedAt: '2026-03-06T13:00:00Z',
    reportImages: [],
  },
  {
    id: 'rpt_011',
    reporterUserId: 'usr_03',
    reportedUserId: 'usr_08',
    bookingId: 'bk_04',
    reason: 'poor_service',
    description:
      'The cleaning service was rushed and superficial. Bathroom was not properly sanitized, floors were still dirty. Not worth the price charged.',
    status: 'under_review',
    createdAt: '2026-03-05T17:30:00Z',
    updatedAt: '2026-03-05T19:00:00Z',
    reportImages: [
      {
        id: 'img_10',
        url: '/placeholder-bathroom.jpg',
        caption: 'Unsanitized bathroom',
      },
    ],
  },
  {
    id: 'rpt_012',
    reporterUserId: 'usr_07',
    reportedUserId: 'usr_02',
    bookingId: 'bk_05',
    reason: 'inappropriate_behavior',
    description:
      'Provider arrived late, did a terrible job, and then asked me to give a 5-star review in exchange for a discount on future services. This feels like review manipulation.',
    status: 'open',
    createdAt: '2026-03-04T10:00:00Z',
    updatedAt: '2026-03-04T10:00:00Z',
    reportImages: [
      {
        id: 'img_11',
        url: '/placeholder-offer.jpg',
        caption: 'Screenshot of review offer',
      },
    ],
  },
]

export function getUserById(id: string): User | undefined {
  return MOCK_USERS.find((u) => u.id === id)
}

export function getBookingById(id: string): Booking | undefined {
  return MOCK_BOOKINGS.find((b) => b.id === id)
}

export function getReportById(id: string): Report | undefined {
  return MOCK_REPORTS.find((r) => r.id === id)
}

export function getReporterForReport(report: Report): User | undefined {
  return getUserById(report.reporterUserId)
}

export function getReportedUserForReport(report: Report): User | undefined {
  return getUserById(report.reportedUserId)
}

export function getBookingForReport(report: Report): Booking | undefined {
  return getBookingById(report.bookingId)
}

export function getUserFullName(user: User): string {
  return [user.firstName, user.middleName, user.lastName]
    .filter(Boolean)
    .join(' ')
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// --- Mock data: Audit Log ---

export const MOCK_AUDIT_ENTRIES: AuditEntry[] = [
  // rpt_001 (open, harassment)
  {
    id: 'aud_001',
    reportId: 'rpt_001',
    moderatorId: 'mod_01',
    action: 'created',
    details: 'Report received from Alice Santos',
    createdAt: '2026-03-15T10:30:00Z',
  },
  {
    id: 'aud_002',
    reportId: 'rpt_001',
    moderatorId: 'mod_01',
    action: 'evidence_reviewed',
    details: 'Reviewed 2 attached images',
    createdAt: '2026-03-15T11:00:00Z',
  },

  // rpt_003 (under_review, no_show)
  {
    id: 'aud_003',
    reportId: 'rpt_003',
    moderatorId: 'mod_02',
    action: 'created',
    details: 'Report received from Ella Torres',
    createdAt: '2026-03-13T14:45:00Z',
  },
  {
    id: 'aud_004',
    reportId: 'rpt_003',
    moderatorId: 'mod_02',
    action: 'assigned',
    details: 'Assigned to moderator mod_02',
    createdAt: '2026-03-13T15:00:00Z',
  },
  {
    id: 'aud_005',
    reportId: 'rpt_003',
    moderatorId: 'mod_02',
    action: 'status_changed',
    details: 'Status changed from open to under_review',
    createdAt: '2026-03-13T16:00:00Z',
  },

  // rpt_006 (resolved, unfair_cancellation)
  {
    id: 'aud_006',
    reportId: 'rpt_006',
    moderatorId: 'mod_01',
    action: 'created',
    details: 'Report received from Alice Santos',
    createdAt: '2026-03-10T16:00:00Z',
  },
  {
    id: 'aud_007',
    reportId: 'rpt_006',
    moderatorId: 'mod_01',
    action: 'status_changed',
    details: 'Status changed from open to under_review',
    createdAt: '2026-03-10T17:00:00Z',
  },
  {
    id: 'aud_008',
    reportId: 'rpt_006',
    moderatorId: 'mod_01',
    action: 'note_added',
    details: 'Moderator added internal note',
    createdAt: '2026-03-10T18:30:00Z',
  },
  {
    id: 'aud_009',
    reportId: 'rpt_006',
    moderatorId: 'mod_01',
    action: 'resolved',
    details: 'Report resolved: cancellation fee refunded to reporter',
    createdAt: '2026-03-10T20:00:00Z',
  },

  // rpt_007 (resolved, other)
  {
    id: 'aud_010',
    reportId: 'rpt_007',
    moderatorId: 'mod_02',
    action: 'created',
    details: 'Report received from Carla Cruz',
    createdAt: '2026-03-09T08:30:00Z',
  },
  {
    id: 'aud_011',
    reportId: 'rpt_007',
    moderatorId: 'mod_02',
    action: 'resolved',
    details: 'Report resolved: provider suspended for 30 days',
    createdAt: '2026-03-09T12:00:00Z',
  },

  // rpt_008 (dismissed, harassment)
  {
    id: 'aud_012',
    reportId: 'rpt_008',
    moderatorId: 'mod_01',
    action: 'created',
    details: 'Report received from Grace Mendoza',
    createdAt: '2026-03-08T20:00:00Z',
  },
  {
    id: 'aud_013',
    reportId: 'rpt_008',
    moderatorId: 'mod_01',
    action: 'evidence_reviewed',
    details: 'Reviewed 2 attached images; insufficient evidence',
    createdAt: '2026-03-08T21:00:00Z',
  },
  {
    id: 'aud_014',
    reportId: 'rpt_008',
    moderatorId: 'mod_01',
    action: 'dismissed',
    details: 'Report dismissed: unable to verify claims',
    createdAt: '2026-03-08T22:00:00Z',
  },

  // rpt_005 (under_review, inappropriate_behavior)
  {
    id: 'aud_015',
    reportId: 'rpt_005',
    moderatorId: 'mod_02',
    action: 'created',
    details: 'Report received from Ella Torres',
    createdAt: '2026-03-11T11:00:00Z',
  },
]

// --- Mock data: Internal Notes ---

export const MOCK_NOTES: Note[] = [
  // rpt_001
  {
    id: 'nt_001',
    reportId: 'rpt_001',
    authorId: 'mod_01',
    authorName: 'Moderator Juan',
    content:
      'Initial review: screenshots appear to show threatening language. Need to verify authenticity.',
    createdAt: '2026-03-15T11:15:00Z',
  },
  {
    id: 'nt_002',
    reportId: 'rpt_001',
    authorId: 'mod_02',
    authorName: 'Moderator Maria',
    content:
      "Cross-referenced with the reported user's history. This is the first harassment complaint against Bob Reyes.",
    createdAt: '2026-03-15T13:00:00Z',
  },
  {
    id: 'nt_003',
    reportId: 'rpt_001',
    authorId: 'mod_01',
    authorName: 'Moderator Juan',
    content:
      'Reached out to the reporter for additional context. Awaiting response.',
    createdAt: '2026-03-15T14:30:00Z',
  },

  // rpt_003
  {
    id: 'nt_004',
    reportId: 'rpt_003',
    authorId: 'mod_02',
    authorName: 'Moderator Maria',
    content:
      "Checked provider's location data. Confirmed no GPS check-in at the scheduled location.",
    createdAt: '2026-03-13T15:30:00Z',
  },
  {
    id: 'nt_005',
    reportId: 'rpt_003',
    authorId: 'mod_02',
    authorName: 'Moderator Maria',
    content:
      'Provider claims car broke down but has not provided documentation.',
    createdAt: '2026-03-13T16:00:00Z',
  },
  {
    id: 'nt_006',
    reportId: 'rpt_003',
    authorId: 'mod_01',
    authorName: 'Moderator Juan',
    content:
      'Second no-show complaint for this provider. Flagging for pattern review.',
    createdAt: '2026-03-14T09:00:00Z',
  },
  {
    id: 'nt_007',
    reportId: 'rpt_003',
    authorId: 'mod_02',
    authorName: 'Moderator Maria',
    content:
      'Requesting provider to submit evidence of vehicle issue by end of week.',
    createdAt: '2026-03-14T10:15:00Z',
  },

  // rpt_004
  {
    id: 'nt_008',
    reportId: 'rpt_004',
    authorId: 'mod_01',
    authorName: 'Moderator Juan',
    content:
      'Photos show clear damage to garments. This looks like a legitimate complaint.',
    createdAt: '2026-03-12T19:00:00Z',
  },
  {
    id: 'nt_009',
    reportId: 'rpt_004',
    authorId: 'mod_02',
    authorName: 'Moderator Maria',
    content:
      'Contacted provider Hans Dela Cruz. He acknowledged the stained items but disputes the torn garment claim.',
    createdAt: '2026-03-13T10:00:00Z',
  },
  {
    id: 'nt_010',
    reportId: 'rpt_004',
    authorId: 'mod_01',
    authorName: 'Moderator Juan',
    content:
      'Suggesting partial refund for confirmed damage. Escalating for final decision.',
    createdAt: '2026-03-13T14:00:00Z',
  },

  // rpt_006
  {
    id: 'nt_011',
    reportId: 'rpt_006',
    authorId: 'mod_01',
    authorName: 'Moderator Juan',
    content:
      'Booking system logs confirm provider cancelled at 13:30, 30 minutes before the 14:00 slot.',
    createdAt: '2026-03-10T17:30:00Z',
  },
  {
    id: 'nt_012',
    reportId: 'rpt_006',
    authorId: 'mod_01',
    authorName: 'Moderator Juan',
    content:
      'Cancellation fee of P150 was charged to the seeker. This should be refunded.',
    createdAt: '2026-03-10T18:00:00Z',
  },
  {
    id: 'nt_013',
    reportId: 'rpt_006',
    authorId: 'mod_02',
    authorName: 'Moderator Maria',
    content:
      'Refund processed. Provider David Garcia warned about late cancellations.',
    createdAt: '2026-03-10T19:30:00Z',
  },

  // rpt_008
  {
    id: 'nt_014',
    reportId: 'rpt_008',
    authorId: 'mod_01',
    authorName: 'Moderator Juan',
    content:
      'Reviewed the screenshots. Messages are from the in-app chat, not external platforms.',
    createdAt: '2026-03-08T20:30:00Z',
  },
  {
    id: 'nt_015',
    reportId: 'rpt_008',
    authorId: 'mod_02',
    authorName: 'Moderator Maria',
    content:
      'The messages are firm but do not contain explicit threats. Tone is subjective.',
    createdAt: '2026-03-08T21:15:00Z',
  },
  {
    id: 'nt_016',
    reportId: 'rpt_008',
    authorId: 'mod_01',
    authorName: 'Moderator Juan',
    content:
      'Dismissing for insufficient evidence. Advising reporter to resurface if new evidence emerges.',
    createdAt: '2026-03-08T21:45:00Z',
  },

  // rpt_002
  {
    id: 'nt_017',
    reportId: 'rpt_002',
    authorId: 'mod_02',
    authorName: 'Moderator Maria',
    content:
      'Fraudulent payment allegation is serious. Need to pull transaction records from the payment gateway.',
    createdAt: '2026-03-14T10:00:00Z',
  },
  {
    id: 'nt_018',
    reportId: 'rpt_002',
    authorId: 'mod_01',
    authorName: 'Moderator Juan',
    content:
      'Transaction log shows no additional charges beyond the app fee. Investigating further.',
    createdAt: '2026-03-14T14:00:00Z',
  },

  // rpt_009
  {
    id: 'nt_019',
    reportId: 'rpt_009',
    authorId: 'mod_02',
    authorName: 'Moderator Maria',
    content:
      'This is the second fraudulent payment report against Hans Dela Cruz this month.',
    createdAt: '2026-03-07T16:00:00Z',
  },
  {
    id: 'nt_020',
    reportId: 'rpt_009',
    authorId: 'mod_01',
    authorName: 'Moderator Juan',
    content: 'Scheduling a review session with both parties for next Monday.',
    createdAt: '2026-03-08T09:00:00Z',
  },
]

// --- Mock data: Admin Users ---

export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    ...MOCK_USERS[0],
    banStatus: 'active',
    warningsCount: 0,
    lastActive: '2026-03-22T08:00:00Z',
  },
  {
    ...MOCK_USERS[1],
    banStatus: 'active',
    warningsCount: 2,
    lastActive: '2026-03-21T14:30:00Z',
  },
  {
    ...MOCK_USERS[2],
    banStatus: 'active',
    warningsCount: 0,
    lastActive: '2026-03-22T10:15:00Z',
  },
  {
    ...MOCK_USERS[3],
    banStatus: 'suspended',
    warningsCount: 3,
    lastActive: '2026-03-18T09:00:00Z',
  },
  {
    ...MOCK_USERS[4],
    banStatus: 'active',
    warningsCount: 1,
    lastActive: '2026-03-22T07:45:00Z',
  },
  {
    ...MOCK_USERS[5],
    banStatus: 'banned',
    warningsCount: 5,
    lastActive: '2026-03-10T16:00:00Z',
  },
  {
    ...MOCK_USERS[6],
    banStatus: 'active',
    warningsCount: 0,
    lastActive: '2026-03-21T20:00:00Z',
  },
  {
    ...MOCK_USERS[7],
    banStatus: 'active',
    warningsCount: 4,
    lastActive: '2026-03-20T11:00:00Z',
  },
]

// --- Helper functions: Audit, Notes, Users ---

export function getAuditEntriesForReport(reportId: string): AuditEntry[] {
  return MOCK_AUDIT_ENTRIES.filter((e) => e.reportId === reportId).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )
}

export function getNotesForReport(reportId: string): Note[] {
  return MOCK_NOTES.filter((n) => n.reportId === reportId).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )
}

export function getReportsForUser(userId: string): Report[] {
  return MOCK_REPORTS.filter(
    (r) => r.reporterUserId === userId || r.reportedUserId === userId,
  )
}

export function getAdminUserById(id: string): AdminUser | undefined {
  return MOCK_ADMIN_USERS.find((u) => u.id === id)
}
