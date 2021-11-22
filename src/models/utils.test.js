import { parseDomain, parseMapName, requestAPI } from './utils';

describe('parseMapName', () => {
  it('freetown.treetracker.org should return freetown', () => {
    expect(parseMapName('freetown.treetracker.org')).toBe('freetown');
  });
  it('treetracker.org should return undefined', () => {
    expect(parseMapName('treetracker.org')).toBeUndefined();
  });

  it('treetracker.org should return undefined', () => {
    expect(parseMapName('treetracker.org')).toBeUndefined();
  });

  it('test.treetracker.org should return undefined', () => {
    expect(parseMapName('test.treetracker.org')).toBeUndefined();
  });

  it('dev.treetracker.org should return undefined', () => {
    expect(parseMapName('dev.treetracker.org')).toBeUndefined();
  });

  it('localhost should return undefined', () => {
    expect(parseMapName('localhost')).toBeUndefined();
  });

  it('http://dev.treetracker.org should throw error', () => {
    expect(() => {
      parseMapName('http://dev.treetracker.org');
    }).toThrow();
  });

  it('127.17.0.225 should return undefined', () => {
    expect(parseMapName('127.17.0.225')).toBeUndefined();
  });

  it('wallet.treetracker.org should return undefined', () => {
    expect(parseMapName('wallet.treetracker.org')).toBeUndefined();
  });

  it('ready.treetracker.org should return undefined', () => {
    expect(parseMapName('ready.treetracker.org')).toBeUndefined();
  });
});

describe('parseDomain', () => {
  it('https://freetown.treetracker.org', () => {
    expect(parseDomain('https://freetown.treetracker.org')).toBe(
      'freetown.treetracker.org',
    );
  });

  it('http://freetown.treetracker.org', () => {
    expect(parseDomain('http://freetown.treetracker.org')).toBe(
      'freetown.treetracker.org',
    );
  });

  it('https://treetracker.org/', () => {
    expect(parseDomain('https://treetracker.org/')).toBe('treetracker.org');
  });

  it('https://treetracker.org', () => {
    expect(parseDomain('https://treetracker.org')).toBe('treetracker.org');
  });

  it('http://localhost:3000', () => {
    expect(parseDomain('https://localhost:3000')).toBe('localhost');
  });

  it('http://localhost', () => {
    expect(parseDomain('https://localhost')).toBe('localhost');
  });

  it('https://treetracker.org/?wallet=xxxx', () => {
    expect(parseDomain('https://treetracker.org/?wallet=xxxx')).toBe(
      'treetracker.org',
    );
  });
});

describe('requestAPI', () => {
  it('should the request failed (code 404) with a wrong URL end point.', async () => {
    try {
      await requestAPI('wrong_end_point');
    } catch (ex) {
      expect(ex.message).toBe('Request failed with status code 404');
    }
  });
});
