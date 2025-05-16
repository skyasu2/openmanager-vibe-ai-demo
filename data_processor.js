/**
 * 서버 데이터 처리 및 필터링을 위한 모듈
 * OpenManager 자연어 기반 서버 분석 데모
 */

// 서버 데이터 필터링 함수
function filterServersByQuery(servers, query) {
    // 쿼리를 소문자로 변환하여 검색
    const lowercaseQuery = query.toLowerCase();
    
    // CPU 관련 쿼리 처리
    if (lowercaseQuery.includes('cpu') || lowercaseQuery.includes('씨피유')) {
        if (lowercaseQuery.includes('높') || lowercaseQuery.includes('과부하') || 
            lowercaseQuery.includes('문제') || lowercaseQuery.includes('많이')) {
            return servers.filter(server => server.cpu > 70);
        } else if (lowercaseQuery.includes('낮') || lowercaseQuery.includes('여유')) {
            return servers.filter(server => server.cpu < 30);
        } else {
            // 기본 CPU 정렬
            return [...servers].sort((a, b) => b.cpu - a.cpu);
        }
    }
    
    // 메모리 관련 쿼리 처리
    if (lowercaseQuery.includes('메모리') || lowercaseQuery.includes('램') || 
        lowercaseQuery.includes('memory') || lowercaseQuery.includes('ram')) {
        if (lowercaseQuery.includes('높') || lowercaseQuery.includes('부족') || 
            lowercaseQuery.includes('문제') || lowercaseQuery.includes('많이')) {
            return servers.filter(server => server.memory > 80);
        } else if (lowercaseQuery.includes('낮') || lowercaseQuery.includes('여유')) {
            return servers.filter(server => server.memory < 40);
        } else {
            // 기본 메모리 정렬
            return [...servers].sort((a, b) => b.memory - a.memory);
        }
    }
    
    // 디스크 관련 쿼리 처리
    if (lowercaseQuery.includes('디스크') || lowercaseQuery.includes('저장') || 
        lowercaseQuery.includes('disk') || lowercaseQuery.includes('storage')) {
        if (lowercaseQuery.includes('높') || lowercaseQuery.includes('부족') || 
            lowercaseQuery.includes('문제') || lowercaseQuery.includes('많이')) {
            return servers.filter(server => server.disk > 85);
        } else if (lowercaseQuery.includes('낮') || lowercaseQuery.includes('여유')) {
            return servers.filter(server => server.disk < 50);
        } else {
            // 기본 디스크 정렬
            return [...servers].sort((a, b) => b.disk - a.disk);
        }
    }
    
    // 네트워크 관련 쿼리 처리
    if (lowercaseQuery.includes('네트워크') || lowercaseQuery.includes('통신') || 
        lowercaseQuery.includes('network')) {
        if (lowercaseQuery.includes('높') || lowercaseQuery.includes('과부하') || 
            lowercaseQuery.includes('문제') || lowercaseQuery.includes('많이')) {
            return servers.filter(server => server.network > 75);
        } else if (lowercaseQuery.includes('낮') || lowercaseQuery.includes('여유')) {
            return servers.filter(server => server.network < 25);
        } else {
            // 기본 네트워크 정렬
            return [...servers].sort((a, b) => b.network - a.network);
        }
    }
    
    // 상태 관련 쿼리 처리
    if (lowercaseQuery.includes('상태') || lowercaseQuery.includes('문제') || 
        lowercaseQuery.includes('에러') || lowercaseQuery.includes('오류')) {
        if (lowercaseQuery.includes('위험') || lowercaseQuery.includes('심각') || 
            lowercaseQuery.includes('에러') || lowercaseQuery.includes('오류')) {
            return servers.filter(server => server.status === 'critical');
        } else if (lowercaseQuery.includes('경고') || lowercaseQuery.includes('주의')) {
            return servers.filter(server => server.status === 'warning');
        } else if (lowercaseQuery.includes('정상') || lowercaseQuery.includes('좋은')) {
            return servers.filter(server => server.status === 'normal');
        } else {
            // 상태 우선순위: critical > warning > normal
            return [...servers].sort((a, b) => {
                const order = { 'critical': 0, 'warning': 1, 'normal': 2 };
                return order[a.status] - order[b.status];
            });
        }
    }
    
    // 위치 관련 쿼리 처리
    if (lowercaseQuery.includes('서울') || lowercaseQuery.includes('seoul')) {
        return servers.filter(server => server.location === 'Seoul');
    } else if (lowercaseQuery.includes('부산') || lowercaseQuery.includes('busan')) {
        return servers.filter(server => server.location === 'Busan');
    } else if (lowercaseQuery.includes('대전') || lowercaseQuery.includes('daejeon')) {
        return servers.filter(server => server.location === 'Daejeon');
    } else if (lowercaseQuery.includes('제주') || lowercaseQuery.includes('jeju')) {
        return servers.filter(server => server.location === 'Jeju');
    }
    
    // 유형 관련 쿼리 처리
    if (lowercaseQuery.includes('웹') || lowercaseQuery.includes('web')) {
        return servers.filter(server => server.type === 'web');
    } else if (lowercaseQuery.includes('데이터베이스') || lowercaseQuery.includes('db')) {
        return servers.filter(server => server.type === 'database');
    } else if (lowercaseQuery.includes('인증') || lowercaseQuery.includes('auth')) {
        return servers.filter(server => server.type === 'auth');
    } else if (lowercaseQuery.includes('캐시') || lowercaseQuery.includes('cache')) {
        return servers.filter(server => server.type === 'cache');
    }
    
    // 이름으로 검색
    if (lowercaseQuery.includes('이름') || lowercaseQuery.includes('name')) {
        const nameQuery = lowercaseQuery.replace(/이름|name/g, '').trim();
        if (nameQuery) {
            return servers.filter(server => 
                server.name.toLowerCase().includes(nameQuery));
        }
    }
    
    // 기본 결과: 상태 기준 정렬
    return [...servers].sort((a, b) => {
        const order = { 'critical': 0, 'warning': 1, 'normal': 2 };
        return order[a.status] - order[b.status];
    });
}

// 서버 상태 분석 함수
function analyzeServerStatus(servers) {
    const total = servers.length;
    const critical = servers.filter(s => s.status === 'critical').length;
    const warning = servers.filter(s => s.status === 'warning').length;
    const normal = servers.filter(s => s.status === 'normal').length;
    
    const criticalPercent = (critical / total * 100).toFixed(1);
    const warningPercent = (warning / total * 100).toFixed(1);
    const normalPercent = (normal / total * 100).toFixed(1);
    
    const avgCpu = (servers.reduce((sum, s) => sum + s.cpu, 0) / total).toFixed(1);
    const avgMemory = (servers.reduce((sum, s) => sum + s.memory, 0) / total).toFixed(1);
    const avgDisk = (servers.reduce((sum, s) => sum + s.disk, 0) / total).toFixed(1);
    const avgNetwork = (servers.reduce((sum, s) => sum + s.network, 0) / total).toFixed(1);
    
    return {
        total,
        critical,
        warning,
        normal,
        criticalPercent,
        warningPercent,
        normalPercent,
        avgCpu,
        avgMemory,
        avgDisk,
        avgNetwork
    };
}

// 문제 서버 분석 함수
function analyzeProblemServers(servers) {
    const problemServers = servers.filter(s => s.status === 'critical' || s.status === 'warning');
    
    // 주요 문제 유형 분석
    const highCpu = problemServers.filter(s => s.cpu > 70).length;
    const highMemory = problemServers.filter(s => s.memory > 80).length;
    const highDisk = problemServers.filter(s => s.disk > 85).length;
    const highNetwork = problemServers.filter(s => s.network > 75).length;
    
    // 주요 문제 유형 결정
    let mainProblem = 'unknown';
    let mainProblemCount = 0;
    
    if (highCpu > mainProblemCount) {
        mainProblem = 'CPU 과부하';
        mainProblemCount = highCpu;
    }
    if (highMemory > mainProblemCount) {
        mainProblem = '메모리 부족';
        mainProblemCount = highMemory;
    }
    if (highDisk > mainProblemCount) {
        mainProblem = '디스크 공간 부족';
        mainProblemCount = highDisk;
    }
    if (highNetwork > mainProblemCount) {
        mainProblem = '네트워크 과부하';
        mainProblemCount = highNetwork;
    }
    
    return {
        total: problemServers.length,
        mainProblem,
        highCpu,
        highMemory,
        highDisk,
        highNetwork
    };
}

// 위치별 서버 분석 함수
function analyzeServersByLocation(servers) {
    const locations = {};
    
    servers.forEach(server => {
        if (!locations[server.location]) {
            locations[server.location] = {
                total: 0,
                critical: 0,
                warning: 0,
                normal: 0
            };
        }
        
        locations[server.location].total++;
        locations[server.location][server.status]++;
    });
    
    return locations;
}

// 유형별 서버 분석 함수
function analyzeServersByType(servers) {
    const types = {};
    
    servers.forEach(server => {
        if (!types[server.type]) {
            types[server.type] = {
                total: 0,
                critical: 0,
                warning: 0,
                normal: 0
            };
        }
        
        types[server.type].total++;
        types[server.type][server.status]++;
    });
    
    return types;
}

// 데이터 내보내기
if (typeof module !== 'undefined') {
    module.exports = {
        filterServersByQuery,
        analyzeServerStatus,
        analyzeProblemServers,
        analyzeServersByLocation,
        analyzeServersByType
    };
} 