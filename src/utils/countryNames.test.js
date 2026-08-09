import { describe, it, expect } from 'vitest';
import { normalizeCountryName } from './countryNames';

describe('normalizeCountryName', () => {
  it('traduce nombres del mapa (inglés) a claves de región (español)', () => {
    expect(normalizeCountryName('Spain')).toBe('España');
    expect(normalizeCountryName('France')).toBe('Francia');
    expect(normalizeCountryName('United States')).toBe('Estados Unidos');
    expect(normalizeCountryName('United States of America')).toBe('Estados Unidos');
    expect(normalizeCountryName('Russia')).toBe('Rusia');
    expect(normalizeCountryName('Italy')).toBe('Italia');
    expect(normalizeCountryName('Mexico')).toBe('México');
    expect(normalizeCountryName('Argentina')).toBe('Argentina');
    expect(normalizeCountryName('Chile')).toBe('Chile');
    expect(normalizeCountryName('Germany')).toBe('Alemania');
    expect(normalizeCountryName('United Kingdom')).toBe('Inglaterra');
    expect(normalizeCountryName('Republic of Korea')).toBe('Corea');
    expect(normalizeCountryName('South Korea')).toBe('Corea');
  });

  it('es insensible a mayúsculas y espacios', () => {
    expect(normalizeCountryName('  spain ')).toBe('España');
    expect(normalizeCountryName('FRANCE')).toBe('Francia');
  });

  it('devuelve null para países sin textos en el archivo', () => {
    expect(normalizeCountryName('Brazil')).toBeNull();
    expect(normalizeCountryName('Japan')).toBeNull();
    expect(normalizeCountryName('')).toBeNull();
    expect(normalizeCountryName(null)).toBeNull();
    expect(normalizeCountryName(undefined)).toBeNull();
  });
});
