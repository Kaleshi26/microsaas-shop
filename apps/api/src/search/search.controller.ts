import { Controller, Get, Query } from '@nestjs/common';
import { SearchService, SearchFilters } from './search.service';
import { incHttp } from '../metrics/metrics.controller';

@Controller('/search')
export class SearchController {
  constructor(private svc: SearchService) {}

  @Get()
  async search(
    @Query('q') q: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('isActive') isActive?: string,
  ) {
    const filters: SearchFilters = {
      category,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      isActive: isActive ? isActive === 'true' : undefined,
    };

    const data = await this.svc.search(q || '', filters);
    incHttp('/search', 'GET', 200);
    return data;
  }

  @Get('/suggestions')
  async suggestions(@Query('q') q: string) {
    const data = await this.svc.suggest(q || '');
    incHttp('/search/suggestions', 'GET', 200);
    return { suggestions: data };
  }

  @Get('/analytics')
  async analytics() {
    const data = await this.svc.getSearchAnalytics();
    incHttp('/search/analytics', 'GET', 200);
    return data;
  }
}