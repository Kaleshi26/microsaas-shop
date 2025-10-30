import { Injectable, Logger } from '@nestjs/common';
import { osClient } from '../common/opensearch';

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
}

export interface SearchResult {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  category?: string;
  sku?: string;
  isActive: boolean;
  createdAt: string;
  score?: number;
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  async search(query: string, filters: SearchFilters = {}): Promise<SearchResult[]> {
    try {
      const mustQueries: any[] = [];
      
      // Text search
      if (query && query.trim()) {
        mustQueries.push({
          multi_match: {
            query: query.trim(),
            fields: ['name^3', 'description^2', 'category^1'],
            type: 'best_fields',
            fuzziness: 'AUTO',
          },
        });
      } else {
        mustQueries.push({ match_all: {} });
      }

      // Filters
      if (filters.category) {
        mustQueries.push({ term: { category: filters.category } });
      }

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        const range: any = {};
        if (filters.minPrice !== undefined) range.gte = filters.minPrice;
        if (filters.maxPrice !== undefined) range.lte = filters.maxPrice;
        mustQueries.push({ range: { priceCents: range } });
      }

      if (filters.isActive !== undefined) {
        mustQueries.push({ term: { isActive: filters.isActive } });
      }

      const searchBody = {
        query: {
          bool: {
            must: mustQueries,
          },
        },
        sort: [
          { _score: { order: 'desc' } },
          { createdAt: { order: 'desc' } },
        ],
        size: 50,
      };

      const res = await osClient.search({
        index: 'products',
        body: searchBody,
      });

      const results = res.hits?.hits?.map((hit: any) => ({
        id: hit._id,
        ...hit._source,
        score: hit._score,
      })) || [];

      this.logger.log(`Search for "${query}" returned ${results.length} results`);
      return results;
    } catch (error) {
      this.logger.error(`Search failed for query "${query}"`, error);
      return [];
    }
  }

  async suggest(query: string): Promise<string[]> {
    try {
      const res = await osClient.search({
        index: 'products',
        body: {
          suggest: {
            product_suggest: {
              prefix: query,
              completion: {
                field: 'name.suggest',
                size: 5,
              },
            },
          },
        },
      });

      const suggestions = res.suggest?.product_suggest?.[0]?.options?.map(
        (option: any) => option.text
      ) || [];

      return suggestions;
    } catch (error) {
      this.logger.error(`Suggestion failed for query "${query}"`, error);
      return [];
    }
  }

  async getSearchAnalytics(): Promise<{
    totalSearches: number;
    popularQueries: Array<{ query: string; count: number }>;
    avgResponseTime: number;
  }> {
    // This would typically come from a separate analytics index
    // For now, return mock data
    return {
      totalSearches: 0,
      popularQueries: [],
      avgResponseTime: 0,
    };
  }
}