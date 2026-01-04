import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { BlogFilters } from '../types/blog.interface';


export function useBlogFilters() {
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get('search') as BlogFilters['search'];
    const category = searchParams.get('category') as BlogFilters['category'];

    const setFilters = useCallback((filters: BlogFilters) => {
            setSearchParams((params) => {
                if (filters.search) {
                    params.set('search', filters.search);
                } else if (filters.search === '' || filters.search === null || filters.search === undefined) {
                    params.delete('search');
                }

                if (filters.category) {
                    params.set('category', filters.category);
                } else if (filters.category === '' || filters.category === null || filters.category === undefined) {
                    params.delete('category');
                }

                if (filters.page) {
                    params.set('page', filters.page.toString());
                } else if (filters.page === undefined || filters.page === null) {
                   params.delete('page');
                }

                return params;
            });
    }, []);

    return {
        search,
        category,
        setFilters,
    };
}