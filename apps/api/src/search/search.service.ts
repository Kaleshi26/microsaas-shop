import { Injectable } from '@nestjs/common';
import { osClient } from '../common/opensearch';

@Injectable()
export class SearchService {
  async search(q: string) {
    const res = await osClient.search({
      index: 'products',
      body: {
        query: {
          multi_match: {
            query: q,
            fields: ['name^2', 'description']
          }
        }
      }
    });
    return res.hits?.hits?.map((h: any) => ({ id: h._id, ...h._source })) || [];
  }
}