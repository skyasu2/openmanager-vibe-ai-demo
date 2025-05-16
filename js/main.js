// 전역 변수
let currentScenario = null;
let serverData = [];
let updateInterval = null;

// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', () => {
    // 로그인 상태 확인
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        const currentUser = localStorage.getItem('currentUser') || '관리자';
        document.getElementById('currentUser').textContent = currentUser;
        showDashboard();
    } else {
        showLoginSection();
    }
    
    // 서버 데이터 초기화
    initializeServerData();
});

// 로그인 처리
function handleLogin() {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', '관리자');
    showDashboard();
}

// 로그아웃 처리
function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    showLoginSection();
    clearInterval(updateInterval);
}

// 대시보드 표시
function showDashboard() {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('scenarioSection').classList.add('hidden');
    
    // 서버 데이터 업데이트
    updateDashboard();
}

// 로그인 섹션 표시
function showLoginSection() {
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
    
    // 기존 업데이트 간격 정리
    if (updateInterval) {
        clearInterval(updateInterval);
    }
}

// 시나리오 선택기 표시
function showScenarioSelector() {
    document.getElementById('scenarioSection').classList.remove('hidden');
    document.querySelector('.nav-item:nth-child(2)').classList.add('active');
    document.querySelector('.nav-item:nth-child(1)').classList.remove('active');
    
    // 기본 응답 표시
    if (!currentScenario) {
        showDefaultResponse();
    }
}

// 서버 데이터 초기화
function initializeServerData() {
    serverData = generateServerData();
    updateDashboard();
}

// 서버 데이터 생성
function generateServerData() {
    const servers = [];
    for (let i = 1; i <= 100; i++) {
        servers.push({
            id: i,
            name: `Server-${String(i).padStart(3, '0')}`,
            cpu: generateMetricValue('cpu'),
            memory: generateMetricValue('memory'),
            disk: generateMetricValue('disk'),
            network: generateMetricValue('network'),
            status: getRandomStatus(['normal', 'warning', 'critical'], [0.6, 0.2, 0.2])
        });
    }
    return servers;
}

// 메트릭 값 생성
function generateMetricValue(metric) {
    const baseValue = Math.random() * 100;
    switch (metric) {
        case 'cpu':
            return Math.min(100, Math.max(0, baseValue + (Math.random() * 20 - 10)));
        case 'memory':
            return Math.min(100, Math.max(0, baseValue + (Math.random() * 15 - 7.5)));
        case 'disk':
            return Math.min(100, Math.max(0, baseValue + (Math.random() * 10 - 5)));
        case 'network':
            return Math.min(100, Math.max(0, baseValue + (Math.random() * 30 - 15)));
        default:
            return baseValue;
    }
}

// 상태 랜덤 선택
function getRandomStatus(statuses, weights) {
    const random = Math.random();
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (random < sum) return statuses[i];
    }
    return statuses[0];
}

// 데이터 업데이트 시작
function startDataUpdates() {
    // 10분마다 데이터 업데이트
    updateInterval = setInterval(updateServerData, 10 * 60 * 1000);
}

// 서버 데이터 업데이트
function updateServerData() {
    serverData = serverData.map(server => ({
        ...server,
        cpu: generateMetricValue('cpu'),
        memory: generateMetricValue('memory'),
        disk: generateMetricValue('disk'),
        network: generateMetricValue('network'),
        status: calculateServerStatus(server)
    }));
    updateDashboard();
}

// 서버 상태 계산
function calculateServerStatus(server) {
    if (server.cpu > 90 || server.memory > 90 || server.disk > 90) {
        return 'critical';
    } else if (server.cpu > 70 || server.memory > 70 || server.disk > 70) {
        return 'warning';
    }
    return 'normal';
}

// 대시보드 업데이트
function updateDashboard() {
    updateStatusSummary();
    updateServerList();
}

// 상태 요약 업데이트
function updateStatusSummary() {
    const statusCounts = {
        normal: serverData.filter(s => s.status === 'normal').length,
        warning: serverData.filter(s => s.status === 'warning').length,
        critical: serverData.filter(s => s.status === 'critical').length
    };

    const summaryHTML = `
        <div class="status-item normal">
            <i class="fas fa-check-circle"></i>
            <div>
                <h3>정상</h3>
                <p>${statusCounts.normal}대</p>
            </div>
        </div>
        <div class="status-item warning">
            <i class="fas fa-exclamation-circle"></i>
            <div>
                <h3>경고</h3>
                <p>${statusCounts.warning}대</p>
            </div>
        </div>
        <div class="status-item critical">
            <i class="fas fa-times-circle"></i>
            <div>
                <h3>위험</h3>
                <p>${statusCounts.critical}대</p>
            </div>
        </div>
    `;

    document.getElementById('statusSummary').innerHTML = summaryHTML;
}

// 서버 목록 업데이트
function updateServerList() {
    const serverListHTML = serverData.map(server => `
        <div class="server-card fade-in">
            <div class="server-header">
                <span class="server-name">${server.name}</span>
                <span class="server-status ${server.status}">${getStatusText(server.status)}</span>
            </div>
            <div class="server-metrics">
                <div class="metric-item">
                    <span class="metric-label">CPU</span>
                    <span class="metric-value">${server.cpu.toFixed(1)}%</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">메모리</span>
                    <span class="metric-value">${server.memory.toFixed(1)}%</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">디스크</span>
                    <span class="metric-value">${server.disk.toFixed(1)}%</span>
                </div>
                <div class="metric-item">
                    <span class="metric-label">네트워크</span>
                    <span class="metric-value">${server.network.toFixed(1)}%</span>
                </div>
            </div>
        </div>
    `).join('');

    document.getElementById('serverList').innerHTML = serverListHTML;
}

// 상태 텍스트 가져오기
function getStatusText(status) {
    switch (status) {
        case 'normal': return '정상';
        case 'warning': return '경고';
        case 'critical': return '위험';
        default: return status;
    }
}

// 시나리오 변경 처리
function handleScenarioChange(scenario) {
    currentScenario = scenario;
    showScenarioResponse(scenario);
}

// 시나리오 응답 표시
function showScenarioResponse(scenario) {
    const response = getScenarioResponse(scenario);
    const responseHTML = `
        <div class="response-card fade-in">
            <div class="response-header">
                <i class="fas fa-robot"></i>
                <h3>AI 분석 결과</h3>
            </div>
            <div class="response-content">
                <div class="analysis-section">
                    <h4><i class="fas fa-chart-line"></i> 문제 분석</h4>
                    <p>${response.analysis}</p>
                </div>
                <div class="impact-section">
                    <h4><i class="fas fa-exclamation-triangle"></i> 영향도</h4>
                    <p>${response.impact}</p>
                </div>
                <div class="solution-section">
                    <h4><i class="fas fa-lightbulb"></i> 해결 방안</h4>
                    <p>${response.solution}</p>
                </div>
                <div class="monitoring-section">
                    <h4><i class="fas fa-eye"></i> 모니터링 항목</h4>
                    <ul>
                        ${response.monitoring.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;

    document.getElementById('aiResponse').innerHTML = responseHTML;
}

// 시나리오 응답 가져오기
function getScenarioResponse(scenario) {
    const responses = {
        cpu: {
            analysis: 'CPU 사용률이 비정상적으로 높은 상태입니다. 프로세스 분석 결과, 백그라운드 작업이 과도하게 실행되고 있습니다.',
            impact: '서버 응답 시간이 지연되고 있으며, 다른 프로세스의 실행에도 영향을 미치고 있습니다.',
            solution: '1. 불필요한 프로세스 종료\n2. CPU 사용량이 높은 프로세스 최적화\n3. 필요시 서버 리소스 증설',
            monitoring: [
                'CPU 사용률 추이 모니터링',
                '프로세스별 CPU 사용량 분석',
                '시스템 로드 평균 확인'
            ]
        },
        memory: {
            analysis: '메모리 사용량이 지속적으로 증가하는 패턴이 관찰됩니다. 메모리 누수가 의심됩니다.',
            impact: '시스템 성능 저하 및 다른 애플리케이션의 메모리 할당 실패 가능성이 있습니다.',
            solution: '1. 메모리 누수 발생 프로세스 식별\n2. 애플리케이션 메모리 관리 최적화\n3. 주기적인 메모리 정리 작업 실행',
            monitoring: [
                '메모리 사용량 추이 모니터링',
                '스왑 사용량 확인',
                '프로세스별 메모리 사용량 분석'
            ]
        },
        disk: {
            analysis: '디스크 사용량이 임계치를 초과했습니다. 로그 파일과 임시 파일이 과도하게 쌓여있습니다.',
            impact: '새로운 파일 생성이 불가능하며, 시스템 성능이 저하될 수 있습니다.',
            solution: '1. 불필요한 로그 파일 정리\n2. 임시 파일 정리 작업 실행\n3. 디스크 용량 증설 검토',
            monitoring: [
                '디스크 사용량 추이 모니터링',
                '파일 시스템 사용량 분석',
                '디스크 I/O 성능 확인'
            ]
        },
        service: {
            analysis: '서비스가 비정상적으로 종료되었습니다. 시스템 로그 분석 결과, 외부 요청 과부하가 원인으로 파악됩니다.',
            impact: '서비스 이용이 불가능하며, 사용자 요청이 처리되지 않고 있습니다.',
            solution: '1. 서비스 재시작\n2. 로드 밸런서 설정 최적화\n3. 서비스 자동 복구 스크립트 배포',
            monitoring: [
                '서비스 상태 모니터링',
                '시스템 로그 실시간 확인',
                '네트워크 트래픽 분석'
            ]
        }
    };

    return responses[scenario] || {
        analysis: '선택된 시나리오에 대한 분석을 진행 중입니다.',
        impact: '영향도 분석 중...',
        solution: '해결 방안을 검토 중입니다.',
        monitoring: ['모니터링 항목을 확인 중입니다.']
    };
}

// 데이터 새로고침
function refreshData() {
    updateServerData();
} 