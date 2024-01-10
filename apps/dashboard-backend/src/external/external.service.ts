import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { IAdsAllowed } from './interfaces/external.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExternalService {
  private readonly baseUrl = this.configService.get<string>('EXTERNAL_URL');
  private readonly username = this.configService.get<string>('EXTERNAL_USER');
  private readonly password = this.configService.get<string>('EXTERNAL_PASS');
  readonly errorMap = {
    notAllowed: 'Ad creation not allowed',
    missingParams: 'Missing mandatory parameters',
    invalodCredentials: 'Invalid credentials',
    serverNotAvailable: 'Server is temporarily not available',
    default: 'Error occured, please try again later',
  };

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  getErrorFromResponse(response: any): string {
    const status = response?.status;
    switch (status) {
      case 400:
        return this.errorMap.missingParams;
      case 401:
        return this.errorMap.invalodCredentials;
      case 500:
        return this.errorMap.serverNotAvailable;
      default:
        return this.errorMap.default;
    }
  }
  async checkAdCreation(countryCode: string): Promise<IAdsAllowed> {
    const url = `${this.baseUrl}?countryCode=${countryCode}`;
    const headers = {
      Authorization: `Basic ${Buffer.from(
        `${this.username}:${this.password}`,
      ).toString('base64')}`,
    };

    try {
      const response = await this.httpService.get(url, { headers }).toPromise();

      if (response && response.data && response.data.ads) {
        return {
          allowed: response.data.ads === 'sure, why not!',
          error:
            response.data.ads === 'sure, why not!'
              ? null
              : this.errorMap.notAllowed,
        };
      }

      return { allowed: false, error: this.getErrorFromResponse(response) };
    } catch (error) {
      return {
        allowed: false,
        error: this.getErrorFromResponse(error.response),
      };
    }
  }
}
