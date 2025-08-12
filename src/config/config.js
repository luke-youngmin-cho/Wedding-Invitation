// Wedding configuration data
export const CONFIG = {
  wedding: {
    bride: {
      name: '권채린',
      father: { name: '권순문', phone: '010-3456-7890' },
      mother: { name: '이은숙', phone: '010-4567-8901' }
    },
    groom: {
      name: '조영민',
      father: { name: '조국제', phone: '010-1234-5678' },
      mother: { name: '김명선', phone: '010-2345-6789' }
    },
    date: {
      year: 2025,
      month: 9,
      day: 27,
      time: '오후 12시 30분',
      dayOfWeek: '토요일'
    },
    venue: {
      name: '켄싱턴호텔 여의도 15층',
      address: '서울특별시 영등포구 국회대로 76길 16, 15층',
      phone: '02-6670-7000',
      coordinates: {
        lat: 37.5294,
        lng: 126.9216
      },
      subway: [
        '9호선 국회의사당역 3번출구 (도보 3분)',
        '5호선 여의나루역 1번출구 (도보 10분)'
      ],
      bus: [
        '여의도 순복음교회 하차',
        '5615번, 5618번, 6623번, 753번'
      ]
    }
  },
  
  accounts: {
    groom: [
      { name: '조영민', bank: '○○은행', number: '123-456-789012' },
      { name: '조국제 (아버지)', bank: '○○은행', number: '234-567-890123' },
      { name: '김명선 (어머니)', bank: '○○은행', number: '345-678-901234' }
    ],
    bride: [
      { name: '권채린', bank: '○○은행', number: '456-789-012345' },
      { name: '권순문 (아버지)', bank: '○○은행', number: '567-890-123456' },
      { name: '이은숙 (어머니)', bank: '○○은행', number: '678-901-234567' }
    ]
  },
  
  share: {
    title: '권채린 ❤️ 조영민 결혼식에 초대합니다',
    description: '2025년 9월 27일 토요일 오후 12시 30분\n켄싱턴호텔 여의도 15층',
    image: '/assets/hero.png',
    kakaoTemplateId: null // Set if using Kakao template
  },
  
  photos: {
    main: '/assets/hero.png',
    album: [
      '/assets/album1.jpg',
      '/assets/album2.jpg',
      '/assets/album3.jpg',
      '/assets/album4.jpg',
      '/assets/album5.jpg',
      '/assets/album6.jpg',
      '/assets/album7.jpg'
    ]
  },
  
  invitation: {
    message: `소중한 분들을 초대합니다.
저희 두 사람이 사랑의 결실을 맺어
하나가 되는 뜻깊은 자리에
오셔서 축복해 주시면
더없는 기쁨이겠습니다.`
  },
  
  map: {
    naver: {
      clientId: import.meta.env.VITE_NAVER_MAP_CLIENT_ID || '',
      searchUrl: 'https://map.naver.com/v5/search/',
      appScheme: 'nmap://search?query='
    },
    kakao: {
      appKey: import.meta.env.VITE_KAKAO_MAP_KEY || '',
      searchUrl: 'https://map.kakao.com/link/search/',
      appScheme: 'kakaomap://search?q='
    }
  },
  
  features: {
    guestbook: true,
    attendance: true,
    gallery: true,
    map: true,
    share: true,
    accounts: true
  },
  
  limits: {
    guestbookMessageLength: 500,
    guestbookNameLength: 50,
    maxAttendees: 10,
    imageUploadSize: 10 * 1024 * 1024 // 10MB
  }
};

// Freeze config to prevent modifications
Object.freeze(CONFIG);
Object.freeze(CONFIG.wedding);
Object.freeze(CONFIG.accounts);
Object.freeze(CONFIG.share);
Object.freeze(CONFIG.photos);
Object.freeze(CONFIG.invitation);
Object.freeze(CONFIG.map);
Object.freeze(CONFIG.features);
Object.freeze(CONFIG.limits);