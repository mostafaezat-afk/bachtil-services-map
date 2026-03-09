import { CONFIG, type ServiceProvider } from './constants';

export async function searchProviders(activity: string): Promise<ServiceProvider[]> {
  const url = `${CONFIG.SEARCH_API}?action=getProvidersByActivity&activity=${encodeURIComponent(activity)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('فشل في الاتصال بالخادم');
  return res.json();
}

export async function registerProvider(data: {
  name: string;
  phone: string;
  address: string;
  activity: string;
  lat: number;
  lng: number;
}): Promise<void> {
  await fetch(CONFIG.REGISTER_API, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'saveProvider', ...data }),
  });
}
