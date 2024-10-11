import EmptyTableDemo from 'components/tables/EmptyTable';
import TableSkeleton from 'components/tables/TableSkeleton';
import Error500 from 'pages/maintenance/error/500';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ZoneTable from 'sections/cabprovidor/master/zone/ZoneTable';
import { fetchZoneNames } from 'store/slice/cabProvidor/ZoneNameSlice';
const Zone = () => {
  const dispatch = useDispatch();
  const { zoneNames, metaData, loading, error } = useSelector((state) => state.zoneName);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [lastPageNo, setLastPageNo] = useState(Math.ceil(metaData.totalCount / metaData.limit) || 1);
  const [updateKey, setUpdateKey] = useState(0);

  useEffect(() => {
    dispatch(fetchZoneNames());
  }, [dispatch, updateKey]);

  if (loading) return <TableSkeleton rows={10} columns={5} />;
  if (error) return <Error500 />;
  if (zoneNames.length === 0) return <EmptyTableDemo />;

  return (
    <ZoneTable
      data={zoneNames}
      page={page}
      setPage={setPage}
      limit={limit}
      setLimit={setLimit}
      lastPageNo={lastPageNo}
      setLastPageNo={setLastPageNo}
      updateKey={updateKey}
      setUpdateKey={setUpdateKey}
    />
  );
};

export default Zone;
