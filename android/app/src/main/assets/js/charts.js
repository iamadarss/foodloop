/**
 * FoodLoop — Food Waste Reduction System
 * Lightweight SVG Charts & Data Visualization (Zero External Dependencies)
 * Category Donut Chart & Trend Chart
 */

const FoodLoopCharts = {
  // Render Area / Trend Chart for Food Rescued Over the Past 6 Months
  renderTrendChart(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const data = [
      { month: 'May', kg: 45 },
      { month: 'Jun', kg: 68 },
      { month: 'Jul', kg: 92 },
      { month: 'Aug', kg: 118 },
      { month: 'Sep', kg: 135 },
      { month: 'Oct', kg: 165 }
    ];

    const stats = window.FoodLoopData ? window.FoodLoopData.getStats() : { totalRescuedKg: 165 };
    data[data.length - 1].kg = Math.max(150, Math.round(stats.totalRescuedKg));

    const width = 580;
    const height = 240;
    const padding = { top: 25, right: 30, bottom: 40, left: 45 };

    const maxVal = Math.max(...data.map(d => d.kg)) * 1.15;
    const minVal = 0;

    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const getX = (idx) => padding.left + (idx / (data.length - 1)) * chartW;
    const getY = (val) => padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

    let pathD = `M ${getX(0)} ${getY(data[0].kg)}`;
    let areaD = `M ${getX(0)} ${getY(data[0].kg)}`;

    for (let i = 1; i < data.length; i++) {
      const prevX = getX(i - 1);
      const prevY = getY(data[i - 1].kg);
      const curX = getX(i);
      const curY = getY(data[i].kg);
      const cpX1 = prevX + (curX - prevX) / 2;
      const cpY1 = prevY;
      const cpX2 = prevX + (curX - prevX) / 2;
      const cpY2 = curY;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curX} ${curY}`;
      areaD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curX} ${curY}`;
    }

    const baselineY = padding.top + chartH;
    areaD += ` L ${getX(data.length - 1)} ${baselineY} L ${getX(0)} ${baselineY} Z`;

    let pointsHtml = '';
    let xLabelsHtml = '';
    data.forEach((d, idx) => {
      const px = getX(idx);
      const py = getY(d.kg);
      pointsHtml += `
        <g class="chart-point-group" tabindex="0">
          <circle cx="${px}" cy="${py}" r="5.5" fill="#10B981" stroke="#ffffff" stroke-width="2.5" class="chart-dot"/>
          <text x="${px}" y="${py - 10}" text-anchor="middle" font-size="11" font-weight="800" fill="#0A1931">${d.kg} kg</text>
        </g>
      `;
      xLabelsHtml += `
        <text x="${px}" y="${baselineY + 22}" text-anchor="middle" font-size="12" fill="#64748B" font-weight="600">${d.month}</text>
      `;
    });

    let gridHtml = '';
    const ticks = 4;
    for (let i = 0; i <= ticks; i++) {
      const tickVal = Math.round((maxVal / ticks) * i);
      const gy = getY(tickVal);
      gridHtml += `
        <line x1="${padding.left}" y1="${gy}" x2="${width - padding.right}" y2="${gy}" stroke="#E2E8F0" stroke-dasharray="3 3"/>
        <text x="${padding.left - 10}" y="${gy + 4}" text-anchor="end" font-size="11" fill="#94A3B8">${tickVal}</text>
      `;
    }

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" class="impact-svg-chart" style="width: 100%; height: auto; display: block;" role="img" aria-label="Monthly Food Rescued Growth Trend">
        <defs>
          <linearGradient id="areaGradientModern" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#10B981" stop-opacity="0.28"/>
            <stop offset="100%" stop-color="#10B981" stop-opacity="0.01"/>
          </linearGradient>
          <linearGradient id="strokeGradientModern" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#059669"/>
            <stop offset="100%" stop-color="#10B981"/>
          </linearGradient>
        </defs>
        ${gridHtml}
        <path d="${areaD}" fill="url(#areaGradientModern)" />
        <path d="${pathD}" fill="none" stroke="url(#strokeGradientModern)" stroke-width="3" stroke-linecap="round"/>
        ${pointsHtml}
        ${xLabelsHtml}
      </svg>
    `;
  },

  // Render Category Distribution Donut Chart with Pure Vanilla Layout
  renderCategoryDonut(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const donations = window.FoodLoopData ? window.FoodLoopData.getDonations() : [];
    
    const catMap = {
      'Bakery': { count: 0, weight: 0, color: '#F59E0B' }, // Warm Amber
      'Produce': { count: 0, weight: 0, color: '#10B981' }, // Fresh Green
      'Prepared Meals': { count: 0, weight: 0, color: '#3B82F6' }, // Blue
      'Dairy & Groceries': { count: 0, weight: 0, color: '#8B5CF6' } // Purple
    };

    donations.forEach(d => {
      const cat = catMap[d.category] ? d.category : 'Prepared Meals';
      catMap[cat].count += 1;
      catMap[cat].weight += Number(d.weightKg) || 1;
    });

    const categories = Object.keys(catMap).map(k => ({
      name: k,
      weight: Math.round(catMap[k].weight),
      count: catMap[k].count,
      color: catMap[k].color
    })).filter(c => c.weight > 0);

    const totalWeight = categories.reduce((sum, c) => sum + c.weight, 0) || 100;

    const size = 240;
    const radius = 86;
    const strokeWidth = 28;
    const circumference = 2 * Math.PI * radius;
    let accumulatedOffset = 0;

    let circlesHtml = '';
    categories.forEach((cat) => {
      const ratio = cat.weight / totalWeight;
      const strokeDash = ratio * circumference;
      const offset = accumulatedOffset;
      accumulatedOffset += strokeDash;

      circlesHtml += `
        <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" 
          fill="transparent" 
          stroke="${cat.color}" 
          stroke-width="${strokeWidth}" 
          stroke-dasharray="${strokeDash} ${circumference}" 
          stroke-dashoffset="${-offset}"
          class="donut-segment"
          transform="rotate(-90 ${size / 2} ${size / 2})"
        >
          <title>${cat.name}: ${cat.weight} kg (${Math.round(ratio * 100)}%)</title>
        </circle>
      `;
    });

    let legendHtml = '<div class="chart-legend-grid">';
    categories.forEach(cat => {
      const pct = Math.round((cat.weight / totalWeight) * 100);
      legendHtml += `
        <div class="legend-item">
          <span class="legend-color-dot" style="background-color: ${cat.color};"></span>
          <span class="legend-label">${cat.name}</span>
          <span class="legend-val font-bold">${cat.weight} kg (${pct}%)</span>
        </div>
      `;
    });
    legendHtml += '</div>';

    container.innerHTML = `
      <div class="donut-chart-wrapper">
        <div class="donut-svg-box">
          <svg viewBox="0 0 ${size} ${size}" class="donut-svg">
            <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="transparent" stroke="#F1F5F9" stroke-width="${strokeWidth}" />
            ${circlesHtml}
          </svg>
          <div class="donut-center-stat">
            <span class="donut-weight">${totalWeight} kg</span>
            <span class="donut-label">Total Rescued</span>
          </div>
        </div>
        <div class="donut-legend-container">
          ${legendHtml}
        </div>
      </div>
    `;
  },

  // Refresh all charts
  refresh() {
    this.renderTrendChart('trendChartContainer');
    this.renderCategoryDonut('categoryDonutContainer');
  }
};

window.FoodLoopCharts = FoodLoopCharts;
