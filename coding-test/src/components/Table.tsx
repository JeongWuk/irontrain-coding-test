import React, { useEffect, useRef, useState } from "react";
import { tableColumnNames } from "../data/data"
import { User } from "../types/type"

interface TableProps {
  data: User[];
  loadMoreData: () => void;
}

const Table = ({ data, loadMoreData }: TableProps) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const tableRef = useRef<HTMLTableSectionElement | null>(null);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({x: 0, y: 0});

  const handleRowClick = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  }

  const handleScroll = (e) => {
    if (tableRef.current) {
      const scrollTop = e.target.scrollTop;
      const clientHeight = e.target.clientHeight;
      const scrollHeight = e.target.scrollHeight;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        loadMoreData();
      }
    }
  };

  const handleSetTooltip = (e: React.MouseEvent, email: string) => {
    const { clientX, clientY } = e;
    setTooltipPosition({x: clientX, y: clientY});
    if (email.length > 20) {
      setTooltip(email);
    }
  }

  return (
    <>
      <div>
        <table border={1} className="relative">
          <thead className="bg-[#DDD] h-8 flex items-center">
            <tr>
              {tableColumnNames.map((tableColumnName) => {
                return (
                  tableColumnName.name === '' ? (
                    <th key={`${tableColumnName.id}-column`} className="px-2"><input type="checkbox" /></th>
                  ) : (
                    <th key={`${tableColumnName.id}-column`} className={`w-[${tableColumnName.width}px] text-left`}>{tableColumnName.name}</th>
                  )
                ) 
              })}
            </tr>
          </thead>
          <tbody ref={tableRef} onScroll={handleScroll} className="overflow-y-scroll h-[500px] block">
            {data.map((user) => {
              return (
                <React.Fragment key={user.id}>
                  <tr className="hover:bg-gray-100 table" onClick={() => handleRowClick(user.id)}>
                    <td className="text-center p-2 border-b"><input type="checkbox" /></td>
                    <td className="px-0 py-2 border-b w-[100px]">{user.firstname}</td>
                    <td className="px-0 py-2 border-b w-[100px]">{user.lastname}</td>
                    <td 
                      className="px-0 py-2 border-b w-[200px] relative" 
                      onMouseEnter={(e) => handleSetTooltip(e, user.email)}
                      onMouseLeave={() => setTooltip(null)}
                      >
                      {user.email.length > 20 ? user.email.slice(0, 20) + "..." : user.email}
                    </td>
                    <td className="px-0 py-2 border-b w-[200px]">{user.phone}</td>
                    <td className="px-0 py-2 border-b w-[100px]">{user.birthday}</td>
                    <td className="px-0 py-2 border-b w-[100px]">{user.gender}</td>
                  </tr>
                  {expandedRow === user.id && (
                    <tr>
                      <td colSpan={7} className="px-4 py-2 border-b bg-gray-50">
                        <div>
                          <strong>Address:</strong>
                          <p>{user.address.street} {user.address.streetName}, {user.address.buildingNumber}</p>
                          <p>{user.address.city}, {user.address.zipcode}</p>
                          <p>{user.address.country} ({user.address.country_code})</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
      {tooltip && (
        <div
          className={`absolute top-[${tooltipPosition.y}] left-[${tooltipPosition.x}] transform -translate-x-1/2 mt-2 px-4 py-2 bg-gray-500 text-white rounded`}
          style={{ zIndex: 999 }}
        >
          {tooltip}
        </div>
      )}
    </>
  )
}

export default Table