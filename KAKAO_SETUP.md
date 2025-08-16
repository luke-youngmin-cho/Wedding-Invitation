# 카카오톡 공유 기능 설정 가이드

## 카카오 개발자 계정 설정

1. **카카오 개발자 사이트 접속**
   - https://developers.kakao.com 접속
   - 카카오 계정으로 로그인

2. **애플리케이션 등록**
   - 상단 메뉴 "내 애플리케이션" 클릭
   - "애플리케이션 추가하기" 클릭
   - 앱 이름: "Wedding Invitation" (또는 원하는 이름)
   - 사업자명: 개인 (또는 해당하는 정보)

3. **JavaScript 키 발급**
   - 생성된 앱 클릭
   - "앱 키" 메뉴에서 "JavaScript 키" 복사

4. **플랫폼 등록**
   - "앱 설정" > "플랫폼" 메뉴
   - "Web 플랫폼 등록" 클릭
   - 사이트 도메인 추가:
     - 로컬 테스트: `http://localhost:5500`
     - GitHub Pages: `https://luke-youngmin-cho.github.io`
   - 저장

5. **코드에 키 적용**
   - `index.html` 파일 열기
   - `YOUR_KAKAO_JAVASCRIPT_KEY` 부분을 실제 JavaScript 키로 교체
   ```javascript
   Kakao.init('YOUR_KAKAO_JAVASCRIPT_KEY'); // 여기에 실제 키 입력
   ```

## 테스트 방법

1. 로컬에서 테스트
   - Live Server 또는 로컬 서버로 실행
   - "카카오톡 공유" 버튼 클릭

2. 배포 후 테스트
   - GitHub Pages에 배포
   - 모바일에서 접속하여 카카오톡 공유 테스트

## 주의사항

- JavaScript 키는 공개되어도 도메인 제한으로 보호됨
- 등록한 도메인에서만 작동
- 실제 카카오톡 앱이 설치된 기기에서 테스트 권장

## 문제 해결

- **"KakaoSDK is not initialized" 오류**: JavaScript 키가 올바르게 입력되었는지 확인
- **"도메인이 등록되지 않음" 오류**: 카카오 개발자 콘솔에서 도메인 등록 확인
- **공유가 안 되는 경우**: 카카오톡 앱 업데이트 확인