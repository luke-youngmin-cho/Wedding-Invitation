# 💑 Wedding Invitation Website

Beautiful and modern wedding invitation website with Firebase integration for guestbook and RSVP features.

## ✨ Features

- 📱 **Responsive Design** - Works perfectly on all devices
- 📝 **Digital Guestbook** - Guests can leave messages
- ✅ **RSVP System** - Track attendance with meal preferences
- 🖼️ **Photo Gallery** - Beautiful photo slider with Swiper.js
- 🗺️ **Interactive Map** - Integration with Naver and Kakao Maps
- 📤 **Social Sharing** - Easy sharing via KakaoTalk
- 🔔 **PWA Support** - Installable as a mobile app
- 🔒 **Secure** - Environment variables for sensitive data
- ⚡ **Fast** - Optimized with Vite bundler

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Firebase project with Firestore enabled
- GitHub account for deployment

### Installation

1. Clone the repository:
```bash
git clone https://github.com/luke-youngmin-cho/Wedding-Invitation.git
cd Wedding-Invitation
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Configure `.env.local` with your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... other config
```

5. Start development server:
```bash
npm run dev
```

## 📦 Deployment

### GitHub Pages

1. Build the project:
```bash
npm run build
```

2. Deploy to GitHub Pages:
```bash
npm run deploy
```

### Firebase Hosting (Alternative)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Initialize Firebase:
```bash
firebase init
```

3. Deploy:
```bash
firebase deploy
```

## 🔐 Security Setup

### Firebase Security Rules

Deploy security rules to protect your data:

```bash
firebase deploy --only firestore:rules,storage:rules
```

### GitHub Secrets

Add these secrets to your repository for CI/CD:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_KAKAO_JS_KEY`
- `FIREBASE_TOKEN` (for deploying rules)

## 🛠️ Customization

### Wedding Information

Edit `src/config/config.js` to update:
- Couple names
- Wedding date and venue
- Parent contact information
- Bank account details
- Photo albums

### Styling

Modify `src/css/main.css` for custom colors and styles.

### Features Toggle

Enable/disable features in `src/config/config.js`:
```javascript
features: {
  guestbook: true,
  attendance: true,
  gallery: true,
  // ...
}
```

## 📁 Project Structure

```
Wedding-Invitation/
├── src/
│   ├── assets/          # Images and media
│   ├── config/          # Configuration files
│   ├── css/             # Stylesheets
│   ├── modules/         # Feature modules
│   ├── utils/           # Utility functions
│   ├── index.html       # Main HTML
│   └── main.js          # Entry point
├── public/
│   ├── manifest.json    # PWA manifest
│   └── sw.js           # Service worker
├── .github/
│   └── workflows/      # GitHub Actions
├── firestore.rules     # Firestore security rules
├── storage.rules       # Storage security rules
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies
```

## 🧪 Testing

Run tests:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Firebase](https://firebase.google.com/) for backend services
- [Vite](https://vitejs.dev/) for build tooling
- [Swiper.js](https://swiperjs.com/) for photo gallery
- [DOMPurify](https://github.com/cure53/DOMPurify) for XSS protection
- [Font Awesome](https://fontawesome.com/) for icons

## 📞 Support

For issues and questions, please [open an issue](https://github.com/luke-youngmin-cho/Wedding-Invitation/issues).

---

Made with ❤️ for our special day
