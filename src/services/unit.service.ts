export interface Unit {
	id?: string;
	title: string;
	description: string;
	location: Location;
	rentAmount: number;
	rooms: number;
	status?: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
	photos?: string[];
	amenities?: string[];
}

export interface Location {
	address: string;
	city: string;
	province: string;
	zipCode: string;
	country: string;
}

class UnitService {
	private baseUrl = 'http://localhost:3000/api/units/tenants';

	async getUnits(filters?: {
		minPrice?: number;
		maxPrice?: number;
		rooms?: number;
		location?: string;
		amenities?: string[];
	}): Promise<Unit[]> {
		const queryParams = new URLSearchParams();
		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined) {
					queryParams.append(key, Array.isArray(value) ? value.join(',') : value.toString());
				}
			});
		}

		const response = await fetch(`${this.baseUrl}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		});
		if (!response.ok) {
			throw new Error('Failed to fetch units');
		}

		const data = await response.json();
		console.log(data);
		return response.json();
	}
}

export default new UnitService();
