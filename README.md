# 💒 Wedding Invitation Website

권채린 ❤️ 조영민의 결혼식 초대장 웹사이트

## 🎯 프로젝트 개요

모던과 레트로 두 가지 테마를 지원하는 인터랙티브 웨딩 초대장 웹사이트입니다. Firebase를 통한 실시간 방명록, 참석 여부 확인, 미니게임 등 다양한 기능을 제공합니다.

## ✨ 주요 기능

### 🎨 듀얼 테마 시스템
- **모던 테마**: 깔끔하고 우아한 디자인
- **레트로 테마**: 8비트 스타일의 재미있는 디자인
- 실시간 테마 전환 지원

### 📱 Progressive Web App (PWA)
- 오프라인 지원
- 모바일 앱처럼 설치 가능
- Service Worker를 통한 캐싱

### 🎮 미니게임
- 8비트 스타일 픽셀 아트 게임
- 캐릭터 이동 및 상호작용
- 게임 모드 전환 애니메이션

### 💬 실시간 기능
- **방명록**: Firebase Firestore 기반 실시간 메시지
- **참석 확인**: RSVP 폼을 통한 참석 여부 수집
- **갤러리**: 이미지 슬라이더
- **계좌번호 복사**: 클릭하여 계좌번호 복사 기능

### 📍 위치 정보
- 카카오맵 API 연동
- 교통 정보 안내
- 주차 정보 제공

## 🛠 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Firestore, Storage, Hosting)
- **Build Tool**: Vite
- **PWA**: Service Worker, Web App Manifest
- **APIs**: Kakao Map API
- **Deployment**: Firebase Hosting / GitHub Pages

## 📦 로컬 개발 환경 설정

### 사전 요구 사항
- Node.js 18.0.0 이상
- npm 9.0.0 이상
- Firebase CLI (Firebase 배포 시)

### 로컬 테스트
```bash
# 저장소 클론
git clone https://github.com/luke-youngmin-cho/Wedding-Invitation.git
cd Wedding-Invitation

# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev
```

### 프로덕션 빌드
```bash
# dist 폴더에 배포용 파일 생성
npm run build

# 빌드된 파일 미리보기
npm run preview
```

## 🚀 배포

### GitHub Pages 배포
```bash
# gh-pages를 사용한 자동 배포
npm run deploy
```

### Firebase 배포

1. Firebase CLI 설치:
```bash
npm install -g firebase-tools
```

2. Firebase 로그인:
```bash
firebase login
```

3. Firebase 규칙만 배포:
```bash
npm run firebase:deploy
# 또는
firebase deploy --only firestore:rules,storage:rules
```

4. 전체 사이트 배포:
```bash
# 빌드 후 배포
npm run build
firebase deploy
```

## 📁 프로젝트 구조

```
Wedding-Invitation/
├── assets/                # 이미지 및 미디어 파일
│   ├── AlbumSlides/       # 모던 테마 갤러리 이미지
│   └── AlbumSlidesRetro/  # 레트로 테마 갤러리 이미지
├── css/                   # 스타일시트
│   ├── modern/           # 모던 테마 스타일
│   ├── retro/            # 레트로 테마 스타일
│   └── *.css             # 공통 및 수정 스타일
├── js/                    # JavaScript 파일
│   ├── minigame.js       # 미니게임 로직
│   ├── firebase.js       # Firebase 연동
│   ├── guestbook.js      # 방명록 기능
│   ├── attendance.js     # 참석 확인 기능
│   ├── account-copy.js   # 계좌번호 복사 기능
│   └── ...               # 기타 기능 모듈
├── index.html            # 메인 HTML 파일
├── manifest.json         # PWA 매니페스트
├── sw.js                 # Service Worker
├── firebase.json         # Firebase 설정
├── firestore.rules       # Firestore 보안 규칙
├── storage.rules         # Storage 보안 규칙
├── vite.config.js        # Vite 설정
└── package.json          # npm 설정
```

## 🎮 미니게임 조작법

- **이동**: 방향키 또는 WASD
- **상호작용**: 스페이스바
- **게임 모드 진입**: "🎮 게임하러 가기" 버튼 클릭
- **게임 모드 종료**: EXIT 버튼 클릭

## 🔧 환경 설정

### Firebase 설정
`js/firebase-config.js`에서 Firebase 프로젝트 정보 설정:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### 웨딩 정보 설정
`js/config.js`에서 결혼식 정보 수정 가능

## 📝 NPM 스크립트

- `npm run dev` - 개발 서버 실행 (포트 3000)
- `npm run build` - 프로덕션 빌드
- `npm run preview` - 빌드 결과 미리보기
- `npm run deploy` - GitHub Pages 배포
- `npm run lint` - ESLint 실행
- `npm run format` - Prettier 코드 포맷팅
- `npm run test` - 테스트 실행
- `npm run test:ui` - 테스트 UI 모드
- `npm run firebase:deploy` - Firebase 규칙 배포
- `npm run bundle-report` - 번들 분석 리포트

## 📄 라이선스

MIT License

---

Made with ❤️ for our special day