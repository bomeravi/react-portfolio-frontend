import { useEffect, useState } from 'react';

import { useDebounce } from '@/hooks/useDebounce';
import { useBlogFilters } from '@/features/blog/hooks/useBlogFilters';
import type { BlogFilters } from '../types/blog.interface';

export default function BlogListFilters() {
    const { search, category, setFilters } = useBlogFilters();

    const [localSearch, setLocalSearch] =
        useState<BlogFilters['search']>(search);
    const debouncedSearch = useDebounce(localSearch);

    useEffect(() => {
        setFilters({ search: debouncedSearch });
    }, [debouncedSearch, setFilters]);

    return (
        <div className= "flex flex-row gap-2" >
        <input
                type="text"
    value = { localSearch }
    onChange = {(e) => setLocalSearch(e.target.value)
}
placeholder = "Search blogs"
    />

    </div>
    );

    //     <select
//                 value={ category }
// onChange = {(e) =>
// setFilters({ category: e.target.value as BlogFilters['category'] })
//                 }
//             >
//     <option value="" > All </option>
//         </select>
}