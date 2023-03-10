import React, { useEffect, useState } from 'react';


interface IWrapperProps {
  name?: string
  children: React.ReactNode
}

function Toolbar(props:IWrapperProps) {
  return (
    <div>
      { props.children }
    </div>
  )
}

interface TableColumn {
  header: string;
  key: string;
  sortable?: boolean;
  align?: string | 'left' | 'center' | 'right';
}

interface TableRow {
  [key: string]: any;
}

interface TableProps {
  columns: TableColumn[];
  data: TableRow[];
  defaultSortKey?: string;
  defaultSortOrder?: 'asc' | 'desc';
  multipleSelecion?: boolean
}



const Table: React.FC<TableProps> = ({
  columns,
  data,
  defaultSortKey = '',
  defaultSortOrder = 'asc',
  multipleSelecion = false
}) => {
  const [sortKey, setSortKey] = useState<string>(defaultSortKey);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(defaultSortOrder);

  const [selectedRows, setSelectedRows] = useState<TableRow[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredData, setFilteredData] = useState<TableRow[]>([]);

  const handleSearch = (value: string) => {
    const lowerCaseValue = value.toLowerCase();
    const filteredData = data.filter(row => {
      return columns.some(column => {
        const cellValue = row[column.key].toString().toLowerCase();
        return cellValue.includes(lowerCaseValue);
      });
    });
    setFilteredData(filteredData);
    setSearchValue(value);
  };

  const sortedData = data.sort((a, b) => {
    const valueA = a[sortKey];
    const valueB = b[sortKey];

    if (valueA < valueB) {
      return sortOrder === 'asc' ? -1 : 1;
    } else if (valueA > valueB) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });

  useEffect(() => {
    setFilteredData(sortedData);
  }, [sortedData]);

  const handleSort = (key: string) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleRowClick = (row: TableRow) => {
    const index = selectedRows.findIndex((r) => r === row);
    if (index === -1) {
      setSelectedRows([...selectedRows, row]);
    } else {
      const rows = [...selectedRows];
      rows.splice(index, 1);
      setSelectedRows(rows);
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...data]);
    }
  };

 

  const renderMultipleSelectHeader = () => {
    if (!multipleSelecion) {
      return null
    }

    return (
     <th style={{ textAlign: 'center' }}>
        <input
        type="checkbox"
        checked={selectedRows.length === data.length}
        onChange={handleSelectAll} 
        />
      </th>
    )
  }

   const renderMultipleSelectRow = (row:any) => {
    if (!multipleSelecion) {
      return null
    }

    return (
      <td style={{ textAlign: 'center' }}>
        <input
        type="checkbox"
        checked={selectedRows.includes(row)}
        onChange={() => {}}
      />
      </td>
    )
  }


  return (
    <div>
      <Toolbar>
        { selectedRows.length < 1 ? (
          <input type="text" value={searchValue} onChange={e => handleSearch(e.target.value)}  placeholder="Search..." />
        ) : (
          <span> { selectedRows.length } of { filteredData.length } items selected </span>
        ) }
      </Toolbar>
      <table>
        <thead>
          <tr>
            {renderMultipleSelectHeader()}
            {columns.map(column => (
              <th
                key={column.key}
                onClick={() => column.sortable && handleSort(column.key)}
                style={{ textAlign: column.align ?? 'left' }}
              >
                {column.header}
                {column.sortable && (
                  <span style={{ marginLeft: '5px' }}>
                    {sortKey === column.key
                      ? sortOrder === 'asc'
                        ? '▲'
                        : '▼'
                      : ''}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <tr key={index} onClick={() => handleRowClick(row)}>
              {renderMultipleSelectRow(row)}
              {columns.map(column => (
                <td
                  key={column.key}
                  style={{ textAlign: column.align ?? 'left' }}
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
