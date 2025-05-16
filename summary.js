/**
 * 서버 데이터 요약 및 보고서 생성 모듈
 * OpenManager 자연어 기반 서버 분석 데모
 */

// 자연어 쿼리에 대한 요약 생성
function generateSummaryFromQuery(query, filteredServers, allServers) {
    // 쿼리를 소문자로 변환
    const lowercaseQuery = query.toLowerCase();
    
    // 기본 요약 정보
    const summaryData = {
        query: query,
        totalServers: allServers.length,
        filteredCount: filteredServers.length,
        title: '서버 분석 결과',
        description: `총 ${allServers.length}대 중 ${filteredServers.length}대 서버가 검색되었습니다.`,
        recommendations: []
    };
    
    // CPU 관련 쿼리
    if (lowercaseQuery.includes('cpu') || lowercaseQuery.includes('씨피유')) {
        summaryData.title = 'CPU 사용량 분석';
        
        const highCpuCount = filteredServers.filter(s => s.cpu > 70).length;
        const avgCpu = (filteredServers.reduce((sum, s) => sum + s.cpu, 0) / filteredServers.length).toFixed(1);
        
        if (lowercaseQuery.includes('높') || lowercaseQuery.includes('과부하')) {
            summaryData.description = `CPU 사용량이 높은 서버 ${filteredServers.length}대를 찾았습니다. 평균 CPU 사용량: ${avgCpu}%`;
            
            if (highCpuCount > 0) {
                summaryData.recommendations.push('높은 CPU 사용량은 성능 저하의 원인이 될 수 있습니다.');
                summaryData.recommendations.push('불필요한 프로세스를 종료하거나 리소스 할당을 조정하세요.');
                summaryData.recommendations.push('지속적인 CPU 과부하가 발생하는 경우 서버 증설을 고려하세요.');
            }
        } else {
            summaryData.description = `${filteredServers.length}대 서버의 CPU 사용량 정보입니다. 평균 CPU 사용량: ${avgCpu}%`;
            
            if (avgCpu > 50) {
                summaryData.recommendations.push('전반적인 CPU 사용량이 높습니다. 리소스 최적화를 검토하세요.');
            } else {
                summaryData.recommendations.push('CPU 사용량이 적정 수준입니다.');
            }
        }
    }
    
    // 메모리 관련 쿼리
    else if (lowercaseQuery.includes('메모리') || lowercaseQuery.includes('램') || 
            lowercaseQuery.includes('memory') || lowercaseQuery.includes('ram')) {
        summaryData.title = '메모리 사용량 분석';
        
        const highMemoryCount = filteredServers.filter(s => s.memory > 80).length;
        const avgMemory = (filteredServers.reduce((sum, s) => sum + s.memory, 0) / filteredServers.length).toFixed(1);
        
        if (lowercaseQuery.includes('높') || lowercaseQuery.includes('부족')) {
            summaryData.description = `메모리 사용량이 높은 서버 ${filteredServers.length}대를 찾았습니다. 평균 메모리 사용량: ${avgMemory}%`;
            
            if (highMemoryCount > 0) {
                summaryData.recommendations.push('높은 메모리 사용량은 시스템 성능 저하와 OOM 오류를 유발할 수 있습니다.');
                summaryData.recommendations.push('메모리 누수 가능성을 확인하고 애플리케이션을 재시작하세요.');
                summaryData.recommendations.push('지속적인 문제 발생시 메모리 증설을 고려하세요.');
            }
        } else {
            summaryData.description = `${filteredServers.length}대 서버의 메모리 사용량 정보입니다. 평균 메모리 사용량: ${avgMemory}%`;
            
            if (avgMemory > 60) {
                summaryData.recommendations.push('전반적인 메모리 사용량이 높습니다. 리소스 최적화를 검토하세요.');
            } else {
                summaryData.recommendations.push('메모리 사용량이 적정 수준입니다.');
            }
        }
    }
    
    // 디스크 관련 쿼리
    else if (lowercaseQuery.includes('디스크') || lowercaseQuery.includes('저장') || 
            lowercaseQuery.includes('disk') || lowercaseQuery.includes('storage')) {
        summaryData.title = '디스크 사용량 분석';
        
        const highDiskCount = filteredServers.filter(s => s.disk > 85).length;
        const avgDisk = (filteredServers.reduce((sum, s) => sum + s.disk, 0) / filteredServers.length).toFixed(1);
        
        if (lowercaseQuery.includes('높') || lowercaseQuery.includes('부족')) {
            summaryData.description = `디스크 사용량이 높은 서버 ${filteredServers.length}대를 찾았습니다. 평균 디스크 사용량: ${avgDisk}%`;
            
            if (highDiskCount > 0) {
                summaryData.recommendations.push('높은 디스크 사용량은 시스템 안정성에 영향을 줄 수 있습니다.');
                summaryData.recommendations.push('불필요한 파일과 로그를 정리하고 디스크 정리를 수행하세요.');
                summaryData.recommendations.push('디스크 공간 확장 또는 추가 디스크 마운트를 고려하세요.');
            }
        } else {
            summaryData.description = `${filteredServers.length}대 서버의 디스크 사용량 정보입니다. 평균 디스크 사용량: ${avgDisk}%`;
            
            if (avgDisk > 70) {
                summaryData.recommendations.push('전반적인 디스크 사용량이 높습니다. 정기적인 정리가 필요합니다.');
            } else {
                summaryData.recommendations.push('디스크 사용량이 적정 수준입니다.');
            }
        }
    }
    
    // 네트워크 관련 쿼리
    else if (lowercaseQuery.includes('네트워크') || lowercaseQuery.includes('통신') || 
            lowercaseQuery.includes('network')) {
        summaryData.title = '네트워크 사용량 분석';
        
        const highNetworkCount = filteredServers.filter(s => s.network > 75).length;
        const avgNetwork = (filteredServers.reduce((sum, s) => sum + s.network, 0) / filteredServers.length).toFixed(1);
        
        if (lowercaseQuery.includes('높') || lowercaseQuery.includes('과부하')) {
            summaryData.description = `네트워크 사용량이 높은 서버 ${filteredServers.length}대를 찾았습니다. 평균 네트워크 사용량: ${avgNetwork}%`;
            
            if (highNetworkCount > 0) {
                summaryData.recommendations.push('높은 네트워크 사용량은 응답 지연의 원인이 될 수 있습니다.');
                summaryData.recommendations.push('네트워크 트래픽을 분석하여 비정상적인 접근이 있는지 확인하세요.');
                summaryData.recommendations.push('대역폭 증설 또는 트래픽 분산을 고려하세요.');
            }
        } else {
            summaryData.description = `${filteredServers.length}대 서버의 네트워크 사용량 정보입니다. 평균 네트워크 사용량: ${avgNetwork}%`;
            
            if (avgNetwork > 60) {
                summaryData.recommendations.push('전반적인 네트워크 사용량이 높습니다. 트래픽 최적화를 검토하세요.');
            } else {
                summaryData.recommendations.push('네트워크 사용량이 적정 수준입니다.');
            }
        }
    }
    
    // 상태 관련 쿼리
    else if (lowercaseQuery.includes('상태') || lowercaseQuery.includes('문제') || 
            lowercaseQuery.includes('에러') || lowercaseQuery.includes('오류')) {
        const criticalCount = filteredServers.filter(s => s.status === 'critical').length;
        const warningCount = filteredServers.filter(s => s.status === 'warning').length;
        
        if (lowercaseQuery.includes('위험') || lowercaseQuery.includes('심각')) {
            summaryData.title = '위험 상태 서버 분석';
            summaryData.description = `위험 상태인 서버 ${filteredServers.length}대를 찾았습니다.`;
            
            if (criticalCount > 0) {
                summaryData.recommendations.push('위험 상태 서버는 즉시 조치가 필요합니다.');
                summaryData.recommendations.push('서버 로그를 확인하여 정확한 문제 원인을 파악하세요.');
                summaryData.recommendations.push('필요시 서버 재시작 또는 긴급 유지보수를 진행하세요.');
            }
        } else if (lowercaseQuery.includes('경고') || lowercaseQuery.includes('주의')) {
            summaryData.title = '경고 상태 서버 분석';
            summaryData.description = `경고 상태인 서버 ${filteredServers.length}대를 찾았습니다.`;
            
            if (warningCount > 0) {
                summaryData.recommendations.push('경고 상태 서버는 주의 깊은 모니터링이 필요합니다.');
                summaryData.recommendations.push('문제가 악화되기 전에 예방적 조치를 취하세요.');
            }
        } else {
            summaryData.title = '서버 상태 분석';
            summaryData.description = `${filteredServers.length}대 서버의 상태 정보입니다. 위험: ${criticalCount}대, 경고: ${warningCount}대`;
            
            if (criticalCount > 0 || warningCount > 0) {
                summaryData.recommendations.push('문제가 있는 서버를 우선적으로 확인하세요.');
                summaryData.recommendations.push('정기적인 유지보수 일정을 수립하세요.');
            } else {
                summaryData.recommendations.push('모든 서버가 정상 상태입니다.');
            }
        }
    }
    
    // 위치 관련 쿼리
    else if (lowercaseQuery.includes('서울') || lowercaseQuery.includes('부산') || 
            lowercaseQuery.includes('대전') || lowercaseQuery.includes('제주')) {
        let location = '';
        if (lowercaseQuery.includes('서울')) location = 'Seoul';
        else if (lowercaseQuery.includes('부산')) location = 'Busan';
        else if (lowercaseQuery.includes('대전')) location = 'Daejeon';
        else if (lowercaseQuery.includes('제주')) location = 'Jeju';
        
        summaryData.title = `${location} 지역 서버 분석`;
        
        const criticalCount = filteredServers.filter(s => s.status === 'critical').length;
        const warningCount = filteredServers.filter(s => s.status === 'warning').length;
        const normalCount = filteredServers.filter(s => s.status === 'normal').length;
        
        summaryData.description = `${location} 지역의 서버 ${filteredServers.length}대를 분석했습니다. 정상: ${normalCount}대, 경고: ${warningCount}대, 위험: ${criticalCount}대`;
        
        if (criticalCount > 0) {
            summaryData.recommendations.push(`${location} 지역에 위험 상태 서버가 있습니다. 즉시 확인하세요.`);
        } else if (warningCount > 0) {
            summaryData.recommendations.push(`${location} 지역에 경고 상태 서버가 있습니다. 주의가 필요합니다.`);
        } else {
            summaryData.recommendations.push(`${location} 지역의 모든 서버가 정상 상태입니다.`);
        }
    }
    
    // 유형 관련 쿼리
    else if (lowercaseQuery.includes('웹') || lowercaseQuery.includes('데이터베이스') || 
            lowercaseQuery.includes('인증') || lowercaseQuery.includes('캐시')) {
        let type = '';
        let typeName = '';
        
        if (lowercaseQuery.includes('웹')) {
            type = 'web';
            typeName = '웹';
        } else if (lowercaseQuery.includes('데이터베이스') || lowercaseQuery.includes('db')) {
            type = 'database';
            typeName = '데이터베이스';
        } else if (lowercaseQuery.includes('인증')) {
            type = 'auth';
            typeName = '인증';
        } else if (lowercaseQuery.includes('캐시')) {
            type = 'cache';
            typeName = '캐시';
        }
        
        summaryData.title = `${typeName} 서버 분석`;
        
        const criticalCount = filteredServers.filter(s => s.status === 'critical').length;
        const warningCount = filteredServers.filter(s => s.status === 'warning').length;
        const normalCount = filteredServers.filter(s => s.status === 'normal').length;
        
        summaryData.description = `${typeName} 서버 ${filteredServers.length}대를 분석했습니다. 정상: ${normalCount}대, 경고: ${warningCount}대, 위험: ${criticalCount}대`;
        
        if (criticalCount > 0) {
            summaryData.recommendations.push(`${typeName} 서버 중 위험 상태가 있습니다. 서비스 영향도를 확인하세요.`);
        } else if (warningCount > 0) {
            summaryData.recommendations.push(`${typeName} 서버 중 경고 상태가 있습니다. 모니터링을 강화하세요.`);
        } else {
            summaryData.recommendations.push(`모든 ${typeName} 서버가 정상 작동 중입니다.`);
        }
    }
    
    // 기본 추천사항
    if (summaryData.recommendations.length === 0) {
        const criticalCount = filteredServers.filter(s => s.status === 'critical').length;
        const warningCount = filteredServers.filter(s => s.status === 'warning').length;
        
        if (criticalCount > 0) {
            summaryData.recommendations.push('위험 상태 서버를 우선적으로 확인하세요.');
        } 
        if (warningCount > 0) {
            summaryData.recommendations.push('경고 상태 서버를 정기적으로 모니터링하세요.');
        }
        if (criticalCount === 0 && warningCount === 0) {
            summaryData.recommendations.push('모든 서버가 정상 작동 중입니다. 정기적인 점검을 유지하세요.');
        }
    }
    
    return summaryData;
}

// 서버 데이터를 CSV 형식으로 변환
function convertToCSV(servers) {
    // CSV 헤더
    const csvHeader = ['ID', '이름', '위치', '유형', 'CPU(%)', '메모리(%)', '디스크(%)', '네트워크(%)', '상태'];
    
    // 상태 한글화
    const statusMap = {
        'normal': '정상',
        'warning': '경고',
        'critical': '위험'
    };
    
    // 데이터 행 생성
    const csvRows = servers.map(server => [
        server.id,
        server.name,
        server.location,
        server.type,
        server.cpu,
        server.memory,
        server.disk,
        server.network,
        statusMap[server.status] || server.status
    ]);
    
    // 헤더와 행 합치기
    const csvContent = [
        csvHeader.join(','),
        ...csvRows.map(row => row.join(','))
    ].join('\n');
    
    return csvContent;
}

// 데이터 내보내기
if (typeof module !== 'undefined') {
    module.exports = {
        generateSummaryFromQuery,
        convertToCSV
    };
} 