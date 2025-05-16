# OpenManager Vibe AI Assistant Demo

## 프로젝트 소개
이 프로젝트는 OpenManager 운영 포털의 느낌을 반영한 웹 기반 AI 어시스턴트 데모입니다.  
Cursor Pro의 Vibe Coding 기능을 통해, 운영 경보에 대한 자연어 설명, 대응방안 안내, 상태 요약 등의 기능을 제공합니다.

## 기술 스택
- HTML / CSS / JavaScript (Vanilla)
- GPT-4o / Claude 연동 없이 사전 정의된 응답으로 시연 가능
- Netlify 배포 가능 구조
- GitHub Actions, 커밋 자동화 등은 추후 추가 가능

## 주요 기능
- [x] 로그인 UI (디자인 목적용, 기능 없음)
- [x] 장애 상황 선택 → 자동 프롬프트 생성
- [x] AI 어시스턴트 응답 카드 UI
- [x] 경보 시나리오별 자연어 질의/응답 시뮬레이션
- [ ] GPT 연동 (선택사항)
- [ ] Slack/Email 등 알림 연동 (선택사항)

## 향후 계획
- [ ] 프롬프트 DB화를 통한 질의 다양화
- [ ] 실제 운영환경에 적용할 수 있는 서버사이드 연동

## 실행 방법
1. 저장소 클론
```bash
git clone [repository-url]
```

2. `index.html` 또는 `demo.html` 실행
- 로컬에서 직접 파일을 열거나
- 간단한 웹 서버를 통해 실행

3. Netlify 배포
- `main` 브랜치를 Netlify에 연결하여 자동 배포

## 라이선스
Internal use only / INSOFT Submission

## 프로젝트 구조
```
openmanager-vibe-ai-demo/
├── index.html          # 메인 HTML 파일
├── css/
│   └── style.css      # 스타일시트
├── js/
│   └── main.js        # 메인 JavaScript 파일
└── assets/            # 이미지 등 정적 자원
    └── ai-avatar.png  # AI 어시스턴트 아바타
``` 