import React, { useEffect, useState } from 'react';
import { ComplianceRepository } from '../repositories/compliance.repository';
import { Licence, Certification } from '../types/compliance.types';

export const CompliancePanel: React.FC<{ driverId: string }> = ({ driverId }) => {
  const [licences, setLicences] = useState<Licence[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompliance = async () => {
      const repo = new ComplianceRepository();
      const [fetchedLicences, fetchedCerts] = await Promise.all([
        repo.getLicencesByDriver(driverId),
        repo.getCertificationsByDriver(driverId)
      ]);
      setLicences(fetchedLicences);
      setCertifications(fetchedCerts);
      setLoading(false);
    };
    fetchCompliance();
  }, [driverId]);

  if (loading) return <div className="animate-pulse h-32 bg-gray-100 rounded"></div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow mt-6">
      <div className="p-4 border-b font-semibold text-gray-700 dark:text-gray-300">
        Compliance & Documents
      </div>
      <div className="p-4 space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Licences</h4>
          {licences.length === 0 ? <p className="text-sm text-gray-400">No licences found.</p> : (
            <div className="space-y-3">
              {licences.map(licence => (
                <div key={licence.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{licence.licenceNumber}</div>
                    <div className="text-xs text-gray-500">Categories: {licence.categories.join(', ')}</div>
                    <div className="text-xs text-gray-500">Expires: {new Date(licence.expiresAt).toLocaleDateString()}</div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium 
                    ${licence.status === 'Valid' ? 'bg-green-100 text-green-800' : 
                      licence.status === 'Expired' ? 'bg-red-100 text-red-800' : 
                      'bg-orange-100 text-orange-800'}`}>
                    {licence.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Certifications</h4>
          {certifications.length === 0 ? <p className="text-sm text-gray-400">No certifications found.</p> : (
            <div className="space-y-3">
              {certifications.map(cert => (
                <div key={cert.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{cert.title}</div>
                    <div className="text-xs text-gray-500">Type: {cert.type}</div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium 
                    ${cert.status === 'Valid' ? 'bg-green-100 text-green-800' : 
                      cert.status === 'Expired' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'}`}>
                    {cert.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
