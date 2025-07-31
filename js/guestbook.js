// ========================================
// GUESTBOOK MODULE - 방명록 관리
// ========================================
const GuestbookManager = {
    open: function() {
        ModalManager.open('guestbookModal');
        
        // 포커스를 이름 입력란으로
        setTimeout(() => {
            const nameInput = document.getElementById('guestName');
            if (nameInput) nameInput.focus();
        }, 100);
    },

    close: function() {
        ModalManager.close('guestbookModal');
    },

    submit: async function(formData) {
        try {
            // 로딩 표시
            ModalManager.showLoading('방명록을 저장하는 중...');
            
            // 폼 검증
            if (!FormManager.validate.guestbook(formData)) {
                ModalManager.hideLoading();
                return;
            }
            
            // 데이터 정제
            const sanitizedData = FormManager.sanitize(formData);
            
            const entry = {
                name: sanitizedData.get('name'),
                message: sanitizedData.get('message')
            };

            // API 호출 (현재는 로컬 저장)
            await APIManager.submitGuestbook(entry);
            
            // 로컬 데이터 업데이트
            DataManager.guestbook.add(entry);
            this.updateList();
            
            // 성공 처리
            ModalManager.hideLoading();
            this.close();
            
            NotificationManager.success('방명록이 등록되었습니다. 감사합니다! 💕');
            
            // 분석 추적
            AnalyticsManager.guestbookSubmit();
            
        } catch (error) {
            ModalManager.hideLoading();
            console.error('방명록 제출 오류:', error);
            NotificationManager.error('방명록 등록 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    },

    updateList: function() {
        const list = document.getElementById('guestbookList');
        if (!list) {
            console.warn('방명록 리스트 컨테이너를 찾을 수 없습니다.');
            return;
        }

        const entries = DataManager.guestbook.getAll();
        
        // 리스트 초기화
        list.innerHTML = '';
        
        if (entries.length === 0) {
            this.showEmptyState(list);
            return;
        }
        
        // 방명록 항목들 렌더링
        entries.forEach((entry, index) => {
            const item = this.createGuestbookItem(entry, index);
            list.appendChild(item);
        });
        
        // 새로 추가된 항목 강조 (첫 번째 항목)
        if (entries.length > 0) {
            const firstItem = list.firstElementChild;
            if (firstItem) {
                firstItem.classList.add('new-item');
                setTimeout(() => {
                    firstItem.classList.remove('new-item');
                }, 2000);
            }
        }
    },

    createGuestbookItem: function(entry, index) {
        const item = document.createElement('div');
        item.className = 'guestbook-item';
        item.setAttribute('data-id', entry.id);
        
        // 메시지 길이에 따른 표시 처리
        const message = entry.message;
        const isLongMessage = message.length > 100;
        const displayMessage = isLongMessage ? message.substring(0, 100) + '...' : message;
        
        item.innerHTML = `
            <div class="guest-header">
                <div class="guest-name">${Utils.sanitizeString(entry.name)}</div>
                <div class="guest-date">${entry.date}</div>
            </div>
            <div class="guest-message" ${isLongMessage ? 'data-full-message="' + Utils.sanitizeString(message) + '"' : ''}>
                ${Utils.sanitizeString(displayMessage)}
                ${isLongMessage ? '<button class="read-more-btn">더보기</button>' : ''}
            </div>
            <div class="guest-number">#${String(DataManager.guestbook.getAll().length - index).padStart(3, '0')}</div>
        `;
        
        // 더보기 버튼 이벤트
        if (isLongMessage) {
            const readMoreBtn = item.querySelector('.read-more-btn');
            const messageDiv = item.querySelector('.guest-message');
            let isExpanded = false;
            
            readMoreBtn.addEventListener('click', () => {
                if (isExpanded) {
                    messageDiv.innerHTML = Utils.sanitizeString(displayMessage) + '<button class="read-more-btn">더보기</button>';
                    isExpanded = false;
                } else {
                    messageDiv.innerHTML = Utils.sanitizeString(message) + '<button class="read-more-btn">접기</button>';
                    isExpanded = true;
                }
                
                // 이벤트 리스너 재등록
                const newBtn = messageDiv.querySelector('.read-more-btn');
                newBtn.addEventListener('click', arguments.callee);
            });
        }
        
        // 항목 클릭시 하이라이트
        item.addEventListener('click', () => {
            // 다른 항목들의 하이라이트 제거
            document.querySelectorAll('.guestbook-item.highlighted').forEach(el => {
                el.classList.remove('highlighted');
            });
            
            // 현재 항목 하이라이트
            item.classList.add('highlighted');
            
            setTimeout(() => {
                item.classList.remove('highlighted');
            }, 3000);
        });
        
        return item;
    },

    showEmptyState: function(container) {
        container.innerHTML = `
            <div class="empty-state" style="
                text-align: center; 
                color: #666; 
                padding: 40px 20px;
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border-radius: 15px;
                margin: 10px 0;
            ">
                <div style="font-size: 3em; margin-bottom: 15px;">✍️</div>
                <h4 style="margin-bottom: 10px; color: #495057;">아직 방명록이 없습니다</h4>
                <p style="font-size: 0.9em; color: #6c757d;">첫 번째 축하 메시지를 남겨주세요!</p>
            </div>
        `;
    },

    // 방명록 검색 기능
    search: function(keyword) {
        const entries = DataManager.guestbook.getAll();
        const filtered = entries.filter(entry => 
            entry.name.toLowerCase().includes(keyword.toLowerCase()) ||
            entry.message.toLowerCase().includes(keyword.toLowerCase())
        );
        
        const list = document.getElementById('guestbookList');
        if (!list) return;
        
        list.innerHTML = '';
        
        if (filtered.length === 0) {
            list.innerHTML = `
                <div class="no-results" style="text-align: center; padding: 20px; color: #666;">
                    "${keyword}"에 대한 검색 결과가 없습니다.
                </div>
            `;
            return;
        }
        
        filtered.forEach((entry, index) => {
            const item = this.createGuestbookItem(entry, index);
            list.appendChild(item);
        });
    },

    // 방명록 통계
    getStatistics: function() {
        const entries = DataManager.guestbook.getAll();
        
        if (entries.length === 0) {
            return {
                total: 0,
                avgLength: 0,
                longestMessage: '',
                recentCount: 0
            };
        }
        
        const totalLength = entries.reduce((sum, entry) => sum + entry.message.length, 0);
        const avgLength = Math.round(totalLength / entries.length);
        const longestMessage = entries.reduce((longest, entry) => 
            entry.message.length > longest.length ? entry.message : longest, '');
        
        // 최근 24시간 내 방명록 수
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentCount = entries.filter(entry => 
            new Date(entry.timestamp) > oneDayAgo
        ).length;
        
        return {
            total: entries.length,
            avgLength: avgLength,
            longestMessage: longestMessage.substring(0, 50) + (longestMessage.length > 50 ? '...' : ''),
            recentCount: recentCount
        };
    },

    // 방명록 내보내기 (관리자용)
    export: function() {
        const entries = DataManager.guestbook.getAll();
        
        if (entries.length === 0) {
            NotificationManager.warning('내보낼 방명록이 없습니다.');
            return;
        }
        
        // CSV 형식으로 내보내기
        let csvContent = '순번,이름,메시지,작성일\n';
        
        entries.forEach((entry, index) => {
            const row = [
                entries.length - index,
                `"${entry.name}"`,
                `"${entry.message.replace(/"/g, '""')}"`,
                entry.date
            ].join(',');
            
            csvContent += row + '\n';
        });
        
        // BOM 추가 (한글 깨짐 방지)
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `방명록_${new Date().toISOString().split('T')[0]}.csv`;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(link.href);
        
        NotificationManager.success('방명록이 내보내기 되었습니다.');
    },

    // 실시간 글자 수 카운터 설정
    setupCharCounter: function() {
        const messageTextarea = document.getElementById('guestMessage');
        if (!messageTextarea) return;
        
        const maxLength = 500;
        
        // 카운터 요소 생성
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.8em;
            color: #666;
            margin-top: 5px;
        `;
        
        messageTextarea.parentNode.appendChild(counter);
        
        // 글자 수 업데이트 함수
        const updateCounter = () => {
            const currentLength = messageTextarea.value.length;
            counter.textContent = `${currentLength}/${maxLength}`;
            
            if (currentLength > maxLength * 0.9) {
                counter.style.color = '#ff6b6b';
            } else {
                counter.style.color = '#666';
            }
        };
        
        // 초기 카운터 설정
        updateCounter();
        
        // 입력 이벤트 리스너
        messageTextarea.addEventListener('input', updateCounter);
    }
};
