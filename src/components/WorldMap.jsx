import React from 'react';
import { geoMercator, geoPath } from 'd3-geo';
import worldData from '../data/worldmap.geo.json';
import { translateCountryName } from '../utils/countryNames';

// Proyección idéntica a react-svg-worldmap: geoMercator con scale por defecto,
// mundo de 960px de ancho, trasladado para centrar el ecuador. La altura se fija
// en 720 (width * 3/4) para que el mundo completo (incluido el hemisferio sur)
// quepa en el viewBox sin recortarse.
const PROJECTION = geoMercator();
const PATH = geoPath().projection(PROJECTION);
const WORLD_WIDTH = 960;
const WORLD_HEIGHT = 720;

const GEO_FEATURES = worldData.features;

const toValue = ({ value }) => (typeof value === 'string' ? 0 : value);

const WorldMap = ({
  data,
  backgroundColor = 'transparent',
  borderColor = '#b45309',
  frame = false,
  frameColor = '#b45309',
  styleFunction,
  tooltipTextFunction,
  onClickFunction,
  containerClassName = 'worldmap__wrapper'
}) => {
  const countryValueMap = Object.fromEntries(
    data.map(({ country, value }) => [String(country).toUpperCase(), value])
  );
  const numericValues = data.map(toValue);
  const minValue = numericValues.length > 0 ? Math.min(...numericValues) : 0;
  const maxValue = numericValues.length > 0 ? Math.max(...numericValues) : 0;

  const defaultStyle = (context) => {
    const hasValue = typeof context.countryValue !== 'undefined';
    return {
      fill: hasValue ? '#dddddd' : '#eeeeee',
      stroke: borderColor,
      strokeWidth: hasValue ? 1 : 0.4,
      cursor: 'default'
    };
  };
  const styleFn = styleFunction || defaultStyle;
  const defaultTooltip = (context) => {
    const { countryNameEs, countryValue } = context;
    return typeof countryValue === 'undefined'
      ? countryNameEs
      : `${countryNameEs}: ${countryValue}`;
  };
  const tooltipFn = tooltipTextFunction || defaultTooltip;

  const paths = GEO_FEATURES.map((geoFeature) => {
    const { N: countryName, I: isoCode } = geoFeature.properties;
    const context = {
      countryCode: isoCode,
      countryValue: countryValueMap[isoCode],
      countryName,
      countryNameEs: translateCountryName(countryName),
      minValue,
      maxValue,
      prefix: '',
      suffix: ''
    };
    const style = styleFn(context);
    const tooltipContent = typeof context.countryValue === 'undefined'
      ? undefined
      : tooltipFn(context);
    const svgTitle = tooltipContent ?? context.countryNameEs;

    return (
      <path
        key={isoCode}
        d={PATH(geoFeature)}
        style={style}
        className="worldmap__country"
        onClick={onClickFunction ? (event) => onClickFunction({ ...context, event }) : undefined}
      >
        <title>{svgTitle}</title>
      </path>
    );
  });

  return (
    <div className={containerClassName} style={{ width: '100%', minHeight: 0 }}>
      <figure className="worldmap__figure-container" style={{ backgroundColor }}>
        <svg
          role="img"
          aria-label="Mapa Mundial de Textos"
          viewBox={`0 0 ${WORLD_WIDTH} ${WORLD_HEIGHT}`}
          style={{ width: '100%', height: 'auto' }}
        >
          {frame && (
            <rect
              x={0}
              y={0}
              width="100%"
              height="100%"
              stroke={frameColor}
              fill="none"
            />
          )}
          <g transform="translate(0, 240)">{paths}</g>
        </svg>
      </figure>
    </div>
  );
};

export default WorldMap;
