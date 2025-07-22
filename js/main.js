import { initFirebase, addGuestbook, addRsvp, listenGuestbook } from './firebase.js';

document.addEventListener('DOMContentLoaded', () => {
  initFirebase(); // firebase.js에 정의

  /* 6️⃣ 달력 – 간단 표시 */
  const calendar = document.getElementById('calendar');
  calendar.innerHTML = `<div class="text-center">
    <p class="text-xl font-bold">September 2025</p>
    <div class="grid grid-cols-7 gap-1 text-sm mt-2">
      ${['일','월','화','수','목','금','토'].map(d=>`<span>${d}</span>`).join('')}
      ${Array.from({length:30},(_,i)=>i+1).map(day=>{
        const isDday = day===27;
        return `<span class="${isDday?'bg-rose-500 text-white rounded-full':''}">${day}</span>`;
      }).join('')}
    </div>
  </div>`;

  /* 7️⃣ Swiper 초기화 */
  new Swiper('.swiper', { loop:true, slidesPerView:'auto', spaceBetween:16 });

  /* 8️⃣ 네이버 지도 */
  window.naver.maps.onJSContentLoaded = () => {
    const map = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(37.528683,126.918452), // 켄싱턴호텔 여의도
      zoom: 16
    });
    new naver.maps.Marker({ position: map.getCenter(), map });
    document.getElementById('openNaverApp').onclick = () => {
      location.href = 'nmap://place?lat=37.528683&lng=126.918452&name=켄싱턴호텔여의도';
    };
  };

  /* 9️⃣ 방명록 */
  const gbForm = document.getElementById('guestbookForm');
  gbForm.onsubmit = async e => {
    e.preventDefault();
    await addGuestbook(gbForm.name.value, gbForm.msg.value);
    gbForm.reset();
  };
  listenGuestbook(list => {
    const ul = document.getElementById('guestbookList');
    ul.innerHTML = list.map(d=>`<li class="bg-white p-3 rounded-lg shadow">
       <strong>${d.name}</strong><p class="mt-1 text-sm">${d.msg}</p></li>`).join('');
  });

  /* 🔟 RSVP 팝업 */
  document.getElementById('openRsvp').onclick = () => {
    // Tailwind Modal or simple prompt for brevity
    const name = prompt('이름을 입력해 주세요');
    if (!name) return;
    const attend = confirm('참석하시나요?  OK=예, Cancel=아니오');
    addRsvp({ name, attend });
    alert('감사합니다! 답변이 저장되었습니다.');
  };

  /* ⓫ 계좌번호 복사 */
  document.querySelectorAll('.copy-btn').forEach(btn=>{
    btn.onclick = () => {
      navigator.clipboard.writeText(btn.dataset.acct).then(()=>alert('복사되었습니다!'));
    };
  });

  /* ⓬ 카카오 공유 */
  Kakao.init('YOUR_KAKAO_JS_KEY');
  document.getElementById('shareKakao').onclick = () => {
    Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '채린 ❤ 영민 결혼식 초대장',
        description: '2025-09-27 켄싱턴호텔 여의도',
        imageUrl: location.origin + '/assets/hero.jpg',
        link: { mobileWebUrl: location.href, webUrl: location.href }
      }
    });
  };

  /* ⓭ URL 복사 */
  document.getElementById('copyUrl').onclick = () => {
    navigator.clipboard.writeText(location.href).then(()=>alert('주소가 복사되었습니다.'));
  };
});
