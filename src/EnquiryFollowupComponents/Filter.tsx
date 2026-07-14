import type { Dispatch, SetStateAction } from 'react';

interface FilterProps {
    filters: {
        email: string;
        status: string;
        owner: string;
    };
    setFilters: Dispatch<SetStateAction<{
        email: string;
        status: string;
        owner: string;
    }>>;
}

export default function Filter({ filters, setFilters }: FilterProps) {
    return (
        <div style={{ marginBottom: "10px" }}>
            <strong>Filters:</strong>

            <input
                type="text"
                placeholder="Filter by Email"
                value={filters.email}
                onChange={(e) =>
                    setFilters(prev => ({ ...prev, email: e.target.value }))
                }
                style={{ marginLeft: "10px" }}
            />

            <input
                type="text"
                placeholder="Filter by Status"
                value={filters.status}
                onChange={(e) =>
                    setFilters(prev => ({ ...prev, status: e.target.value }))
                }
                style={{ marginLeft: "10px" }}
            />

            <input
                type="text"
                placeholder="Filter by Owner"
                value={filters.owner}
                onChange={(e) =>
                    setFilters(prev => ({ ...prev, owner: e.target.value }))
                }
                style={{ marginLeft: "10px" }}
            />
            <button
                onClick={() => setFilters({
                    email: "",
                    status: "",
                    owner: "",
                })}
                style={{ marginLeft: "10px" }}
            >
                Clear Filters
            </button>
        </div>
    )
}