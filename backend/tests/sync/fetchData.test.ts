import { fetchData, EnergyApiResponse, FetchFunction } from '../../src/sync/fetchData';
import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';

jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});

describe('fetchData', () => {
  const mockFetch = jest.fn() as jest.MockedFunction<FetchFunction>;
  
  const mockWait: jest.MockedFunction<(ms: number) => Promise<void>> = jest.fn((ms: number) => Promise.resolve());
  
  const originalEnv = process.env;
  
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.REE_URI = 'https://api.example.com/{start}/{end}';
  });
  
  afterAll(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it('should fetch data successfully on first attempt', async () => {

    const mockResponse: EnergyApiResponse = {
      included: [{ id: '1', type: 'test' }]
    };
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockResponse
    } as any);
    
    const startDate = new Date('2023-01-01T00:00:00Z');
    const endDate = new Date('2023-01-02T00:00:00Z');
    
    const result = await fetchData(startDate, endDate, {
      fetchFn: mockFetch,
      waitFn: mockWait,
      reeUri: process.env.REE_URI
    });
    
    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/2023-01-01T00:00/2023-01-02T00:00');
    expect(mockWait).not.toHaveBeenCalled();
  });

  it('should retry on failed attempts and eventually succeed', async () => {

    const mockResponse: EnergyApiResponse = {
      included: [{ id: '2', type: 'retry' }]
    };
    
    mockFetch
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Server error'))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      } as any);
    
    const startDate = new Date('2023-02-01T00:00:00Z');
    const endDate = new Date('2023-02-02T00:00:00Z');
    
    const result = await fetchData(startDate, endDate, {
      fetchFn: mockFetch,
      waitFn: mockWait,
      reeUri: process.env.REE_URI
    });
    
    expect(result).toEqual(mockResponse);
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(mockWait).toHaveBeenCalledTimes(2);
    expect(console.warn).toHaveBeenCalledTimes(2);
  });

  it('should throw an error after max attempts', async () => {

    mockFetch
      .mockRejectedValueOnce(new Error('Failure 1'))
      .mockRejectedValueOnce(new Error('Failure 2'))
      .mockRejectedValueOnce(new Error('Failure 3'))
      .mockRejectedValueOnce(new Error('Failure 4'));
    
    const startDate = new Date('2023-03-01T00:00:00Z');
    const endDate = new Date('2023-03-02T00:00:00Z');
    
    await expect(fetchData(startDate, endDate, {
      fetchFn: mockFetch,
      waitFn: mockWait,
      reeUri: process.env.REE_URI
    })).rejects.toThrow('Failed to fetch data after multiple attempts');
    
    expect(mockFetch).toHaveBeenCalledTimes(4);
    expect(mockWait).toHaveBeenCalledTimes(3);
  });

  it('should throw an error when response is not ok', async () => {

    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    } as any);
    
    const startDate = new Date('2023-04-01T00:00:00Z');
    const endDate = new Date('2023-04-02T00:00:00Z');
    
    await expect(fetchData(startDate, endDate, {
      fetchFn: mockFetch,
      waitFn: mockWait,
      reeUri: process.env.REE_URI
    })).rejects.toThrow();
    
    expect(mockWait).toHaveBeenCalled();
  });

  it('should handle missing REE_URI environment variable', async () => {

    delete process.env.REE_URI;
    
    mockFetch.mockRejectedValueOnce(new Error('Invalid URL'));
    
    const startDate = new Date('2023-05-01T00:00:00Z');
    const endDate = new Date('2023-05-02T00:00:00Z');
    
    await expect(fetchData(startDate, endDate, {
      fetchFn: mockFetch,
      waitFn: mockWait,
      reeUri: process.env.REE_URI
    })).rejects.toThrow();
    
    expect(mockFetch).toHaveBeenCalledWith('');
  });
});