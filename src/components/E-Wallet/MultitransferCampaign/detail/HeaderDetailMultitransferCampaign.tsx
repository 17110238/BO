import React from 'react';
import 'react-tabs/style/react-tabs.css';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
interface HeaderDetailMultitransferCampaignProps {
  showFilter?: boolean;
  toggleFilter?: () => void;
}

const HeaderDetailMultitransferCampaign: React.FC<HeaderDetailMultitransferCampaignProps> = ({

}) => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const renderTooltip = (props: any) => (
    <Tooltip id="button-tooltip" {...props}>
      {t("Quản lý chuyển theo danh sách")}
    </Tooltip>
  );

  return (
    <div className='header-multitransfer-campaign-container'>
      <p className='header-multitransfer-campaign__title d-flex align-items-center'>
        <OverlayTrigger
          placement="bottom"
          delay={{ show: 250, hide: 400 }}
          overlay={renderTooltip}
        >
          <i
            className="fas fa-chevron-left fa-sm mr-1 pr-1"
            onClick={() => router.back()}
          ></i>
        </OverlayTrigger>
        {t('Chi tiết chuyển')}
      </p>
    </div>
  );
};

export default HeaderDetailMultitransferCampaign;
