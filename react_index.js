import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Globe, Check } from 'lucide-react';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  // Fetch country data on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,cca2');
        const data = await response.json();
        
        // Sort alphabetically
        const sorted = data.sort((a, b) => 
          a.name.common.localeCompare(b.name.common)
        );
        
        setCountries(sorted);
        setFilteredCountries(sorted);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Filter countries based on search
  useEffect(() => {
    const results = countries.filter(c => 
      c.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountries(results);
  }, [searchTerm, countries]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">Select Your Country</h1>
        
        {/* Main Selector UI */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between p-4 bg-white border-2 rounded-xl transition-all duration-200 shadow-sm
              ${isOpen ? 'border-blue-500 ring-4 ring-blue-50' : 'border-slate-200 hover:border-slate-300'}`}
          >
            <div className="flex items-center gap-3">
              {selectedCountry ? (
                <>
                  <img 
                    src={selectedCountry.flags.svg} 
                    alt="flag" 
                    className="w-8 h-5 object-cover rounded shadow-sm"
                  />
                  <span className="font-medium text-slate-700">{selectedCountry.name.common}</span>
                </>
              ) : (
                <>
                  <div className="w-8 h-5 bg-slate-100 rounded flex items-center justify-center">
                    <Globe size={14} className="text-slate-400" />
                  </div>
                  <span className="text-slate-400">Choose a country...</span>
                </>
              )}
            </div>
            <ChevronDown 
              className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              size={20} 
            />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-150">
              {/* Search Box */}
              <div className="p-3 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
                <Search size={16} className="text-slate-400 ml-2" />
                <input
                  type="text"
                  placeholder="Search countries..."
                  className="w-full bg-transparent border-none outline-none text-sm p-1 text-slate-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>

              {/* List */}
              <div className="max-h-64 overflow-y-auto custom-scrollbar">
                {loading ? (
                  <div className="p-8 text-center text-slate-400 text-sm">Loading list...</div>
                ) : filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.cca2}
                      onClick={() => handleSelect(country)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-blue-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={country.flags.svg} 
                          alt="" 
                          className="w-6 h-4 object-cover rounded-sm shadow-xs"
                        />
                        <span className="text-sm font-medium text-slate-600 group-hover:text-blue-700">
                          {country.name.common}
                        </span>
                      </div>
                      {selectedCountry?.cca2 === country.cca2 && (
                        <Check size={16} className="text-blue-600" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 text-sm">No countries found</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Display Result */}
        {selectedCountry && (
          <div className="mt-12 p-8 bg-white rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center animate-in slide-in-from-bottom duration-500">
             <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Selected Destination</div>
             <img 
               src={selectedCountry.flags.svg} 
               alt="Big Flag" 
               className="w-32 h-20 object-cover rounded-lg shadow-md mb-4 border border-slate-200"
             />
             <h2 className="text-3xl font-black text-slate-800">{selectedCountry.name.common}</h2>
             <p className="text-slate-500 mt-1">Country Code: {selectedCountry.cca2}</p>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}} />
    </div>
  );
};

export default App;
