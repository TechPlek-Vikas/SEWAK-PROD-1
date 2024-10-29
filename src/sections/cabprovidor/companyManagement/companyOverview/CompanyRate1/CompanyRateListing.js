import { useEffect, useState } from 'react';
import axios from 'axios';
// assets
import { Button, CircularProgress, Stack } from '@mui/material';
import CompanyRateReactTable from './CompanyRateReactTable';
import Header from 'components/tables/genericTable/Header';
import WrapperButton from 'components/common/guards/WrapperButton';
import { Add } from 'iconsax-react';
import CompanyRate from './CompanyRate';
import axiosServices from 'utils/axios';

// ==============================|| REACT TABLE - EDITABLE CELL ||============================== //

const token = localStorage.getItem('serviceToken');

const CompanyRateListing = ({ companyName, id }) => {
  const [data, setData] = useState([]);
  const [skipPageReset, setSkipPageReset] = useState(false);
  const [companyRate, setCompanyRate] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [updateKey, setUpdateKey] = useState(0);
  const [loading, setLoading] = useState('true');
  const [showCompanyList, setShowCompanyList] = useState(false); // State to manage which component to show

  useEffect(() => {
    const fetchdata = async () => {
      const response = await axiosServices.get(`/company/unwind/rates?companyId=${id}`);
      setCompanyList(response.data.data);
      setLoading(false);
      console.log('response.data', response.data.data);
    };

    fetchdata();
  }, [id]);

  const handleAddRate = () => {
    setShowCompanyList(true);
  };

  useEffect(() => {
    setSkipPageReset(false);
  }, [data]);
  useEffect(() => {}, [companyRate]);

  return (
    <>
      {!showCompanyList ? ( // Conditional rendering based on showCompanyList state
        <Stack gap={1} spacing={1}>
          <Header OtherComp={({ loading }) => <ButtonComponent loading={loading} onAddRate={handleAddRate} />} />

          {companyList.length !== 0 && (
            <CompanyRateReactTable
              data={companyList}
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
              updateKey={updateKey}
              setUpdateKey={setUpdateKey}
              loading={loading}
            />
          )}
        </Stack>
      ) : (
        <CompanyRate id={id} companyName={companyName} /> // Render CompanyList1 when the state is true
      )}
    </>
  );
};

export default CompanyRateListing;

const ButtonComponent = ({ loading, onAddRate }) => {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <WrapperButton>
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Add />}
          onClick={onAddRate} // Call the onAddRate function when button is clicked
          size="small"
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Loading...' : ' Add Rate'}
        </Button>
      </WrapperButton>
    </Stack>
  );
};
