import { Test } from '@nestjs/testing';
import { ExternalService } from './external.service';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { of } from 'rxjs';
import { ConfigService } from '@nestjs/config';

describe('ExternalService', () => {
  let service: ExternalService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ConfigService,
        ExternalService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ExternalService);
    httpService = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkAdCreation', () => {
    it('should be allowed with null error', async () => {
      const data = {
        ads: 'sure, why not!',
      } as { ads: string };

      const response: AxiosResponse<{
        ads: string;
      }> = {
        data,
        headers: {},
        config: {
          url: 'http://localhost:3000/mockUrl/1',
        } as InternalAxiosRequestConfig<any>,
        status: 200,
        statusText: 'OK',
      };

      jest.spyOn(httpService, 'get').mockReturnValueOnce(of(response));

      service.checkAdCreation('US').then((result) => {
        expect(result).toStrictEqual({ allowed: true, error: null });
      });
    });
  });

  it('should not be allowed with invalid country error', async () => {
    const data = {
      ads: 'you shall not pass!',
    } as { ads: string };

    const response: AxiosResponse<{
      ads: string;
    }> = {
      data,
      headers: {},
      config: {
        url: 'http://localhost:3000/mockUrl/1',
      } as InternalAxiosRequestConfig<any>,
      status: 200,
      statusText: 'OK',
    };

    jest.spyOn(httpService, 'get').mockReturnValueOnce(of(response));

    service.checkAdCreation('US').then((result) => {
      expect(result).toStrictEqual({
        allowed: false,
        error: service.errorMap.notAllowed,
      });
    });
  });

  it('should not be allowed with missing params error', async () => {
    const response: AxiosResponse<{
      ads: string;
    }> = {
      data: null,
      headers: {},
      config: {
        url: 'http://localhost:3000/mockUrl/1',
      } as InternalAxiosRequestConfig<any>,
      status: 400,
      statusText: 'OK',
    };

    jest.spyOn(httpService, 'get').mockReturnValueOnce(of(response));

    service.checkAdCreation('US').then((result) => {
      expect(result).toStrictEqual({
        allowed: false,
        error: service.errorMap.missingParams,
      });
    });
  });

  it('should not be allowed with invalid credentials error', async () => {
    const response: AxiosResponse<{
      ads: string;
    }> = {
      data: null,
      headers: {},
      config: {
        url: 'http://localhost:3000/mockUrl/1',
      } as InternalAxiosRequestConfig<any>,
      status: 401,
      statusText: 'OK',
    };

    jest.spyOn(httpService, 'get').mockReturnValueOnce(of(response));

    service.checkAdCreation('US').then((result) => {
      expect(result).toStrictEqual({
        allowed: false,
        error: service.errorMap.invalodCredentials,
      });
    });
  });

  it('should not be allowed with server not available error', async () => {
    const response: AxiosResponse<{
      ads: string;
    }> = {
      data: null,
      headers: {},
      config: {
        url: 'http://localhost:3000/mockUrl/1',
      } as InternalAxiosRequestConfig<any>,
      status: 500,
      statusText: 'OK',
    };

    jest.spyOn(httpService, 'get').mockReturnValueOnce(of(response));

    service.checkAdCreation('US').then((result) => {
      expect(result).toStrictEqual({
        allowed: false,
        error: service.errorMap.serverNotAvailable,
      });
    });
  });

  it('should not be allowed with default error', async () => {
    const response: AxiosResponse<{
      ads: string;
    }> = {
      data: null,
      headers: {},
      config: {
        url: 'http://localhost:3000/mockUrl/1',
      } as InternalAxiosRequestConfig<any>,
      status: 501,
      statusText: 'OK',
    };

    jest.spyOn(httpService, 'get').mockReturnValueOnce(of(response));

    service.checkAdCreation('US').then((result) => {
      expect(result).toStrictEqual({
        allowed: false,
        error: service.errorMap.default,
      });
    });
  });
});
