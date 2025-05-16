/**
 * 서버 모니터링을 위한 더미 데이터 생성 모듈
 * OpenManager 자연어 기반 서버 분석 데모
 */

// 서버 위치 목록
const serverLocations = ['Seoul', 'Busan', 'Daejeon', 'Jeju'];

// 서버 유형 목록
const serverTypes = ['web', 'database', 'auth', 'cache'];

// 더미 서버 데이터 생성
function generateFixedServerData() {
    const servers = [];
    
    // 서버 데이터 생성 (30대)
    for (let i = 1; i <= 30; i++) {
        // 서버 기본 정보
        const server = {
            id: i,
            name: `SRV-${String(i).padStart(3, '0')}`,
            location: serverLocations[i % serverLocations.length],
            type: serverTypes[i % serverTypes.length],
        };
        
        // 서버 ID에 따라 다른 부하 패턴 생성
        switch (i % 5) {
            case 0: // 정상 서버 - 모든 지표 양호
                server.cpu = 20 + Math.random() * 20;
                server.memory = 30 + Math.random() * 25;
                server.disk = 40 + Math.random() * 20;
                server.network = 15 + Math.random() * 20;
                server.status = 'normal';
                break;
                
            case 1: // CPU 과부하 서버
                server.cpu = 85 + Math.random() * 15;
                server.memory = 50 + Math.random() * 20;
                server.disk = 40 + Math.random() * 30;
                server.network = 30 + Math.random() * 20;
                server.status = 'critical';
                break;
                
            case 2: // 메모리 부족 서버
                server.cpu = 50 + Math.random() * 20;
                server.memory = 90 + Math.random() * 10;
                server.disk = 50 + Math.random() * 20;
                server.network = 30 + Math.random() * 20;
                server.status = 'critical';
                break;
                
            case 3: // 디스크 공간 부족 서버
                server.cpu = 30 + Math.random() * 30;
                server.memory = 40 + Math.random() * 20;
                server.disk = 92 + Math.random() * 8;
                server.network = 25 + Math.random() * 15;
                server.status = 'warning';
                break;
                
            case 4: // 네트워크 과부하 서버
                server.cpu = 55 + Math.random() * 15;
                server.memory = 60 + Math.random() * 15;
                server.disk = 45 + Math.random() * 25;
                server.network = 80 + Math.random() * 20;
                server.status = 'warning';
                break;
        }
        
        // 숫자 반올림
        server.cpu = Math.round(server.cpu * 10) / 10;
        server.memory = Math.round(server.memory * 10) / 10;
        server.disk = Math.round(server.disk * 10) / 10;
        server.network = Math.round(server.network * 10) / 10;
        
        // 서버 추가
        servers.push(server);
    }
    
    // 서버 상태 우선 순위대로 정렬 (critical > warning > normal)
    servers.sort((a, b) => {
        const order = { 'critical': 0, 'warning': 1, 'normal': 2 };
        return order[a.status] - order[b.status];
    });
    
    return servers;
}

// 특정 서버의 모니터링 히스토리 생성
function generateServerHistory(serverId, hoursBack = 24) {
    const history = [];
    const now = new Date();
    
    // 10분 간격으로 데이터 생성 (24시간 = 144개 데이터 포인트)
    for (let i = 0; i < hoursBack * 6; i++) {
        const timestamp = new Date(now.getTime() - i * 10 * 60 * 1000);
        
        // 시간대별 변동 패턴 (일과 시간에는 부하 증가)
        const hour = timestamp.getHours();
        let loadFactor = 1.0;
        
        // 업무 시간 (9시~18시)에는 부하 증가
        if (hour >= 9 && hour < 18) {
            loadFactor = 1.5;
        }
        // 점심 시간 (12시~13시)에는 약간 감소
        if (hour >= 12 && hour < 13) {
            loadFactor = 1.2;
        }
        // 새벽 시간 (0시~6시)에는 부하 감소
        if (hour >= 0 && hour < 6) {
            loadFactor = 0.6;
        }
        
        // 기본 값에 시간대별 변동 적용
        const baseValue = 40 + Math.sin(i / 24 * Math.PI) * 15;
        const cpuValue = baseValue * loadFactor + (Math.random() * 10 - 5);
        const memoryValue = (baseValue + 10) * loadFactor + (Math.random() * 8 - 4);
        const diskValue = 50 + (i / (hoursBack * 6)) * 20 + (Math.random() * 5 - 2.5);
        const networkValue = baseValue * loadFactor * 0.8 + (Math.random() * 15 - 7.5);
        
        // 데이터 포인트 추가
        history.push({
            timestamp: timestamp.toISOString(),
            cpu: Math.max(0, Math.min(100, Math.round(cpuValue * 10) / 10)),
            memory: Math.max(0, Math.min(100, Math.round(memoryValue * 10) / 10)),
            disk: Math.max(0, Math.min(100, Math.round(diskValue * 10) / 10)),
            network: Math.max(0, Math.min(100, Math.round(networkValue * 10) / 10))
        });
    }
    
    // 시간 순서대로 정렬 (과거 -> 현재)
    return history.reverse();
}

// 데이터 내보내기
if (typeof module !== 'undefined') {
    module.exports = {
        generateFixedServerData,
        generateServerHistory
    };
} 