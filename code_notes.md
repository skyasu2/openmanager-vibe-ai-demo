# OpenManager Vibe 코딩 과정 기록

## Vibe 코딩이란?

Vibe 코딩은 AI와 인간 개발자가 함께 코드를 작성하는 새로운 개발 방식입니다. 이 프로젝트는 OpenManager의 자연어 기반 서버 분석 기능을 AI의 도움을 받아 빠르게 구현하기 위해 Vibe 코딩 방식을 적용했습니다.

## 개발 과정 기록

### 1일차: 요구사항 정의 및 초기 설계

#### 요구사항 정의 (Claude와의 대화)
```
사용자: OpenManager라는 서버 운영 포털에 자연어 기반 서버 분석 기능을 추가하려고 합니다. 예를 들어 "CPU 사용률 높은 서버 찾아줘"라고 물어보면 관련 서버 목록을 보여주는 기능이에요. 이런 데모를 만들기 위한 기본 구조를 설계해줄 수 있을까요?

Claude: 자연어 기반 서버 분석 기능의 데모를 위한 구조를 설계해 드리겠습니다. 이 기능은 사용자가 일상적인 언어로 질문하면 시스템이 이를 이해하고 관련 서버 정보를 제공하는 것이 핵심입니다.

### 기본 구조 설계

**1. 프론트엔드 구성**
- 단일 페이지 애플리케이션(SPA) 형태
- 자연어 쿼리 입력창 및 결과 표시 영역
- 서버 상태 시각화 컴포넌트

**2. 데이터 모델**
- 서버 정보: ID, 이름, 상태, CPU, 메모리, 디스크, 네트워크 사용량 등
- 서버 위치, 유형 등 메타데이터

**3. 핵심 기능 모듈**
- 자연어 처리 모듈: 사용자 쿼리 해석
- 데이터 필터링 모듈: 쿼리에 맞는 서버 찾기
- 결과 표시 모듈: 시각화 및 상세 정보 제공

이 데모는 실제 백엔드 연동 없이도 구현 가능하도록 설계하겠습니다.
```

#### 초기 설계 (GPT-4와의 대화)
```
사용자: 데모용으로 30대 정도의 가상 서버 데이터를 생성하는 함수를 작성해줘. 서버 이름, CPU 사용률, 메모리 사용률, 디스크 사용률, 네트워크 상태 등의 정보가 필요해.

GPT-4: 30대의 가상 서버 데이터를 생성하는 함수를 만들어 드리겠습니다. 서버들은 다양한 상태를 가지도록 구성하겠습니다:

```javascript
function generateServerData() {
    const servers = [];
    const locations = ['Seoul', 'Busan', 'Daejeon', 'Jeju'];
    const types = ['web', 'database', 'auth', 'cache'];
    
    for (let i = 1; i <= 30; i++) {
        const server = {
            id: i,
            name: `SRV-${String(i).padStart(3, '0')}`,
            location: locations[i % locations.length],
            type: types[i % types.length],
            cpu: Math.round(Math.random() * 100),
            memory: Math.round(Math.random() * 100),
            disk: Math.round(Math.random() * 100),
            network: Math.round(Math.random() * 100)
        };
        
        // 상태 결정
        if (server.cpu > 80 || server.memory > 80 || server.disk > 90) {
            server.status = 'critical';
        } else if (server.cpu > 60 || server.memory > 60 || server.disk > 70) {
            server.status = 'warning';
        } else {
            server.status = 'normal';
        }
        
        servers.push(server);
    }
    
    return servers;
}
```
```

### 2일차: 핵심 모듈 개발

#### 자연어 처리 모듈 (Gemini와의 대화)
```
사용자: 자연어 쿼리를 분석해서 서버 데이터를 필터링하는 함수를 작성해줘. 예를 들어 "CPU가 높은 서버", "메모리 부족한 서버" 같은 쿼리를 처리할 수 있어야 해.

Gemini: 자연어 쿼리를 분석하여 서버 데이터를 필터링하는 함수를 작성해드리겠습니다. 이 함수는 간단한 키워드 매칭 방식으로 구현하되, 실제 서비스에서는 더 정교한 NLP 모델을 사용하는 것이 좋을 것입니다.

```javascript
function filterServersByQuery(servers, query) {
    // 쿼리를 소문자로 변환하여 검색
    const lowercaseQuery = query.toLowerCase();
    
    // CPU 관련 쿼리 처리
    if (lowercaseQuery.includes('cpu') || lowercaseQuery.includes('씨피유')) {
        if (lowercaseQuery.includes('높') || lowercaseQuery.includes('과부하')) {
            return servers.filter(server => server.cpu > 70);
        } else if (lowercaseQuery.includes('낮') || lowercaseQuery.includes('여유')) {
            return servers.filter(server => server.cpu < 30);
        } else {
            // 기본 CPU 정렬
            return [...servers].sort((a, b) => b.cpu - a.cpu);
        }
    }
    
    // 메모리 관련 쿼리 처리
    if (lowercaseQuery.includes('메모리') || lowercaseQuery.includes('램')) {
        if (lowercaseQuery.includes('높') || lowercaseQuery.includes('부족')) {
            return servers.filter(server => server.memory > 80);
        } else if (lowercaseQuery.includes('낮') || lowercaseQuery.includes('여유')) {
            return servers.filter(server => server.memory < 40);
        } else {
            // 기본 메모리 정렬
            return [...servers].sort((a, b) => b.memory - a.memory);
        }
    }
    
    // 나머지 조건들도 유사하게 구현...
    
    // 기본 결과: 상태 기준 정렬
    return [...servers].sort((a, b) => {
        const order = { 'critical': 0, 'warning': 1, 'normal': 2 };
        return order[a.status] - order[b.status];
    });
}
```
```

#### UI 구현 (Cursor와의 대화)
```
사용자: 서버 상태를 시각적으로 표현하는 대시보드 UI를 HTML/CSS로 만들어줘. Google Material Design 스타일로 만들어줘.

Cursor: Google Material Design 스타일의 서버 상태 대시보드 UI를 HTML과 CSS로 구현해드리겠습니다.

HTML:
```html
<div class="dashboard">
    <header class="app-bar">
        <h1><i class="material-icons">dns</i> 서버 모니터링</h1>
        <div class="search-container">
            <input type="text" id="queryInput" placeholder="자연어로 서버 검색 (예: CPU 높은 서버 찾아줘)">
            <button id="searchButton" class="material-button">
                <i class="material-icons">search</i>
            </button>
        </div>
    </header>
    
    <div class="status-summary">
        <div class="status-card critical">
            <i class="material-icons">error</i>
            <div class="status-count" id="criticalCount">0</div>
            <div class="status-label">위험</div>
        </div>
        <div class="status-card warning">
            <i class="material-icons">warning</i>
            <div class="status-count" id="warningCount">0</div>
            <div class="status-label">경고</div>
        </div>
        <div class="status-card normal">
            <i class="material-icons">check_circle</i>
            <div class="status-count" id="normalCount">0</div>
            <div class="status-label">정상</div>
        </div>
    </div>
    
    <div class="server-grid" id="serverGrid">
        <!-- 서버 카드들이 여기에 동적으로 추가됩니다 -->
    </div>
</div>
```

CSS:
```css
:root {
    --primary-color: #1a73e8;
    --secondary-color: #34a853;
    --danger-color: #ea4335;
    --warning-color: #fbbc05;
    --background-color: #f8f9fa;
    --surface-color: #ffffff;
    --text-color: #202124;
    --border-radius: 8px;
    --shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 나머지 스타일 정의는 생략됩니다 */
```
```

### 3일차: 통합 및 테스트

#### 기능 통합 (Claude와의 대화)
```
사용자: 이제 지금까지 개발한 모듈들을 모두 통합해야 해. 전체 코드 구조를 설명하고 각 파일별로 필요한 코드를 제공해줄래?

Claude: OpenManager 자연어 기반 서버 분석 기능의 전체 코드 구조를 설계하고 통합하겠습니다. 웹 기반 데모이므로 클라이언트 사이드에서 모든 기능이 동작하도록 구성하겠습니다.

## 전체 코드 구조

### 파일 구조
1. `index.html` - 메인 HTML 페이지
2. `style.css` - 스타일시트
3. `fixed_dummy_data.js` - 가상 서버 데이터 생성
4. `data_processor.js` - 자연어 쿼리 처리 및 데이터 필터링
5. `summary.js` - 분석 결과 요약 생성
6. `app.js` - 메인 애플리케이션 로직

각 파일의 역할과 코드를 상세히 설명해 드리겠습니다...
```

#### 테스트 및 디버깅 (Gemini와의 대화)
```
사용자: 코드에 버그가 있어. "CPU 사용률 높은 서버 찾아줘"라고 검색하면 결과가 안 나와. 디버깅을 도와줄래?

Gemini: 이 문제를 해결하기 위해 디버깅을 진행해보겠습니다. 

가장 먼저 의심되는 부분은 `filterServersByQuery` 함수의 조건문입니다. 특히 CPU 관련 검색어를 처리하는 부분을 살펴봐야 할 것 같습니다.

1. 자연어 쿼리 처리 부분을 확인해보겠습니다:

```javascript
// data_processor.js의 일부분
function filterServersByQuery(servers, query) {
    // 쿼리를 소문자로 변환하여 검색
    const lowercaseQuery = query.toLowerCase();
    
    // CPU 관련 쿼리 처리
    if (lowercaseQuery.includes('cpu') || lowercaseQuery.includes('씨피유')) {
        if (lowercaseQuery.includes('높') || lowercaseQuery.includes('과부하')) {
            return servers.filter(server => server.cpu > 70);
        } else if (lowercaseQuery.includes('낮') || lowercaseQuery.includes('여유')) {
            return servers.filter(server => server.cpu < 30);
        } else {
            // 기본 CPU 정렬
            return [...servers].sort((a, b) => b.cpu - a.cpu);
        }
    }
    
    // 여기서 문제가 있을 수 있습니다!
    // 다른 조건들이 나오기 전에 기본 반환이 있어야 합니다.
    
    // ...나머지 코드...
}
```

문제점:
1. '사용률'이라는 단어를 검색 조건에 포함하지 않아서 문제가 생길 수 있습니다.
2. 쿼리에 "CPU"와 "높은"이 포함되어 있더라도 다른 단어("사용률")로 인해 정확히 매칭되지 않을 수 있습니다.

수정 제안:
```javascript
// CPU 관련 쿼리 처리 개선
if (lowercaseQuery.includes('cpu') || lowercaseQuery.includes('씨피유') || lowercaseQuery.includes('사용률')) {
    if (lowercaseQuery.includes('높') || lowercaseQuery.includes('과부하') || lowercaseQuery.includes('많')) {
        return servers.filter(server => server.cpu > 70);
    } 
    // ...나머지 코드...
}
```

이렇게 변경하면 "CPU 사용률 높은 서버"와 같은 쿼리도 정확히 처리될 것입니다.
```

## Vibe 코딩의 이점

### 1. 개발 속도 향상
- 초기 설계부터 구현까지 AI의 도움으로 약 3일 만에 완성
- 코드 작성 시간을 크게 단축하여 핵심 로직 구현에 집중

### 2. 다양한 관점 활용
- 여러 AI(Claude, GPT-4, Gemini, Cursor)의 강점을 선택적으로 활용
- 각 AI의 특성에 맞게 적절한 부분을 담당하게 함

### 3. 학습 및 발전
- AI가 제안한 코드를 검토하고 개선하는 과정에서 새로운 패턴 학습
- 다양한 구현 방식에 대한 아이디어 획득

## 결론

이 프로젝트는 Vibe 코딩을 통해 OpenManager의 자연어 기반 서버 분석 기능을 빠르게 구현한 사례입니다. AI의 도움을 받아 개발 시간을 단축하고, 다양한 관점에서 코드를 작성할 수 있었습니다. 향후 실제 OpenManager에 적용 시에는 보안, 성능, 규모 확장성 등을 추가로 고려해야 합니다. 