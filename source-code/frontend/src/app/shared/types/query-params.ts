export interface Sort {
    field: string;
    direction: 'asc' | 'desc' | 'asc nulls first' | 'desc nulls first' | 'asc nulls last' | 'desc nulls last';
}