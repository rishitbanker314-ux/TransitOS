import { Transaction, doc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export class AuditService {
  logTransaction(transaction: Transaction, params: {
    entityId: string;
    entityType: string;
    action: string;
    oldData?: any;
    newData?: any;
    userId: string;
  }) {
    const auditRef = doc(collection(db, 'audit_logs'));
    transaction.set(auditRef, {
      ...params,
      timestamp: new Date().toISOString(),
    });
  }
}
