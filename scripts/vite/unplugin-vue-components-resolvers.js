export const VChartResolver = (componentName) => {
  if (componentName === 'VChart') {
    return {
      name: 'default',
      from: 'vue-echarts',
    }
  }
}
