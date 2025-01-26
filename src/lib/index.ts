import { writable } from 'svelte/store';

interface UserProfile {
	firstName: string;
	lastName: string;
}

interface UserData {
	id: string;
	email: string;
	role: 'LANDLORD' | 'TENANT';
	profile: UserProfile;
	isLandlord: boolean;
	isTenant: boolean;
}

export const userDataStore = writable<UserData | null>(null);
