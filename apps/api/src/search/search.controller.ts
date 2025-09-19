// apps/api/src/search/search.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { incHttp } from '../metrics/metrics.controller';

@Controller('/search')
export class SearchController {
  constructor(private svc: SearchService) {}
  @Get()
  async search(@Query('q') q: string) {
    const data = await this.svc.search(q || '');
    incHttp('/search', 'GET', 200);
    return data;
  }
}