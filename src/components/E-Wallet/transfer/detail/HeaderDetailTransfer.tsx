import React from 'react';
import 'react-tabs/style/react-tabs.css';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
interface HeaderMultitransferCampaignProps {
  detailId?: string | string[];
  totalInfo: any;
  showFilter?: boolean;
  toggleFilter?: () => void;
  onOpenTransferModal: () => void;
}
import formatCurrency from 'utils/helpers/formatCurrency';

const HeaderDetailTransfer: React.FC<HeaderMultitransferCampaignProps> = ({
  detailId,
  onOpenTransferModal,
  totalInfo
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();

  return (
    <div className='header-multitransfer-campaign-container'>
      <p
        className='header-multitransfer-campaign__title d-flex align-items-center'
        onClick={() => router.back()}
      >
        <i className="fas fa-chevron-left fa-sm mr-1 pr-1"></i>
        {t(`Chi tiết chuyển theo danh sách #${detailId}`)}
      </p>
      <div className='header-multitransfer-campaign__btn-group'>
        <p className='title'>
          Số tiền:
          <span> {formatCurrency(totalInfo.totalAmount)}</span>
        </p>
        <p className='title'>
          Số tiền hợp lệ:
          <span> {formatCurrency(totalInfo.totalValidAmount)} đ</span>
        </p>
        <button
          className='btn mutlitransfer-list-btn ml-3'
          onClick={onOpenTransferModal}
        >
          {/* <i className="fas fa-wallet"></i> */}
          Chuyển
        </button>
      </div>
    </div>
  );
};

export default HeaderDetailTransfer;
