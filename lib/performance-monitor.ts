// Performance monitoring utility for measuring page load times and API response times
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  
  // Measure page load time
  measurePageLoad(pageName: string, startTime: number) {
    const loadTime = performance.now() - startTime;
    this.recordMetric(`page_load_${pageName}`, loadTime);
    console.log(`[PERFORMANCE] ${pageName} loaded in ${loadTime.toFixed(2)}ms`);
  }
  
  // Measure API response time
  measureAPIResponse(endpoint: string, startTime: number) {
    const responseTime = performance.now() - startTime;
    this.recordMetric(`api_response_${endpoint}`, responseTime);
    console.log(`[PERFORMANCE] ${endpoint} responded in ${responseTime.toFixed(2)}ms`);
  }
  
  // Record a metric
  private recordMetric(metricName: string, value: number) {
    if (!this.metrics.has(metricName)) {
      this.metrics.set(metricName, []);
    }
    this.metrics.get(metricName)?.push(value);
  }
  
  // Get average metric value
  getAverage(metricName: string): number | null {
    const values = this.metrics.get(metricName);
    if (!values || values.length === 0) return null;
    
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }
  
  // Get all metrics
  getAllMetrics(): Record<string, { average: number | null; count: number }> {
    const result: Record<string, { average: number | null; count: number }> = {};
    
    for (const [metricName, values] of this.metrics.entries()) {
      const sum = values.reduce((acc, val) => acc + val, 0);
      result[metricName] = {
        average: values.length > 0 ? sum / values.length : null,
        count: values.length
      };
    }
    
    return result;
  }
  
  // Clear metrics
  clearMetrics() {
    this.metrics.clear();
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();