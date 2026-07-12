import { db } from '@/lib/firebase/config';
import { VehicleFilterOptions, VehicleSortOptions, SearchPaginationState } from '../../types/search.types';
import { VehicleSchemaType } from '../../schemas/vehicle.schema';

export type VehicleDocument = VehicleSchemaType & {
  id: string;
  status: string;
  fuelType?: string;
};

export class VehicleSearchService {
  private collectionName = 'vehicles';

  public async search(
    filters: VehicleFilterOptions,
    sort: VehicleSortOptions,
    pagination: SearchPaginationState
  ): Promise<{ data: VehicleDocument[]; lastDocId: string | null; hasMore: boolean }> {
    let query: any = db.collection(this.collectionName);

    // Prefix search for Registration Number or Name if searchTerm is provided
    // Note: True full-text requires Algolia. This is a basic prefix implementation.
    if (filters.searchTerm) {
      const term = filters.searchTerm.toUpperCase();
      // Using a composite range query requires specific indexes, for mock purposes we demonstrate the structure.
      query = query.where('registrationNumber', '>=', term).where('registrationNumber', '<=', term + '\uf8ff');
    }

    // Apply exact match array filters
    if (filters.status && filters.status.length > 0) {
      query = query.where('status', 'in', filters.status);
    }
    if (filters.fuelType && filters.fuelType.length > 0) {
      query = query.where('fuelType', 'in', filters.fuelType);
    }
    if (filters.manufacturer && filters.manufacturer.length > 0) {
      query = query.where('manufacturer', 'in', filters.manufacturer);
    }

    // Apply sorting
    if (sort) {
      query = query.orderBy(sort.field, sort.direction);
    } else {
      query = query.orderBy('createdAt', 'desc');
    }

    // Apply cursor pagination
    if (pagination.lastVisibleDocId) {
      // In a real implementation, you need the actual DocumentSnapshot, not just ID.
      // For this mock structure, we'll fetch the doc to use as a cursor.
      const lastDocSnap = await db.collection(this.collectionName).doc(pagination.lastVisibleDocId).get();
      if (lastDocSnap.exists) {
        query = query.startAfter(lastDocSnap);
      }
    }

    // Fetch + 1 to determine if there is a next page
    const limit = pagination.pageSize || 50;
    query = query.limit(limit + 1);

    const snapshot = await query.get();
    
    if (!snapshot || snapshot.empty) {
       return { data: [], lastDocId: null, hasMore: false };
    }

    const docs = snapshot.docs;
    const hasMore = docs.length > limit;
    
    // Slice off the extra document if it exists
    const resultsToReturn = hasMore ? docs.slice(0, limit) : docs;
    const lastDoc = resultsToReturn[resultsToReturn.length - 1];

    const data = resultsToReturn.map((doc: any) => ({ id: doc.id, ...doc.data() } as VehicleDocument));

    return {
      data,
      lastDocId: lastDoc?.id || null,
      hasMore
    };
  }
}
