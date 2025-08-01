import { useState, useRef, useEffect } from 'react';
import { Client } from '../../types';
import { Search, ChevronDown, User, Phone } from 'lucide-react';

interface ClientSelectProps {
  clients: Client[];
  selectedClient: Client | null;
  onSelectClient: (client: Client | null) => void;
}

export default function ClientSelect({ clients, selectedClient, onSelectClient }: ClientSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClientSelect = (client: Client) => {
    onSelectClient(client);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border-2 border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <div className="flex items-center space-x-3">
          {selectedClient ? (
            <>
              <div className="p-1.5 bg-blue-100 rounded-full">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <span className="font-medium text-gray-900">{selectedClient.name}</span>
            </>
          ) : (
            <>
              <div className="p-1.5 bg-gray-100 rounded-full">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <span className="text-gray-500">Select a client...</span>
            </>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white/95 backdrop-blur-md border border-gray-300 rounded-xl shadow-2xl max-h-60 overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 bg-gray-100 rounded-full">
                <Search className="h-3 w-3 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
                autoFocus
              />
            </div>
          </div>
          
          
          <div className="max-h-48 overflow-y-auto scrollbar-hide">
            {filteredClients.length === 0 ? (
              <div className="p-4 text-center text-gray-500 font-medium">
                No clients found
              </div>
            ) : (
              filteredClients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => handleClientSelect(client)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 group-hover:bg-blue-100 rounded-full transition-colors">
                      <User className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 group-hover:text-blue-700">{client.name}</div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                        <Phone className="h-3 w-3" />
                        <span>{client.phone}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
