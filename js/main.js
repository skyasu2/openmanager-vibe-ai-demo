// 전역 변수
let currentScenario = null;
let serverData = [];
let updateInterval;

// 사전 정의된 응답 데이터
const scenarioResponses = {
    high_cpu: {
        analysis: "CPU 사용률이 95% 이상으로 급증한 상황입니다. 이는 시스템에 과부하가 발생하고 있음을 의미합니다.",
        solution: "1. 현재 실행 중인 프로세스 확인\n2. 불필요한 프로세스 종료\n3. 시스템 리소스 모니터링 강화",
        impact: "서비스 응답 지연 및 시스템 안정성 저하 가능성이 있습니다."
    },
    memory_leak: {
        analysis: "메모리 사용량이 지속적으로 증가하고 있으며, 메모리 누수가 발생한 것으로 보입니다.",
        solution: "1. 메모리 누수 발생 프로세스 식별\n2. 해당 프로세스 재시작\n3. 메모리 모니터링 설정 확인",
        impact: "시스템 성능 저하 및 다른 프로세스에 영향을 줄 수 있습니다."
    },
    disk_full: {
        analysis: "디스크 사용량이 90% 이상으로 증가하여 시스템 안정성에 위험이 있습니다.",
        solution: "1. 불필요한 로그 파일 정리\n2. 오래된 백업 데이터 정리\n3. 디스크 용량 확장 검토",
        impact: "새로운 데이터 저장 불가 및 시스템 로그 기록 중단 가능성이 있습니다."
    },
    service_down: {
        analysis: "주요 서비스가 중단되었으며, 현재 서비스가 응답하지 않는 상태입니다.",
        solution: "1. 서비스 프로세스 상태 확인\n2. 서비스 재시작\n3. 로그 확인을 통한 원인 분석",
        impact: "사용자 서비스 이용 불가 및 비즈니스 연속성 저하가 발생할 수 있습니다."
    }
};

// 서버 데이터 생성 함수
function generateServerData() {
    const servers = [];
    const metrics = ['cpu', 'memory', 'disk', 'network'];
    const statuses = ['normal', 'warning', 'critical'];
    const statusWeights = [0.6, 0.2, 0.2]; // 60% 정상, 20% 경고, 20% 위험

    for (let i = 1; i <= 100; i++) {
        const server = {
            id: `server-${i}`,
            name: `서버 ${i}`,
            status: getRandomStatus(statuses, statusWeights),
            metrics: {
                cpu: generateMetricValue('cpu'),
                memory: generateMetricValue('memory'),
                disk: generateMetricValue('disk'),
                network: generateMetricValue('network')
            },
            lastUpdate: new Date()
        };
        servers.push(server);
    }
    return servers;
}

// 메트릭 값 생성 함수
function generateMetricValue(metric) {
    const baseValue = Math.random() * 100;
    let value;
    
    switch(metric) {
        case 'cpu':
            value = baseValue > 80 ? baseValue + 10 : baseValue;
            break;
        case 'memory':
            value = baseValue > 85 ? baseValue + 5 : baseValue;
            break;
        case 'disk':
            value = baseValue > 90 ? baseValue + 8 : baseValue;
            break;
        case 'network':
            value = baseValue > 75 ? baseValue + 15 : baseValue;
            break;
        default:
            value = baseValue;
    }
    
    return Math.min(100, Math.max(0, value));
}

// 상태 랜덤 선택 함수
function getRandomStatus(statuses, weights) {
    const random = Math.random();
    let sum = 0;
    
    for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (random < sum) return statuses[i];
    }
    
    return statuses[0];
}

// 서버 데이터 업데이트 함수
function updateServerData() {
    serverData = serverData.map(server => {
        const updatedServer = { ...server };
        updatedServer.metrics = {
            cpu: generateMetricValue('cpu'),
            memory: generateMetricValue('memory'),
            disk: generateMetricValue('disk'),
            network: generateMetricValue('network')
        };
        updatedServer.status = determineServerStatus(updatedServer.metrics);
        updatedServer.lastUpdate = new Date();
        return updatedServer;
    });
    
    updateDashboard();
}

// 서버 상태 결정 함수
function determineServerStatus(metrics) {
    const criticalCount = Object.values(metrics).filter(value => value > 90).length;
    const warningCount = Object.values(metrics).filter(value => value > 80 && value <= 90).length;
    
    if (criticalCount >= 2) return 'critical';
    if (warningCount >= 2 || criticalCount === 1) return 'warning';
    return 'normal';
}

// 대시보드 업데이트 함수
function updateDashboard() {
    const criticalServers = serverData.filter(server => server.status === 'critical');
    const warningServers = serverData.filter(server => server.status === 'warning');
    const normalServers = serverData.filter(server => server.status === 'normal');
    
    // 상태 요약 업데이트
    const statusSummary = document.getElementById('statusSummary');
    if (statusSummary) {
        statusSummary.innerHTML = `
            <div class="status-item critical">
                <i class="fas fa-exclamation-circle"></i>
                <div class="count">${criticalServers.length}</div>
                <div class="label">위험</div>
            </div>
            <div class="status-item warning">
                <i class="fas fa-exclamation-triangle"></i>
                <div class="count">${warningServers.length}</div>
                <div class="label">경고</div>
            </div>
            <div class="status-item normal">
                <i class="fas fa-check-circle"></i>
                <div class="count">${normalServers.length}</div>
                <div class="label">정상</div>
            </div>
        `;
    }
    
    // 서버 목록 업데이트
    const serverList = document.getElementById('serverList');
    if (serverList) {
        serverList.innerHTML = serverData.map(server => {
            const getMetricClass = (value) => {
                if (value > 90) return 'critical';
                if (value > 80) return 'warning';
                return 'normal';
            };

            return `
                <div class="server-card ${server.status}">
                    <h4>
                        ${server.name}
                        <span class="server-status">
                            <i class="fas ${getStatusIcon(server.status)}"></i>
                            ${getStatusText(server.status)}
                        </span>
                    </h4>
                    <div class="server-metrics">
                        <div class="metric ${getMetricClass(server.metrics.cpu)}">
                            <i class="fas fa-microchip"></i>
                            <span>CPU</span>
                            <span class="value">${server.metrics.cpu.toFixed(1)}%</span>
                        </div>
                        <div class="metric ${getMetricClass(server.metrics.memory)}">
                            <i class="fas fa-memory"></i>
                            <span>메모리</span>
                            <span class="value">${server.metrics.memory.toFixed(1)}%</span>
                        </div>
                        <div class="metric ${getMetricClass(server.metrics.disk)}">
                            <i class="fas fa-hdd"></i>
                            <span>디스크</span>
                            <span class="value">${server.metrics.disk.toFixed(1)}%</span>
                        </div>
                        <div class="metric ${getMetricClass(server.metrics.network)}">
                            <i class="fas fa-network-wired"></i>
                            <span>네트워크</span>
                            <span class="value">${server.metrics.network.toFixed(1)}%</span>
                        </div>
                    </div>
                    <div class="server-info">
                        <small>마지막 업데이트: ${new Date(server.lastUpdate).toLocaleTimeString()}</small>
                    </div>
                </div>
            `;
        }).join('');
    }
}

// 상태 아이콘 반환 함수
function getStatusIcon(status) {
    switch(status) {
        case 'critical': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-check-circle';
    }
}

// 상태 텍스트 반환 함수
function getStatusText(status) {
    switch(status) {
        case 'critical': return '위험';
        case 'warning': return '경고';
        default: return '정상';
    }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    // 초기 서버 데이터 생성
    serverData = generateServerData();
    
    // 10분마다 데이터 업데이트
    updateInterval = setInterval(updateServerData, 600000); // 10분 = 600000ms
    
    // 로그인 상태 확인
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        showDashboard();
    }
    
    // 초기 대시보드 업데이트
    updateDashboard();
});

// 로그인 처리
function handleLogin() {
    // 데모용 로그인 처리
    sessionStorage.setItem('isLoggedIn', 'true');
    showDashboard();
}

// 로그아웃 처리
function handleLogout() {
    sessionStorage.removeItem('isLoggedIn');
    clearInterval(updateInterval);
    showLoginSection();
}

// 대시보드 표시
function showDashboard() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    updateDashboard();
}

// 로그인 섹션 표시
function showLoginSection() {
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('loginSection').style.display = 'flex';
}

// 시나리오 변경 처리
function handleScenarioChange() {
    const select = document.getElementById('scenarioSelect');
    const scenario = select.value;
    
    if (!scenario) {
        showDefaultResponse();
        return;
    }

    currentScenario = scenario;
    showScenarioResponse(scenario);
}

// 기본 응답 표시
function showDefaultResponse() {
    const responseContent = document.getElementById('responseContent');
    responseContent.innerHTML = `
        <p><i class="fas fa-info-circle"></i> 장애 상황을 선택하면 AI 어시스턴트가 분석과 대응 방안을 제시합니다.</p>
    `;
}

// 시나리오별 응답 표시
function showScenarioResponse(scenario) {
    const responseContent = document.getElementById('responseContent');
    const responses = {
        high_cpu: {
            title: 'CPU 사용률 급증 분석',
            analysis: '현재 CPU 사용률이 95% 이상으로 급증하여 시스템 성능에 영향을 미치고 있습니다.',
            impact: '서비스 응답 시간 지연 및 사용자 경험 저하가 발생할 수 있습니다.',
            solution: '1. 불필요한 프로세스 종료\n2. CPU 사용량이 높은 프로세스 확인\n3. 필요시 서버 스케일링 검토',
            monitoring: 'CPU 사용률, 프로세스 목록, 시스템 로드 모니터링'
        },
        memory_leak: {
            title: '메모리 누수 분석',
            analysis: '메모리 사용량이 지속적으로 증가하는 패턴이 감지되었습니다.',
            impact: '시스템 안정성 저하 및 성능 저하가 발생할 수 있습니다.',
            solution: '1. 메모리 누수 발생 프로세스 식별\n2. 프로세스 재시작\n3. 메모리 사용량 모니터링 강화',
            monitoring: '메모리 사용량, 프로세스별 메모리 할당, 가비지 컬렉션 상태'
        },
        disk_full: {
            title: '디스크 공간 부족 분석',
            analysis: '디스크 사용량이 90%를 초과하여 시스템 운영에 위험이 있습니다.',
            impact: '데이터 저장 실패 및 로그 기록 중단이 발생할 수 있습니다.',
            solution: '1. 불필요한 파일 정리\n2. 로그 파일 로테이션\n3. 디스크 용량 확장 검토',
            monitoring: '디스크 사용량, 파일 시스템 상태, I/O 성능'
        },
        service_down: {
            title: '서비스 다운 분석',
            analysis: '주요 서비스가 응답하지 않는 상태입니다.',
            impact: '사용자 서비스 이용 불가 및 비즈니스 연속성 저하가 발생할 수 있습니다.',
            solution: '1. 서비스 프로세스 상태 확인\n2. 서비스 재시작\n3. 장애 원인 분석 및 재발 방지',
            monitoring: '서비스 상태, 에러 로그, 네트워크 연결 상태'
        }
    };

    const response = responses[scenario];
    responseContent.innerHTML = `
        <h4><i class="fas fa-chart-bar"></i> ${response.title}</h4>
        <p><strong>분석:</strong> ${response.analysis}</p>
        <p><strong>영향:</strong> ${response.impact}</p>
        <h4><i class="fas fa-tools"></i> 대응 방안</h4>
        <p>${response.solution}</p>
        <h4><i class="fas fa-desktop"></i> 모니터링 항목</h4>
        <p>${response.monitoring}</p>
    `;

    // 애니메이션 효과 추가
    responseContent.style.animation = 'fadeIn 0.5s ease-out';
} 