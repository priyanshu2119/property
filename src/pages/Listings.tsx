import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, ChevronDown, Heart, MapPin, ArrowRight, Star, Menu, Building2, Building, Home
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { searchProperties, filterProperties, sortProperties } from '../utils/searchUtils';

// Sample listings data
const SAMPLE_LISTINGS = Array(9).fill({
  id: '1',
  title: 'Premium Apartment in Whitefield',
  description: 'Luxury apartment with modern amenities',
  price: 4500000,
  location: 'Whitefield, Bangalore',
  type: 'sale',
  category: 'apartment',
  bedrooms: 3,
  bathrooms: 2,
  area: 1800,
  images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'],
  features: ['Swimming Pool', 'Gym', 'Garden'],
  verified: true,
  premium: true,
  createdAt: '2024-03-15T10:00:00Z',
  updatedAt: '2024-03-15T10:00:00Z'
});

export const Listings = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    price: 'Any Price',
    bhk: 'Any BHK',
    city: 'Any City',
    area: 'Any Area'
  });
  const [sortOption, setSortOption] = useState('Newest First');
  const [filteredListings, setFilteredListings] = useState(SAMPLE_LISTINGS);
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 9;

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    // Call it once to set initial state
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter and search listings when any filter changes
  useEffect(() => {
    let results = SAMPLE_LISTINGS;
    
    // Apply type filter (Sale, Rent, All)
    if (filterType !== 'all') {
      results = results.filter(listing => listing.type === filterType);
    }
    
    // Apply search query
    results = searchProperties(results, searchQuery);
    
    // Apply dropdown filters
    results = filterProperties(results, filters);
    
    // Apply category filter
    if (activeCategory !== 'all') {
      results = results.filter(listing => listing.category === activeCategory);
    }
    
    // Apply sorting
    results = sortProperties(results, sortOption);
    
    setFilteredListings(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, filters, filterType, activeCategory, sortOption]);

  // Handle filter change
  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
  };

  // Calculate the current page's listings
  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = filteredListings.slice(indexOfFirstListing, indexOfLastListing);
  const totalPages = Math.ceil(filteredListings.length / listingsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />
      
      {/* Hero section */}
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-indigo-700/80"></div>
          <img 
            src="https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
            className="w-full h-full object-cover object-center" 
            alt="Property listings"
          />
        </div>
        
        {/* Main container with max-width to prevent stretching too wide */}
        <div className="container mx-auto px-6 relative z-10 max-w-7xl"> {/* Increased padding and added max-width */}
          <div className="flex flex-col md:flex-row gap-10 md:items-start"> {/* Changed to items-start */}
            {/* Left side - Title and search */}
            <div className="md:flex-1 max-w-full md:max-w-[520px]"> {/* Adjusted max-width */}
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4 animate-fadeInUp">
                Explore All Property Listings
              </h1>
              <p className="text-white/90 text-lg mb-8 animate-fadeInUp" style={{animationDelay: '100ms'}}>
                Browse our comprehensive collection of properties for sale and rent
              </p>
              
              {/* Search box with improved spacing */}
              <div className="bg-white rounded-xl shadow-lg p-4 mb-8 animate-fadeInUp" style={{animationDelay: '200ms'}}> {/* Increased padding */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by location, property name, ID..."
                      className="w-full pl-10 pr-3 py-3 rounded-lg text-sm border-none focus:ring-0"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button className="bg-indigo-600 text-white px-5 py-3 rounded-lg text-sm font-medium flex items-center hover:bg-indigo-700 transition-colors">
                    Search
                  </button>
                </div>
                
                <div className="flex justify-between items-center pt-3">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-sm text-gray-500 hover:text-indigo-600 flex items-center transition-colors"
                  >
                    <Filter className="h-3 w-3 mr-1" />
                    Advanced Filters
                    <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <div className="flex gap-2">
                    {['All', 'Sale', 'Rent'].map(type => (
                      <button
                        key={type}
                        className={`text-xs px-3 py-1 rounded-full transition-colors ${
                          filterType === type.toLowerCase() 
                            ? 'bg-indigo-100 text-indigo-600' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        onClick={() => setFilterType(type.toLowerCase())}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Advanced filters */}
                {showFilters && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 mt-3 border-t border-gray-100 animate-fadeIn">
                    <select 
                      className="text-sm p-2 rounded-lg border border-gray-200 bg-gray-50"
                      value={filters.type}
                      onChange={(e) => handleFilterChange('type', e.target.value)}
                    >
                      <option>Any Type</option>
                      <option>Apartment</option>
                      <option>House</option>
                      <option>Villa</option>
                      <option>Commercial</option>
                      <option>Plot</option>
                    </select>
                    
                    <select 
                      className="text-sm p-2 rounded-lg border border-gray-200 bg-gray-50"
                      value={filters.price}
                      onChange={(e) => handleFilterChange('price', e.target.value)}
                    >
                      <option>Any Price</option>
                      <option>Under ₹50L</option>
                      <option>₹50L - ₹1Cr</option>
                      <option>₹1Cr - ₹2Cr</option>
                      <option>Above ₹2Cr</option>
                    </select>
                    
                    <select 
                      className="text-sm p-2 rounded-lg border border-gray-200 bg-gray-50"
                      value={filters.bhk}
                      onChange={(e) => handleFilterChange('bhk', e.target.value)}
                    >
                      <option>Any BHK</option>
                      <option>1 BHK</option>
                      <option>2 BHK</option>
                      <option>3 BHK</option>
                      <option>4+ BHK</option>
                    </select>
                    
                    <select 
                      className="text-sm p-2 rounded-lg border border-gray-200 bg-gray-50"
                      value={filters.city}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                    >
                      <option>Any City</option>
                      <option>Bangalore</option>
                      <option>Mumbai</option>
                      <option>Delhi</option>
                      <option>Hyderabad</option>
                      <option>Chennai</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            
            {/* Center spacer */}
            <div className="hidden md:block md:w-10"></div> {/* Added spacer */}
            
            {/* Right side - Categories with proper spacing */}
            <div className="md:w-[340px] pr-0 md:pr-4 animate-fadeInRight" style={{animationDelay: '300ms'}}> {/* Added right padding */}
              <h2 className="text-xl font-medium text-white mb-5">Categories</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { 
                    id: 'projects', 
                    label: 'Projects', 
                    icon: Building2,
                    subMenu: [
                      { id: 'apartments', label: 'Apartments' },
                      { id: 'builder-floors', label: 'Builder Floors' },
                      { id: 'villas', label: 'Villas' },
                      { id: 'farm-houses', label: 'Farm Houses' }
                    ]
                  },
                  { id: 'flats', label: 'Flats', icon: Building },
                  { id: 'plots', label: 'Plots', icon: MapPin },
                  { 
                    id: 'best-locations', 
                    label: 'Best Locations', 
                    icon: Home,
                    onClick: () => {
                      setShowLocationDropdown(!showLocationDropdown);
                      setActiveCategory('best-locations');
                    }
                  }
                ].map((category) => (
                  <div key={category.id} className="relative group">
                    <button
                      className={`flex flex-col items-center justify-center w-full p-5 rounded-xl text-sm transition-all ${
                        activeCategory === category.id
                          ? 'bg-indigo-600 text-white shadow-md transform scale-[1.02]' /* Added subtle scale */
                          : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                      }`}
                      onClick={() => {
                        if (category.onClick) {
                          category.onClick();
                        } else if (category.subMenu) {
                          setOpenSubMenu(openSubMenu === category.id ? null : category.id);
                          setActiveCategory(category.id);
                        } else {
                          setActiveCategory(category.id);
                          setOpenSubMenu(null);
                        }
                      }}
                    >
                      <category.icon className="h-8 w-8 mb-3" />
                      <span className="text-base font-medium">{category.label}</span>
                    </button>
                    
                    {/* Updated submenu position */}
                    {category.subMenu && (
                      <div className="absolute z-30 left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="p-2 space-y-1">
                          {category.subMenu.map(subItem => (
                            <Link 
                              key={subItem.id}
                              to={`/projects/${subItem.id}`}
                              className="block w-full text-left px-3 py-2 text-sm rounded hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Location dropdown with improved styling */}
              {showLocationDropdown && (
                <div className="mt-4 p-4 bg-white rounded-lg shadow-lg animate-fadeIn"> {/* Increased padding */}
                  <p className="text-sm font-medium text-gray-800 mb-3">Popular cities</p> {/* Improved typography */}
                  <div className="grid grid-cols-2 gap-2">
                    {['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'].map((city) => (
                      <button
                        key={city}
                        className="text-xs p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        onClick={() => {
                          // Filter by city logic here
                          setShowLocationDropdown(false);
                        }}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-semibold">All Listings</h2>
              <p className="text-sm text-gray-500">
                Showing {indexOfFirstListing + 1}-{Math.min(indexOfLastListing, filteredListings.length)} of {filteredListings.length} properties
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select 
                className="text-sm p-2 rounded-lg border border-gray-200 bg-white"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option>Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Popular</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentListings.map((listing, index) => (
              <Link 
                key={index} 
                to={`/property/${listing.id}`}
                className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {listing.premium && (
                    <div className="absolute top-3 left-3 bg-indigo-600 text-white text-xs px-2 py-1 rounded-md">
                      Premium
                    </div>
                  )}
                  <button className="absolute top-3 right-3 bg-white/90 rounded-full p-1.5 text-gray-600 hover:text-red-500 transition-colors">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="p-5">
                  <div className="flex items-center text-xs text-gray-500 mb-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    {listing.location}
                  </div>
                  
                  <h3 className="text-base font-medium text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {listing.title}
                  </h3>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-indigo-600">
                      ₹{(listing.price / 100000).toFixed(1)}L
                    </span>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="px-2 py-1 bg-gray-100 rounded-md mr-2">{listing.bedrooms} BHK</span>
                      <span className="px-2 py-1 bg-gray-100 rounded-md">{listing.area} sq.ft</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white">
              <button 
                className="p-2 px-4 border-r border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // For simplicity, show first 5 pages
                // In a real app, you'd want to show pages around current page
                const pageNum = i + 1;
                return (
                  <button 
                    key={pageNum} 
                    className={`p-2 px-4 border-r border-gray-200 ${pageNum === currentPage ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50 text-gray-600'}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button 
                className="p-2 px-4 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Listings;