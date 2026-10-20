import { catalogService } from '@/services/catalogService';
import { useAsync } from './useAsync';

export const useCategories = () => useAsync(() => catalogService.getCategories(), []);
