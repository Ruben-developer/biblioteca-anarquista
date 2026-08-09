import { describe, it, expect } from 'vitest';
import { normalizeCountryName, translateCountryName } from './countryNames';

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

describe('translateCountryName', () => {
  it('traduce nombres del mapa (inglés) a español', () => {
    expect(translateCountryName('Spain')).toBe('España');
    expect(translateCountryName('France')).toBe('Francia');
    expect(translateCountryName('Germany')).toBe('Alemania');
    expect(translateCountryName('United Kingdom')).toBe('Reino Unido');
    expect(translateCountryName('United States')).toBe('Estados Unidos');
    expect(translateCountryName('Palestine')).toBe('Palestina');
    expect(translateCountryName('Republic of Korea')).toBe('Corea del Sur');
    expect(translateCountryName('Democratic Republic of the Congo')).toBe('República Democrática del Congo');
    expect(translateCountryName('Côted\'Ivoire')).toBe('Costa de Marfil');
  });

  it('devuelve el nombre original si no está en el diccionario', () => {
    expect(translateCountryName('Atlantis')).toBe('Atlantis');
    expect(translateCountryName('')).toBe('');
    expect(translateCountryName(null)).toBeNull();
    expect(translateCountryName(undefined)).toBeUndefined();
  });
});
