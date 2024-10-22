import PropTypes from 'prop-types';
import MainCard from 'components/MainCard';
import { useFormik, FormikProvider, Form } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import InvoiceSettingsFormContent from './InvoiceSettingsFormContent';
import { Box, Button, CircularProgress, DialogActions, DialogContent, DialogTitle, Grid, Stack } from '@mui/material';
import CustomCircularLoader from 'components/CustomCircularLoader';
import { useNavigate } from 'react-router';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { width } from '@mui/system';

export const TAX_TYPE = {
  INDIVIDUAL: 'Individual',
  GROUP: 'Group'
};

export const DISCOUNT_TYPE = {
  ...TAX_TYPE,
  NO: 'No'
};

const DISCOUNT_BY = {
  PERCENTAGE: 'Percentage',
  AMOUNT: 'Amount'
};

export const STATUS = {
  YES: 1,
  NO: 0
};

const SETTINGS = {
  invoice: {
    preFix: 'INV',
    invoiceNumber: 1
  },

  tax: {
    // apply: TAX_TYPE.INDIVIDUAL,
    apply: TAX_TYPE.GROUP
  },
  discount: {
    apply: DISCOUNT_TYPE.INDIVIDUAL,
    // apply: DISCOUNT_TYPE.GROUP,
    // by: DISCOUNT_BY.PERCENTAGE,

    by: DISCOUNT_BY.AMOUNT
  },
  additionalCharges: STATUS.YES,
  roundOff: STATUS.YES
};

const getInitialValues = (data) => {
  return {
    taxType: data?.tax?.apply || TAX_TYPE.INDIVIDUAL,
    discountType: data?.discount?.apply || DISCOUNT_TYPE.NO,
    discountBy: data?.discount?.by || DISCOUNT_BY.PERCENTAGE,
    additionalCharges: data?.additionalCharges || STATUS.NO,
    roundOff: data?.roundOff || STATUS.NO,
    invoicePrefix: data?.invoice?.preFix || 'INV',
    invoiceNumber: data?.invoice?.invoiceNumber || 1
  };
};

const InvoiceSetting = ({ redirect, onClose }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log('Api call for get settings');
    (async () => {
      setLoading(true);
      // TODO : Get settings from API
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setSettings(SETTINGS);

      setLoading(false);
      console.log('Api call done .......');
    })();
  }, []);

  console.log('settings', settings);

  const handleFormikSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      console.log('Formik submit', values);

      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log('Formik submit done .......');

      const payload = {
        data: {
          ...values
        }
      };
      console.log(`🚀 ~ handleFormikSubmit ~ payload:`, payload);

      if (redirect) {
        // TODO : Update settings API
        console.log('Update API call');
      } else {
        // TODO : Create settings API
        console.log('Create API call');
      }

      const response = {
        status: 200
      };

      if (response.status === 200) {
        resetForm();

        setSubmitting(false);

        dispatch(
          openSnackbar({
            open: true,
            message: `Settings ${redirect ? 'updated' : 'saved'} successfully`,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );

        if (redirect) {
          onClose();
          navigate(redirect, { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }

      resetForm();
    } catch (error) {
      console.log('Error at handleFormikSubmit: ', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: getInitialValues(settings),
    enableReinitialize: true,
    onSubmit: handleFormikSubmit
  });


  // Memoized helper function for button label
  const buttonLabel = useMemo(() => {
    if (formik.isSubmitting) {
      return redirect ? 'Updating...' : 'Saving...';
    }
    return redirect ? 'Save & Continue' : 'Save';
  }, [formik.isSubmitting, redirect]);

  return (
    <>
      {loading ? (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh'
            }}
          >
            <CustomCircularLoader />
          </Box>
        </>
      ) : (
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
            <MainCard title={redirect ? 'Set Your Transaction Preferences' : 'Create Invoice Settings'}>
              <Stack gap={3}>
                <InvoiceSettingsFormContent redirect={redirect} />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Stack direction="row" spacing={2} justifyContent={'flex-end'}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={formik.isSubmitting}
                      startIcon={formik.isSubmitting && <CircularProgress size={20} />}
                    >
                      {buttonLabel}
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </MainCard>
          </Form>
        </FormikProvider>
      )}
    </>
  );
};

InvoiceSetting.propTypes = {
  redirect: PropTypes.string,
  onClose: PropTypes.func
};

export default InvoiceSetting;
