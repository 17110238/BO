import ModalCreateSuportTicket from 'components/CsTool/AddTicket/index';
import useElementSize from 'hook/useElementSize';
import { useRouter } from 'next/router';
import React, { useEffect, useState, MouseEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  getFilterValueCustomerSupport,
  getListCustomerSupport,
  getSupportStaff,
} from 'redux/actions';
import Viewer from 'viewerjs';
import { clearFalsyObject } from 'utils/helpers/replaceUrl';
import BoxSearchSupportTicket from './BoxSearchSupportTicket';
import DataTableSupportTicket from './DataTableSupportTicket';
import HeaderSupportTicket from './HeaderSupportTicket';
interface Payload {
  filter: {
    method?: string | null;
    state?: string | null;
  };
  paging: {
    start: number;
    limit: number;
  };
  sort: {
    createdAt: number;
  };
}
export interface SearchParams {
  contactPhone?: number | string;
  status?: string;
  ticketType?: string | any;
  assignTarget?: string | any;
  method?: string;
  classify?: string;
  category?: string;
  createdAt?: {
    from?: any;
    to?: any;
  };
}

const SupportTicketContainer: React.FC = (props: any) => {
  const { t } = useTranslation('common');
  const [showFilter, setShowFilter] = useState<boolean>(true);
  const toggleFilter = () => setShowFilter(!showFilter);
  const dispatch = useDispatch();
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const [totalRow, setTotalRow] = useState<number>(0);
  const [squareRef, { width, height }] = useElementSize();
  const [listDetailCsSuport, setListDetailCustomerSupport] = useState([]);
  const loading = useSelector<boolean>((state: any) => state?.customerSupport?.loading);
  const [filter, setFilter] = useState<any | string[]>({});
  const [staffSuport, setStaffSuport] = useState<string[] | any>([]);
  const [show, setShow] = useState<boolean>(false);
  const [img, setImg] = useState<string>('');
  const viewer = useRef<any>();
  const router = useRouter();

  const handleHileCreateTicket = () => {
    setShow(!show);
  };

  const handleSubmitForm = () => {
    setSubmitForm(true);
  };

  const handlePreviewImg = (e: React.MouseEvent<HTMLDivElement>, row?: any) => {
    viewer.current && viewer.current.show();
    const target = e.target as HTMLDivElement;
    const src = target.getAttribute('src')
    setImg(src || '');
  };

  const handleSubmitSearch = (data: SearchParams | any) => {
    const { ticketId } = data;
    if (ticketId) {
      data.id = +data.ticketId;
      delete data?.ticketId;
    }
    let payload = clearFalsyObject({ ...data });
    setFilter({ ...payload });
    setSubmitForm(true);
  };

  const handleDetailCustomerSupport = (start?: number, limit?: number, sort?: {}) => {
    const payload = {
      filter: filter,
      paging: {
        start: start!,
        limit: limit!,
      },
    };

    function handleDetailCustomerSupport(payload: any) {
      dispatch(
        getListCustomerSupport(payload, (status, res) => {
          setListDetailCustomerSupport(res);
          setTotalRow(res.length);
          setSubmitForm(false);
        })
      );
    }

    return {
      payload,
      getList: handleDetailCustomerSupport,
      submitForm,
      setSubmitForm,
    };
  };

  useEffect(() => {
    setSubmitForm(true);
    dispatch(getFilterValueCustomerSupport(() => {}));
    dispatch(
      getSupportStaff((status, res) => {
        setStaffSuport(res.map((el: any) => ({ value: el, label: el })));
      })
    );
  }, []);

  useEffect(() => {
    // let data: SearchParams = Router.query;
    const params = { ...router.query };
    if (Object.keys(router.query).length) {
      delete params.to;
      delete params.from;

      const payload = clearFalsyObject({
        ...params,
        id: +router.query?.ticketId!,
        createdAt: {
          from: router.query?.from,
          to: router.query?.to,
        },
      });
      delete payload?.ticketId;
      setFilter(payload);
      setSubmitForm(true);
    }
  }, []);

  useEffect(() => {
    const previewBlock = document.querySelector('.preview-identity-imgg') as HTMLElement;
    viewer.current = new Viewer(previewBlock, {
      zIndex: 10000,
      title: false,
      button: false,
      toolbar: {
        zoomIn: 1,
        zoomOut: 1,
        oneToOne: 1,
        reset: 1,
        prev: 0,
        play: 0,
        next: 0,
        rotateLeft: 1,
        rotateRight: 1,
        flipHorizontal: 1,
        flipVertical: 1,
      },
    });
    return () => {
      viewer.current && viewer.current.hide();
    };
  }, []);

  useEffect(() => {
    viewer.current && viewer.current.update();
  }, [img]);

  return (
    <div className='supplierContainer box-content customer-support-ticket-container update-ticket-wrrapper'>
      <div className='preview-identity-imgg d-none ' style={{ zIndex: '10000' }}>
        <img src={img} alt='prevew-img' />
      </div>

      <HeaderSupportTicket
        onOpenCreate={handleHileCreateTicket}
        showFilter={showFilter}
        toggleFilter={toggleFilter}
      />

      {showFilter && (
        <BoxSearchSupportTicket
          showFilter={showFilter}
          submitForm={submitForm}
          handleSubmitSearch={handleSubmitSearch}
          loading={loading}
          setSubmitForm={setSubmitForm}
          boxSearchRef={squareRef}
          supportStaff={staffSuport}
        />
      )}

      <DataTableSupportTicket
        t={t}
        data={listDetailCsSuport}
        totalFilter={totalRow}
        getDataList={handleDetailCustomerSupport}
        setSubmitForm={setSubmitForm}
        onSubmitForm={handleSubmitForm}
        heightBoxSearch={height + 1}
        loading={loading}
        onPreviewImg={handlePreviewImg}
      />
      <ModalCreateSuportTicket
        onSubmitForm={handleSubmitForm}
        show={show}
        onHide={handleHileCreateTicket}
        onPreviewImg={handlePreviewImg}
      />
    </div>
  );
};

export default SupportTicketContainer;
