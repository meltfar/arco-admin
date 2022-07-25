import React from 'react';

const PrometheusSourceComponent: React.FC<{ source: Record<string, any> }> = (
  props
) => {
  return <>{props.source}</>;
};

export default PrometheusSourceComponent;
