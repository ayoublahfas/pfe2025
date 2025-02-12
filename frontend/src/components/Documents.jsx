import React from 'react';
import { FileText, Download } from 'lucide-react';

const Documents = () => {
  const documents = [
    { id: 1, name: 'Fiche de paie Janvier 2024', type: 'PDF' },
    { id: 2, name: 'Contrat de travail', type: 'PDF' },
    // ... autres documents
  ];

  return (
    <div className="p-6">
      <div className="bg-white/10 rounded-lg backdrop-blur-sm">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Mes Documents</h2>
          <div className="space-y-4">
            {documents.map(doc => (
              <div key={doc.id} 
                   className="flex items-center justify-between p-4 
                            hover:bg-white/5 rounded-lg transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <FileText className="text-indigo-500" />
                  <span>{doc.name}</span>
                </div>
                <button className="p-2 hover:bg-indigo-500/10 rounded-full transition-all">
                  <Download size={20} className="text-indigo-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents; 