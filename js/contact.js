// ========================================
// CONTACT MODULE - 연락처 관리
// ========================================
const ContactManager = {
    call: function(side, parentType) {
        const parent = CONFIG.wedding[side][parentType];
        if (!parent || !parent.phone) {
            NotificationManager.error('연락처 정보를 찾을 수 없습니다.');
            return;
        }

        const phoneNumber = parent.phone;
        const formattedNumber = Utils.formatPhoneNumber(phoneNumber);
        
        // 분석 추적
        AnalyticsManager.track('contact_call', {
            side: side,
            parent_type: parentType,
            contact_method: 'phone'
        });

        if (confirm(`${parent.name} (${formattedNumber})로 전화를 걸까요?`)) {
            try {
                window.location.href = `tel:${phoneNumber}`;
            } catch (error) {
                console.error('전화 연결 실패:', error);
                NotificationManager.error('전화를 걸 수 없습니다. 직접 다이얼해 주세요.');
                
                // 전화번호 복사로 fallback
                Utils.copyToClipboard(phoneNumber, '전화번호가 복사되었습니다.');
            }
        }
    },

    sms: function(side, parentType) {
        const parent = CONFIG.wedding[side][parentType];
        if (!parent || !parent.phone) {
            NotificationManager.error('연락처 정보를 찾을 수 없습니다.');
            return;
        }

        const phoneNumber = parent.phone;
        const message = this.getSMSMessage(side, parentType);
        
        // 분석 추적
        AnalyticsManager.track('contact_sms', {
            side: side,
            parent_type: parentType,
            contact_method: 'sms'
        });

        try {
            if (Utils.isMobile()) {
                // 모바일에서는 SMS 앱 직접 열기
                window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
            } else {
                // 데스크톱에서는 메시지와 함께 번호 복사
                const fullMessage = `${message}\n\n전화번호: ${phoneNumber}`;
                Utils.copyToClipboard(fullMessage, '메시지와 전화번호가 복사되었습니다.');
            }
        } catch (error) {
            console.error('메시지 전송 실패:', error);
            NotificationManager.error('메시지를 보낼 수 없습니다.');
            
            // 전화번호 복사로 fallback
            Utils.copyToClipboard(phoneNumber, '전화번호가 복사되었습니다.');
        }
    },

    getSMSMessage: function(side, parentType) {
        const { bride, groom, date, venue } = CONFIG.wedding;
        const weddingDate = `${date.year}년 ${date.month}월 ${date.day}일`;
        
        return `안녕하세요. ${bride.name} ❤️ ${groom.name} 결혼식(${weddingDate}, ${venue.name}) 관련하여 연락드립니다.`;
    },

    // 연락처 정보 가져오기
    getContactInfo: function(side, parentType) {
        const parent = CONFIG.wedding[side][parentType];
        if (!parent) return null;

        return {
            name: parent.name,
            phone: parent.phone,
            formattedPhone: Utils.formatPhoneNumber(parent.phone),
            side: side === 'groom' ? '신랑측' : '신부측',
            relation: parentType === 'father' ? '아버지' : '어머니'
        };
    },

    // 모든 연락처 정보 가져오기
    getAllContacts: function() {
        const contacts = [];
        
        ['groom',
