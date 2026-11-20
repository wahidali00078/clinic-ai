/**
 * India Geographic Dataset: States and Cities with Geographic Coordinates
 * Powers state & city selectors, auto-complete, and map city markers
 */

export interface CityInfo {
  name: string;
  state: string;
  lat: number;
  lng: number;
  tier: 1 | 2 | 3;
  demand: 'Very High' | 'High' | 'Moderate';
  population?: string;
  popularAreas?: string[];
}

export interface StateInfo {
  name: string;
  code: string;
  region: 'North' | 'South' | 'West' | 'East' | 'Central' | 'NorthEast';
  capital: string;
  centerLat: number;
  centerLng: number;
  cities: CityInfo[];
}

export const INDIA_STATES_DATA: StateInfo[] = [
  {
    name: 'Rajasthan',
    code: 'RJ',
    region: 'North',
    capital: 'Jaipur',
    centerLat: 26.8532,
    centerLng: 75.8052,
    cities: [
      { name: 'Jaipur', state: 'Rajasthan', lat: 26.8532, lng: 75.8052, tier: 1, demand: 'Very High', population: '3.9M', popularAreas: ['Malviya Nagar', 'Vaishali Nagar', 'Mansarovar', 'C-Scheme', 'Raja Park'] },
      { name: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243, tier: 2, demand: 'High', population: '1.4M', popularAreas: ['Shastri Nagar', 'Ratanada', 'Sardarpura'] },
      { name: 'Udaipur', state: 'Rajasthan', lat: 24.5854, lng: 73.7125, tier: 2, demand: 'High', population: '650K', popularAreas: ['Hiran Magri', 'Fatehpura', 'Panchwati'] },
      { name: 'Kota', state: 'Rajasthan', lat: 25.2138, lng: 75.8648, tier: 2, demand: 'High', population: '1.2M', popularAreas: ['Talwandi', 'Vigyan Nagar', 'Dadabari'] },
      { name: 'Ajmer', state: 'Rajasthan', lat: 26.4499, lng: 74.6399, tier: 2, demand: 'Moderate', population: '600K', popularAreas: ['Civil Lines', 'Vaishali Nagar', 'Adarsh Nagar'] },
      { name: 'Bikaner', state: 'Rajasthan', lat: 28.0229, lng: 73.3119, tier: 3, demand: 'Moderate', population: '700K', popularAreas: ['Kanta Khaturia Colony', 'Jai Narayan Vyas Colony'] },
      { name: 'Alwar', state: 'Rajasthan', lat: 27.553, lng: 76.6346, tier: 3, demand: 'Moderate', population: '400K', popularAreas: ['MIA', 'Neemrana', 'Scheme No 2'] },
      { name: 'Bhilwara', state: 'Rajasthan', lat: 25.3407, lng: 74.6313, tier: 3, demand: 'Moderate', population: '420K', popularAreas: ['Subhash Nagar', 'Bhopal Ganj'] },
      { name: 'Sikar', state: 'Rajasthan', lat: 27.6094, lng: 75.1398, tier: 3, demand: 'Moderate', population: '300K', popularAreas: ['Piprali Road', 'Fatehpur Road'] },
    ],
  },
  {
    name: 'Maharashtra',
    code: 'MH',
    region: 'West',
    capital: 'Mumbai',
    centerLat: 19.076,
    centerLng: 72.8777,
    cities: [
      { name: 'Mumbai', state: 'Maharashtra', lat: 19.076, lng: 72.8777, tier: 1, demand: 'Very High', population: '13.5M', popularAreas: ['Andheri West', 'Bandra', 'Powai', 'Borivali', 'Dadar', 'Worli'] },
      { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567, tier: 1, demand: 'Very High', population: '4.2M', popularAreas: ['Kothrud', 'Baner', 'Wakad', 'Viman Nagar', 'Aundh', 'Hinjawadi'] },
      { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882, tier: 2, demand: 'High', population: '2.5M', popularAreas: ['Dharampeth', 'Ramdaspeth', 'Pratap Nagar', 'Civil Lines'] },
      { name: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898, tier: 2, demand: 'High', population: '1.6M', popularAreas: ['College Road', 'Gangapur Road', 'Indira Nagar'] },
      { name: 'Thane', state: 'Maharashtra', lat: 19.2183, lng: 72.9781, tier: 1, demand: 'Very High', population: '2.1M', popularAreas: ['Ghubunder Road', 'Panch Pakhadi', 'Majiwada'] },
      { name: 'Navi Mumbai', state: 'Maharashtra', lat: 19.033, lng: 73.0297, tier: 1, demand: 'Very High', population: '1.4M', popularAreas: ['Vashi', 'Nerul', 'Kharghar', 'Seawoods'] },
      { name: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', lat: 19.8762, lng: 75.3433, tier: 2, demand: 'Moderate', population: '1.2M', popularAreas: ['CIDCO', 'Samarth Nagar', 'Garkheda'] },
      { name: 'Solapur', state: 'Maharashtra', lat: 17.6599, lng: 75.9064, tier: 3, demand: 'Moderate', population: '980K', popularAreas: ['Hotgi Road', 'Jule Solapur'] },
      { name: 'Kolhapur', state: 'Maharashtra', lat: 16.705, lng: 74.2433, tier: 3, demand: 'Moderate', population: '600K', popularAreas: ['Rajarampuri', 'Tarabai Park'] },
    ],
  },
  {
    name: 'Karnataka',
    code: 'KA',
    region: 'South',
    capital: 'Bengaluru',
    centerLat: 12.9716,
    centerLng: 77.5946,
    cities: [
      { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946, tier: 1, demand: 'Very High', population: '12.4M', popularAreas: ['Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'Jayanagar', 'JP Nagar'] },
      { name: 'Mysuru', state: 'Karnataka', lat: 12.2958, lng: 76.6394, tier: 2, demand: 'High', population: '1.1M', popularAreas: ['Jayalakshmipuram', 'Gokulam', 'Kuvempunagar', 'Saraswathipuram'] },
      { name: 'Mangaluru', state: 'Karnataka', lat: 12.9141, lng: 74.856, tier: 2, demand: 'High', population: '700K', popularAreas: ['Kadri', 'Bejai', 'Kankanady', 'Urwa'] },
      { name: 'Hubballi-Dharwad', state: 'Karnataka', lat: 15.3647, lng: 75.124, tier: 2, demand: 'Moderate', population: '1.0M', popularAreas: ['Vidyanagar', 'Gokul Road', 'Keshwapur'] },
      { name: 'Belagavi', state: 'Karnataka', lat: 15.8497, lng: 74.4977, tier: 3, demand: 'Moderate', population: '620K', popularAreas: ['Tilakwadi', 'Camp', 'Hindwadi'] },
      { name: 'Davanagere', state: 'Karnataka', lat: 14.4644, lng: 75.9218, tier: 3, demand: 'Moderate', population: '460K', popularAreas: ['MCC B Block', 'Vidyanagar'] },
      { name: 'Shivamogga', state: 'Karnataka', lat: 13.9299, lng: 75.5681, tier: 3, demand: 'Moderate', population: '350K', popularAreas: ['Gopala Gowda Extension', 'Tilak Nagar'] },
    ],
  },
  {
    name: 'Delhi NCR',
    code: 'DL',
    region: 'North',
    capital: 'New Delhi',
    centerLat: 28.6139,
    centerLng: 77.209,
    cities: [
      { name: 'New Delhi', state: 'Delhi NCR', lat: 28.6139, lng: 77.209, tier: 1, demand: 'Very High', population: '11.8M', popularAreas: ['Connaught Place', 'South Extension', 'Saket', 'Hauz Khas', 'Lajpat Nagar'] },
      { name: 'Delhi', state: 'Delhi NCR', lat: 28.6692, lng: 77.2065, tier: 1, demand: 'Very High', population: '16.5M', popularAreas: ['Rohini', 'Dwarka', 'Karol Bagh', 'Pitampura', 'Janakpuri'] },
      { name: 'Gurugram', state: 'Delhi NCR', lat: 28.4595, lng: 77.0266, tier: 1, demand: 'Very High', population: '1.2M', popularAreas: ['DLF Phase 1-5', 'Cyber City', 'Sohna Road', 'Golf Course Ext', 'Sector 29'] },
      { name: 'Noida', state: 'Delhi NCR', lat: 28.5355, lng: 77.391, tier: 1, demand: 'Very High', population: '900K', popularAreas: ['Sector 18', 'Sector 62', 'Sector 137', 'Sector 50', 'Sector 76'] },
      { name: 'Greater Noida', state: 'Delhi NCR', lat: 28.4744, lng: 77.504, tier: 2, demand: 'High', population: '450K', popularAreas: ['Alpha 1', 'Pari Chowk', 'Gaur City'] },
      { name: 'Faridabad', state: 'Delhi NCR', lat: 28.4089, lng: 77.3178, tier: 2, demand: 'High', population: '1.6M', popularAreas: ['Sector 15', 'Sector 16', 'NIT Faridabad'] },
      { name: 'Ghaziabad', state: 'Delhi NCR', lat: 28.6692, lng: 77.4538, tier: 2, demand: 'High', population: '2.4M', popularAreas: ['Indirapuram', 'Vaishali', 'Raj Nagar Extension'] },
    ],
  },
  {
    name: 'Telangana',
    code: 'TS',
    region: 'South',
    capital: 'Hyderabad',
    centerLat: 17.385,
    centerLng: 78.4867,
    cities: [
      { name: 'Hyderabad', state: 'Telangana', lat: 17.385, lng: 78.4867, tier: 1, demand: 'Very High', population: '10.2M', popularAreas: ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Hitec City', 'Madhapur', 'Kukatpally'] },
      { name: 'Secunderabad', state: 'Telangana', lat: 17.4399, lng: 78.4983, tier: 1, demand: 'High', population: '1.5M', popularAreas: ['Sainikpuri', 'Trimulgherry', 'Marredpally'] },
      { name: 'Warangal', state: 'Telangana', lat: 17.9689, lng: 79.5941, tier: 2, demand: 'Moderate', population: '850K', popularAreas: ['Hanamkonda', 'Kazipet', 'Subedari'] },
      { name: 'Nizamabad', state: 'Telangana', lat: 18.6725, lng: 78.0941, tier: 3, demand: 'Moderate', population: '350K', popularAreas: ['Khaleelwadi', 'Bodhan Road'] },
      { name: 'Karimnagar', state: 'Telangana', lat: 18.4386, lng: 79.1288, tier: 3, demand: 'Moderate', population: '320K', popularAreas: ['Collectorate Area', 'Mankammathota'] },
    ],
  },
  {
    name: 'Tamil Nadu',
    code: 'TN',
    region: 'South',
    capital: 'Chennai',
    centerLat: 13.0827,
    centerLng: 80.2707,
    cities: [
      { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, tier: 1, demand: 'Very High', population: '8.7M', popularAreas: ['Anna Nagar', 'T. Nagar', 'Adyar', 'Velachery', 'OMR', 'Kilpauk'] },
      { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558, tier: 2, demand: 'High', population: '2.2M', popularAreas: ['RS Puram', 'Gandhipuram', 'Saibaba Colony', 'Race Course'] },
      { name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198, tier: 2, demand: 'High', population: '1.6M', popularAreas: ['KK Nagar', 'Anna Nagar', 'Tallakulam'] },
      { name: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.7905, lng: 78.7047, tier: 2, demand: 'Moderate', population: '1.1M', popularAreas: ['Thillai Nagar', 'Cantonment', 'KK Nagar'] },
      { name: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.146, tier: 2, demand: 'Moderate', population: '950K', popularAreas: ['Fairlands', 'Alagapuram', 'Hasthampatti'] },
      { name: 'Tirunelveli', state: 'Tamil Nadu', lat: 8.7139, lng: 77.7567, tier: 3, demand: 'Moderate', population: '520K', popularAreas: ['Palayamkottai', 'Vannarpettai'] },
      { name: 'Vellore', state: 'Tamil Nadu', lat: 12.9165, lng: 79.1325, tier: 2, demand: 'Very High', population: '500K', popularAreas: ['CMC Area', 'Katpadi', 'Gandhi Nagar'] },
    ],
  },
  {
    name: 'Gujarat',
    code: 'GJ',
    region: 'West',
    capital: 'Gandhinagar',
    centerLat: 23.0225,
    centerLng: 72.5714,
    cities: [
      { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, tier: 1, demand: 'Very High', population: '7.8M', popularAreas: ['Satellite', 'Bodakdev', 'SG Highway', 'Vastrapur', 'Prahlad Nagar', 'Navrangpura'] },
      { name: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311, tier: 1, demand: 'High', population: '6.2M', popularAreas: ['Adajan', 'Vesu', 'Piplod', 'Ghod Dod Road', 'Varachha'] },
      { name: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812, tier: 2, demand: 'High', population: '2.1M', popularAreas: ['Alkapuri', 'Akota', 'Vasna Road', 'Manjalpur'] },
      { name: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022, tier: 2, demand: 'High', population: '1.5M', popularAreas: ['Kalawad Road', 'Yagnik Road', 'University Road'] },
      { name: 'Gandhinagar', state: 'Gujarat', lat: 23.2156, lng: 72.6369, tier: 2, demand: 'High', population: '350K', popularAreas: ['Infocity', 'Sector 11', 'Sector 21', 'Kudasan'] },
      { name: 'Bhavnagar', state: 'Gujarat', lat: 21.7645, lng: 72.1519, tier: 3, demand: 'Moderate', population: '650K', popularAreas: ['Waghawadi Road', 'Vidhyanagar'] },
      { name: 'Jamnagar', state: 'Gujarat', lat: 22.4707, lng: 70.0577, tier: 3, demand: 'Moderate', population: '550K', popularAreas: ['Digvijay Plot', 'Patel Colony'] },
    ],
  },
  {
    name: 'Uttar Pradesh',
    code: 'UP',
    region: 'North',
    capital: 'Lucknow',
    centerLat: 26.8467,
    centerLng: 80.9462,
    cities: [
      { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, tier: 1, demand: 'Very High', population: '3.8M', popularAreas: ['Gomti Nagar', 'Hazratganj', 'Aliganj', 'Indira Nagar', 'Mahanagar'] },
      { name: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319, tier: 2, demand: 'High', population: '3.2M', popularAreas: ['Civil Lines', 'Swaroop Nagar', 'Kakadeo', 'Kidwai Nagar'] },
      { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739, tier: 2, demand: 'High', population: '1.6M', popularAreas: ['Sigra', 'Lanka', 'Bhelupur', 'Mahmoorganj'] },
      { name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081, tier: 2, demand: 'High', population: '1.8M', popularAreas: ['Sanjay Place', 'Kamla Nagar', 'Tajganj'] },
      { name: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463, tier: 2, demand: 'Moderate', population: '1.4M', popularAreas: ['Civil Lines', 'Georgetown', 'Tagore Town'] },
      { name: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lng: 77.7064, tier: 2, demand: 'Moderate', population: '1.5M', popularAreas: ['Shastri Nagar', 'Modipuram', 'Civil Lines'] },
      { name: 'Bareilly', state: 'Uttar Pradesh', lat: 28.367, lng: 79.4304, tier: 3, demand: 'Moderate', population: '950K', popularAreas: ['Civil Lines', 'Rajendra Nagar'] },
      { name: 'Gorakhpur', state: 'Uttar Pradesh', lat: 26.7606, lng: 83.3732, tier: 3, demand: 'Moderate', population: '800K', popularAreas: ['Golghar', 'Civil Lines'] },
    ],
  },
  {
    name: 'West Bengal',
    code: 'WB',
    region: 'East',
    capital: 'Kolkata',
    centerLat: 22.5726,
    centerLng: 88.3639,
    cities: [
      { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, tier: 1, demand: 'Very High', population: '14.8M', popularAreas: ['Salt Lake', 'New Town', 'Park Street', 'Ballygunge', 'Gariahat', 'Alipore'] },
      { name: 'Howrah', state: 'West Bengal', lat: 22.5958, lng: 88.2636, tier: 2, demand: 'High', population: '1.3M', popularAreas: ['Shibpur', 'Bally', 'Kadamtala'] },
      { name: 'Siliguri', state: 'West Bengal', lat: 26.7271, lng: 88.3953, tier: 2, demand: 'High', population: '750K', popularAreas: ['Sevoke Road', 'Hakim Para', 'Pradhan Nagar'] },
      { name: 'Durgapur', state: 'West Bengal', lat: 23.5204, lng: 87.3119, tier: 2, demand: 'Moderate', population: '600K', popularAreas: ['City Centre', 'Benachity', 'Bidhannagar'] },
      { name: 'Asansol', state: 'West Bengal', lat: 23.6739, lng: 86.9524, tier: 3, demand: 'Moderate', population: '580K', popularAreas: ['Ushagram', 'Burnpur'] },
    ],
  },
  {
    name: 'Kerala',
    code: 'KL',
    region: 'South',
    capital: 'Thiruvananthapuram',
    centerLat: 9.9312,
    centerLng: 76.2673,
    cities: [
      { name: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673, tier: 1, demand: 'Very High', population: '2.4M', popularAreas: ['Kakkanad', 'Edappally', 'Panampilly Nagar', 'MG Road', 'Palarivattom'] },
      { name: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366, tier: 2, demand: 'High', population: '1.1M', popularAreas: ['Kowdiar', 'Sasthamangalam', 'Vellayambalam', 'Technopark'] },
      { name: 'Kozhikode', state: 'Kerala', lat: 11.2588, lng: 75.7804, tier: 2, demand: 'High', population: '850K', popularAreas: ['Mavoor Road', 'Nadakkavu', 'Eranhipalam'] },
      { name: 'Thrissur', state: 'Kerala', lat: 10.5276, lng: 76.2144, tier: 2, demand: 'High', population: '400K', popularAreas: ['Swaraj Round', 'Ayyanthole'] },
      { name: 'Kollam', state: 'Kerala', lat: 8.8932, lng: 76.6141, tier: 3, demand: 'Moderate', population: '390K', popularAreas: ['Chinnakada', 'Asramam'] },
      { name: 'Kannur', state: 'Kerala', lat: 11.8745, lng: 75.3704, tier: 3, demand: 'Moderate', population: '250K', popularAreas: ['Thavakkara', 'Payyambalam'] },
    ],
  },
  {
    name: 'Punjab',
    code: 'PB',
    region: 'North',
    capital: 'Chandigarh',
    centerLat: 30.7333,
    centerLng: 76.7794,
    cities: [
      { name: 'Chandigarh', state: 'Punjab', lat: 30.7333, lng: 76.7794, tier: 1, demand: 'Very High', population: '1.2M', popularAreas: ['Sector 17', 'Sector 35', 'Sector 22', 'Sector 8', 'Panchkula'] },
      { name: 'Ludhiana', state: 'Punjab', lat: 30.901, lng: 75.8573, tier: 2, demand: 'High', population: '1.8M', popularAreas: ['Sarabha Nagar', 'Model Town', 'BRS Nagar'] },
      { name: 'Amritsar', state: 'Punjab', lat: 31.634, lng: 74.8723, tier: 2, demand: 'High', population: '1.3M', popularAreas: ['Ranjit Avenue', 'Mall Road', 'Lawrence Road'] },
      { name: 'Jalandhar', state: 'Punjab', lat: 31.326, lng: 75.5762, tier: 2, demand: 'Moderate', population: '900K', popularAreas: ['Model Town', 'Civil Lines', 'BMC Chowk'] },
      { name: 'Patiala', state: 'Punjab', lat: 30.3398, lng: 76.3869, tier: 3, demand: 'Moderate', population: '480K', popularAreas: ['Leela Bhawan', 'Model Town'] },
    ],
  },
  {
    name: 'Madhya Pradesh',
    code: 'MP',
    region: 'Central',
    capital: 'Bhopal',
    centerLat: 22.7196,
    centerLng: 75.8577,
    cities: [
      { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577, tier: 1, demand: 'Very High', population: '2.4M', popularAreas: ['Vijay Nagar', 'Palasia', 'AB Road', 'Saket', 'Geeta Bhavan'] },
      { name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126, tier: 2, demand: 'High', population: '2.1M', popularAreas: ['Arera Colony', 'MP Nagar', 'Shahpura', 'Kolar Road'] },
      { name: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864, tier: 2, demand: 'Moderate', population: '1.3M', popularAreas: ['Civil Lines', 'Wright Town', 'Napier Town'] },
      { name: 'Gwalior', state: 'Madhya Pradesh', lat: 26.2183, lng: 78.1828, tier: 2, demand: 'Moderate', population: '1.2M', popularAreas: ['City Centre', 'Lashkar', 'Thatipur'] },
      { name: 'Ujjain', state: 'Madhya Pradesh', lat: 23.1765, lng: 75.7885, tier: 3, demand: 'Moderate', population: '550K', popularAreas: ['Freeganj', 'Dewas Road'] },
    ],
  },
  {
    name: 'Bihar',
    code: 'BR',
    region: 'East',
    capital: 'Patna',
    centerLat: 25.6116,
    centerLng: 85.144,
    cities: [
      { name: 'Patna', state: 'Bihar', lat: 25.6116, lng: 85.144, tier: 2, demand: 'Very High', population: '2.6M', popularAreas: ['Boring Road', 'Kankarbagh', 'Bailey Road', 'Rajendra Nagar'] },
      { name: 'Gaya', state: 'Bihar', lat: 24.7914, lng: 85.0002, tier: 3, demand: 'Moderate', population: '520K', popularAreas: ['Civil Lines', 'Rampur'] },
      { name: 'Bhagalpur', state: 'Bihar', lat: 25.2425, lng: 86.9842, tier: 3, demand: 'Moderate', population: '450K', popularAreas: ['Adampur', 'Tilkamanjhi'] },
      { name: 'Muzaffarpur', state: 'Bihar', lat: 26.1209, lng: 85.3647, tier: 3, demand: 'Moderate', population: '400K', popularAreas: ['Mithanpura', 'Aghoria Bazar'] },
    ],
  },
  {
    name: 'Andhra Pradesh',
    code: 'AP',
    region: 'South',
    capital: 'Amaravati',
    centerLat: 17.6868,
    centerLng: 83.2185,
    cities: [
      { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185, tier: 2, demand: 'High', population: '2.1M', popularAreas: ['MVP Colony', 'Siripuram', 'Dwaraka Nagar', 'Seethammadhara'] },
      { name: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.648, tier: 2, demand: 'High', population: '1.2M', popularAreas: ['Benz Circle', 'Governorpet', 'Moghalrajpuram'] },
      { name: 'Guntur', state: 'Andhra Pradesh', lat: 16.3067, lng: 80.4365, tier: 3, demand: 'Moderate', population: '750K', popularAreas: ['Brodipet', 'Arundelpet', 'Laxmipuram'] },
      { name: 'Nellore', state: 'Andhra Pradesh', lat: 14.4426, lng: 79.9865, tier: 3, demand: 'Moderate', population: '550K', popularAreas: ['Pogathota', 'Magunta Layout'] },
      { name: 'Tirupati', state: 'Andhra Pradesh', lat: 13.6288, lng: 79.4192, tier: 3, demand: 'High', population: '460K', popularAreas: ['KT Road', 'Air Bypass Road'] },
    ],
  },
  {
    name: 'Odisha',
    code: 'OD',
    region: 'East',
    capital: 'Bhubaneswar',
    centerLat: 20.2961,
    centerLng: 85.8245,
    cities: [
      { name: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245, tier: 2, demand: 'High', population: '1.1M', popularAreas: ['Saheed Nagar', 'Nayapalli', 'Jayadev Vihar', 'Patia'] },
      { name: 'Cuttack', state: 'Odisha', lat: 20.4625, lng: 85.883, tier: 2, demand: 'Moderate', population: '680K', popularAreas: ['Badambadi', 'Link Road', 'CDA Sector 6'] },
      { name: 'Rourkela', state: 'Odisha', lat: 22.2604, lng: 84.8536, tier: 3, demand: 'Moderate', population: '550K', popularAreas: ['Civil Township', 'Panposh'] },
    ],
  },
  {
    name: 'Assam',
    code: 'AS',
    region: 'NorthEast',
    capital: 'Dispur',
    centerLat: 26.1445,
    centerLng: 91.7362,
    cities: [
      { name: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362, tier: 2, demand: 'High', population: '1.2M', popularAreas: ['GS Road', 'Christian Basti', 'Zoo Road', 'Ganeshguri'] },
      { name: 'Silchar', state: 'Assam', lat: 24.8333, lng: 92.7789, tier: 3, demand: 'Moderate', population: '250K', popularAreas: ['Tarapur', 'Rangirkhari'] },
      { name: 'Dibrugarh', state: 'Assam', lat: 27.4728, lng: 94.912, tier: 3, demand: 'Moderate', population: '180K', popularAreas: ['Graham Bazar', 'Amolapatty'] },
    ],
  },
  {
    name: 'Jharkhand',
    code: 'JH',
    region: 'East',
    capital: 'Ranchi',
    centerLat: 23.3441,
    centerLng: 85.3096,
    cities: [
      { name: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096, tier: 2, demand: 'High', population: '1.4M', popularAreas: ['Lalpur', 'Main Road', 'Harmu', 'Bariatu', 'Kanke Road'] },
      { name: 'Jamshedpur', state: 'Jharkhand', lat: 22.8046, lng: 86.2029, tier: 2, demand: 'High', population: '1.3M', popularAreas: ['Bistupur', 'Sakchi', 'Kadma', 'Sonari'] },
      { name: 'Dhanbad', state: 'Jharkhand', lat: 23.7957, lng: 86.4304, tier: 3, demand: 'Moderate', population: '1.1M', popularAreas: ['Bank More', 'Saraidhela'] },
    ],
  },
  {
    name: 'Chhattisgarh',
    code: 'CG',
    region: 'Central',
    capital: 'Raipur',
    centerLat: 21.2514,
    centerLng: 81.6296,
    cities: [
      { name: 'Raipur', state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296, tier: 2, demand: 'High', population: '1.3M', popularAreas: ['Shankar Nagar', 'Pandri', 'Civil Lines', 'Devendra Nagar'] },
      { name: 'Bhilai', state: 'Chhattisgarh', lat: 21.1938, lng: 81.3509, tier: 3, demand: 'Moderate', population: '700K', popularAreas: ['Sector 7', 'Nehru Nagar'] },
    ],
  },
  {
    name: 'Uttarakhand',
    code: 'UK',
    region: 'North',
    capital: 'Dehradun',
    centerLat: 30.3165,
    centerLng: 78.0322,
    cities: [
      { name: 'Dehradun', state: 'Uttarakhand', lat: 30.3165, lng: 78.0322, tier: 2, demand: 'High', population: '800K', popularAreas: ['Rajpur Road', 'Dalanwala', 'Chakrata Road'] },
      { name: 'Haridwar', state: 'Uttarakhand', lat: 29.9457, lng: 78.1642, tier: 3, demand: 'Moderate', population: '350K', popularAreas: ['Ranipur More', 'Shivalik Nagar'] },
      { name: 'Haldwani', state: 'Uttarakhand', lat: 29.2183, lng: 79.513, tier: 3, demand: 'Moderate', population: '300K', popularAreas: ['Kaladhungi Road', 'Nainital Road'] },
    ],
  },
  {
    name: 'Goa',
    code: 'GA',
    region: 'West',
    capital: 'Panaji',
    centerLat: 15.4909,
    centerLng: 73.8278,
    cities: [
      { name: 'Panaji', state: 'Goa', lat: 15.4909, lng: 73.8278, tier: 2, demand: 'High', population: '120K', popularAreas: ['Miramar', 'Campal', 'Fontainhas'] },
      { name: 'Margao', state: 'Goa', lat: 15.2832, lng: 73.9862, tier: 2, demand: 'High', population: '100K', popularAreas: ['Fatorda', 'Pajifond', 'Aquem'] },
      { name: 'Vasco da Gama', state: 'Goa', lat: 15.3982, lng: 73.8113, tier: 3, demand: 'Moderate', population: '100K', popularAreas: ['Chicalim', 'Dabolim'] },
    ],
  },
];

/**
 * Returns all state names
 */
export function getAllStates(): string[] {
  return INDIA_STATES_DATA.map(s => s.name);
}

/**
 * Returns all cities for a specific state
 */
export function getCitiesForState(stateName: string): CityInfo[] {
  if (!stateName) return [];
  const normalized = stateName.trim().toLowerCase();
  const matchedState = INDIA_STATES_DATA.find(
    s =>
      s.name.toLowerCase() === normalized ||
      s.code.toLowerCase() === normalized ||
      normalized.includes(s.name.toLowerCase()) ||
      s.name.toLowerCase().includes(normalized)
  );
  return matchedState ? matchedState.cities : [];
}

/**
 * Given a city name, find its state and city details
 */
export function findCityDetails(cityName: string): { city: CityInfo; state: StateInfo } | null {
  if (!cityName) return null;
  const normalized = cityName.trim().toLowerCase();

  for (const st of INDIA_STATES_DATA) {
    for (const ct of st.cities) {
      if (
        ct.name.toLowerCase() === normalized ||
        normalized.includes(ct.name.toLowerCase()) ||
        ct.name.toLowerCase().includes(normalized)
      ) {
        return { city: ct, state: st };
      }
    }
  }
  return null;
}

/**
 * Returns all cities across all states as a flat list
 */
export function getAllCities(): CityInfo[] {
  return INDIA_STATES_DATA.flatMap(s => s.cities);
}

/**
 * Returns all city coordinates for rendering city markers on Google Map
 */
export function getCityMarkersForMap(activeState?: string): CityInfo[] {
  if (activeState) {
    const stateCities = getCitiesForState(activeState);
    if (stateCities.length > 0) {
      return stateCities;
    }
  }
  // Return all Tier-1 and Tier-2 cities as markers by default
  return getAllCities().filter(c => c.tier <= 2);
}
