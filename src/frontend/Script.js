// Função para criar o tooltip
function createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    Object.assign(tooltip.style, {
        position: 'absolute',
        pointerEvents: 'none',
        display: 'none',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '5px',
        borderRadius: '4px',
        zIndex: '1000',
    });
    document.body.appendChild(tooltip);
    return tooltip;
}

// Função para exibir o último valor
function displayLastValue(containerId, values, unit) {
    if (!values || values.length === 0) return;

    const lastValue = values[values.length - 1];
    const container = document.querySelector(containerId)?.parentNode;

    if (!container) return;

    let valueDisplay = container.querySelector('.last-value');
    if (!valueDisplay) {
        valueDisplay = document.createElement('p');
        valueDisplay.className = 'last-value';
        container.appendChild(valueDisplay);
    }
    valueDisplay.innerText = `Último Valor: ${lastValue} ${unit}`;
}

// Função para exibir o título
function displayTitle(containerId, title) {
    const container = document.querySelector(containerId)?.parentNode;
    if (!container) return;

    if (!container.querySelector('h3')) {
        const titleElement = document.createElement('h3');
        titleElement.innerText = title;
        container.insertBefore(titleElement, container.firstChild);
    }
}

// Função para desenhar o gráfico
function drawLineChart(containerId, title, seriesData, unit) {
    const container = document.querySelector(containerId);
    if (!container) return;

    if (!seriesData || seriesData.length === 0) {
        container.innerHTML = `<p>Sem dados para exibir.</p>`;
        return;
    }

    const labels = seriesData.map(point => new Date(point.x * 1000).toLocaleDateString('pt-BR'));
    const values = seriesData.map(point => point.y);

    const chart = new Chartist.Line(containerId, {
        labels: labels,
        series: [values]
    }, {
        high: Math.max(...values) + 5,
        low: Math.min(...values) - 5,
        showArea: true,
        fullWidth: true,
        axisY: { labelInterpolationFnc: value => `${value} ${unit}` },
        axisX: { showLabel: false, showGrid: false },
    });

    displayLastValue(containerId, values, unit);
    displayTitle(containerId, title);

    const tooltip = createTooltip();
    const chartElement = document.querySelector(containerId);

    chartElement.addEventListener('mousemove', (event) => {
        const pointIndex = Math.floor((event.offsetX / chartElement.offsetWidth) * seriesData.length);
        if (pointIndex >= 0 && pointIndex < seriesData.length) {
            const point = seriesData[pointIndex];
            tooltip.innerText = `Valor: ${point.y} ${unit}\nData: ${point.time}`;
            Object.assign(tooltip.style, {
                left: `${event.pageX + 10}px`,
                top: `${event.pageY + 10}px`,
                display: 'block',
            });
        }
    });

    chartElement.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
}

// Função para buscar e filtrar dados do dia atual
async function fetchData() {
    try {
        const response = await fetch('/api/telemetria');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        const today = new Date();
        const startOfDay = new Date(today.toISOString().split('T')[0] + 'T00:00:00Z');
        const endOfDay = new Date(today.toISOString().split('T')[0] + 'T23:59:59Z');

        const filteredData = data.filter(item => {
            const date = new Date(item.data);
            return date >= startOfDay && date <= endOfDay;
        });

        const getDataBySensorId = (sensorId, key) => filteredData
            .filter(item => item.sensor_id === sensorId)
            .map(item => ({
                x: new Date(item.data).getTime() / 1000,
                y: item[key],
                time: `${new Date(item.data).toLocaleDateString('pt-BR')} ${item.horario}`,
            }));

        drawChartsForAllSensors(getDataBySensorId);
    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
        document.querySelector('.graphs-area').innerHTML = `<p>Erro ao carregar os dados: ${error.message}</p>`;
    }
}

// Função para desenhar gráficos para todos os sensores
function drawChartsForAllSensors(getDataBySensorId) {
    const sensorMappings = [
        { container: '#graficoAmbienteTemp', title: 'Temperatura', sensor: '7', key: 'temperatura', unit: '°C' },
        { container: '#graficoAmbienteUmid', title: 'Umidade', sensor: '7', key: 'umidade', unit: '%' },
        { container: '#graficoAmbientePressao', title: 'Pressão', sensor: '7', key: 'pressao', unit: 'hPa' },

        { container: '#graficoCaixa9Temp', title: 'Temperatura', sensor: '4', key: 'temperatura', unit: '°C' },
        { container: '#graficoCaixa9Umid', title: 'Umidade', sensor: '4', key: 'umidade', unit: '%' },
        { container: '#graficoCaixa9Pressao', title: 'Pressão', sensor: '4', key: 'pressao', unit: 'hPa' },

        { container: '#graficoCaixa10Temp', title: 'Temperatura', sensor: '5', key: 'temperatura', unit: '°C' },
        { container: '#graficoCaixa10Umid', title: 'Umidade', sensor: '5', key: 'umidade', unit: '%' },
        { container: '#graficoCaixa10Pressao', title: 'Pressão', sensor: '5', key: 'pressao', unit: 'hPa' },

        { container: '#graficoCaixa12Temp', title: 'Temperatura', sensor: '6', key: 'temperatura', unit: '°C' },
        { container: '#graficoCaixa12Umid', title: 'Umidade', sensor: '6', key: 'umidade', unit: '%' },
        { container: '#graficoCaixa12Pressao', title: 'Pressão', sensor: '6', key: 'pressao', unit: 'hPa' },
    ];

    sensorMappings.forEach(mapping => {
        const data = getDataBySensorId(mapping.sensor, mapping.key);
        drawLineChart(mapping.container, mapping.title, data, mapping.unit);
    });
}

// Configuração inicial
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});