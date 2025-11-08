import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { FilterList as FilterListIcon } from '@mui/icons-material';
import { TableColumn, TableFilter } from '../types/organization.types';

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  error?: string | null;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onRowClick?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  actions?: {
    edit?: boolean;
    delete?: boolean;
    view?: boolean;
  };
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  error = null,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onSort,
  sortBy,
  sortOrder,
  onRowClick,
  onEdit,
  onDelete,
  actions = { edit: true, delete: true, view: true },
}: DataTableProps<T>) {
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map(col => col.field as string))
  );
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const visibleColumnsArray = useMemo(() => {
    return columns.filter(col => visibleColumns.has(col.field as string));
  }, [columns, visibleColumns]);

  const handleColumnToggle = (field: string) => {
    setVisibleColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(field)) {
        newSet.delete(field);
      } else {
        newSet.add(field);
      }
      return newSet;
    });
  };

  const handleSelectAllColumns = () => {
    setVisibleColumns(new Set(columns.map(col => col.field as string)));
  };

  const handleDeselectAllColumns = () => {
    setVisibleColumns(new Set());
  };

  const handleSort = (column: string) => {
    if (!onSort) return;
    
    const isActive = sortBy === column;
    const newDirection = isActive && sortOrder === 'asc' ? 'desc' : 'asc';
    onSort(column, newDirection);
  };

  const renderCellContent = (row: T, column: TableColumn<T>) => {
    const value = row[column.field as keyof T];
    
    if (column.render) {
      return column.render(value, row);
    }
    
    if (column.format) {
      return column.format(value);
    }
    
    return value as React.ReactNode;
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="h2">
            Data Table
          </Typography>
          <IconButton onClick={() => setFilterDialogOpen(true)} color="primary">
            <FilterListIcon />
          </IconButton>
        </Box>
        
        <Table>
          <TableHead>
            <TableRow>
              {visibleColumnsArray.map((column) => (
                <TableCell
                  key={String(column.field)}
                  sortDirection={sortBy === column.field ? sortOrder : false}
                >
                  {onSort ? (
                    <TableSortLabel
                      active={sortBy === column.field}
                      direction={sortBy === column.field ? sortOrder : 'asc'}
                      onClick={() => handleSort(column.field as string)}
                    >
                      {column.headerName}
                    </TableSortLabel>
                  ) : (
                    column.headerName
                  )}
                </TableCell>
              ))}
              {(actions.edit || actions.delete || actions.view) && (
                <TableCell align="right">Actions</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={visibleColumnsArray.length + 1} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={visibleColumnsArray.length + 1} align="center">
                  <Typography color="text.secondary">
                    No data available
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => (
                <TableRow
                  key={index}
                  hover
                  onClick={() => onRowClick?.(row)}
                  sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {visibleColumnsArray.map((column) => (
                    <TableCell key={String(column.field)}>
                      {renderCellContent(row, column)}
                    </TableCell>
                  ))}
                  {(actions.edit || actions.delete || actions.view) && (
                    <TableCell align="right">
                      {actions.view && (
                        <Button size="small" onClick={(e) => { e.stopPropagation(); onRowClick?.(row); }}>
                          View
                        </Button>
                      )}
                      {actions.edit && onEdit && (
                        <Button size="small" onClick={(e) => { e.stopPropagation(); onEdit(row); }}>
                          Edit
                        </Button>
                      )}
                      {actions.delete && onDelete && (
                        <Button 
                          size="small" 
                          color="error" 
                          onClick={(e) => { e.stopPropagation(); onDelete(row); }}
                        >
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={total}
          rowsPerPage={pageSize}
          page={page - 1} // Material-UI uses 0-based indexing
          onPageChange={(_, newPage) => onPageChange(newPage + 1)}
          onRowsPerPageChange={(event) => onPageSizeChange(parseInt(event.target.value, 10))}
        />
      </TableContainer>

      {/* Column Filter Dialog */}
      <Dialog 
        open={filterDialogOpen} 
        onClose={() => setFilterDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Filter Columns
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Button 
              size="small" 
              onClick={handleSelectAllColumns}
              sx={{ mr: 1 }}
            >
              Select All
            </Button>
            <Button 
              size="small" 
              onClick={handleDeselectAllColumns}
            >
              Deselect All
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {columns.map((column) => (
              <FormControlLabel
                key={String(column.field)}
                control={
                  <Checkbox
                    checked={visibleColumns.has(column.field as string)}
                    onChange={() => handleColumnToggle(column.field as string)}
                  />
                }
                label={column.headerName}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => setFilterDialogOpen(false)} 
            variant="contained"
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}