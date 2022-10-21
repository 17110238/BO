import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
interface DataTableCsToolProps {
  t?: any;
  data: any[];
  totalFilter: number;
  onRowSelected?: () => void;
  deleteDefault?: boolean;
  setSubmitForm?: (a: boolean) => void;
  getDataList?: (
    start?: number,
    limit?: number,
    sort?: {}
  ) => {
    payload: any;
    getList: (payload: any) => void;
  };
  onChangeActiveUser?: (e: any, data: any) => void;
  rest?: any;
  filter?: any;
  heightBoxSearch?: number;
  onCheckUpdate?: () => void;
  onPreviewImg?: any;
}
interface FormLoginSubmit {
  username?: string;
  password: string;
  repassword?: string;
  fullname?: string;
  phone?: number | string;
  email?: string;
  gender?: any;
  birthday?: Date | null;
  isActive?: any;
  role: string[];
  group?: string[] | any;
  scope: string[];
}

export default function DataTableCsTool({
  // t,
  data,
  totalFilter,
  onChangeActiveUser,
  getDataList,
  onCheckUpdate,
  onPreviewImg,
  ...rest
}: DataTableCsToolProps) {
  const { t } = useTranslation('common');

  const handleErrorImage: React.ReactEventHandler<any> = (e) => {
    const target = e.target as any;
    target.src = '/assets/images/img-na.png';
    target.onerror = null;
  };

  return (
    <div className='group-1'>
      <div className='data-table-custom-cs-tool-dashboard'>
        {data?.map((list: any, index: number) => {
          let dataRow = list?.jsonContent && JSON?.parse(list?.jsonContent);
          let dataAssignTargetAffter;
          let dataEmailAfter;
          let dataStatusAfter;
          let dataFeeBackAfter;
          let dataLevelAffter;
          if (dataRow) {
            dataLevelAffter = dataRow?.after?.level;
            dataAssignTargetAffter = dataRow?.after?.assignTarget;
            dataEmailAfter = dataRow?.after?.customerEmail;
            dataStatusAfter = dataRow?.after?.status;
            dataFeeBackAfter = dataRow?.after?.feedbackContent;
          }

          return (
            <div key={index} className='cs-tool-dashboard-item'>
              <div className='cs-infor-support'>
                <div className='dot'>
                  <span></span>{' '}
                </div>
                <div className='cs-date-time'>
                  {dayjs(list?.createdAt).format('HH:mm:ss DD/MM/YYYY')}
                </div>
              </div>
              <div className='cs-wrapper'>
                <div className='cs-content-tilte'>
                  {list?.jsonContent ? (
                    <>
                      <b>{list?.ownerName}</b> đã {list?.content.toLowerCase()}
                    </>
                  ) : (
                    <div className='content-email-container'>
                      <b>{list?.ownerName}</b> đã {list?.content.split(':')[0].toLowerCase()}
                      <div
                        className='content-email'
                        dangerouslySetInnerHTML={{ __html: list?.content.split(':')[1] }}></div>
                    </div>
                  )}
                </div>
                {dataRow && (
                  <div className='cs-content'>
                    {dataAssignTargetAffter && (
                      <div className='cs-content-assigntarget'>
                        Phân công: {t(dataAssignTargetAffter)}
                      </div>
                    )}
                    {dataLevelAffter && (
                      <div
                        className='cs-content-assigntarget'
                        style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        Cấp độ{' '}
                        <span
                          className={
                            dataLevelAffter === 'CRITICAL' ? 'text-danger' : 'text-normal'
                          }>
                          <i className='fas fa-circle'></i>
                          <span style={{ marginLeft: '12px' }}>{t(dataLevelAffter)}</span>
                        </span>
                      </div>
                    )}
                    {dataEmailAfter && (
                      <div className='cs-content-customerEmail'>
                        Cập nhật email :{dataEmailAfter}
                      </div>
                    )}
                    {dataStatusAfter && (
                      <div className='cs-content-status'>
                        Trạng thái:{' '}
                        <div
                          className={`${
                            dataStatusAfter === 'OPEN'
                              ? 'state-refunded-modal'
                              : dataStatusAfter === 'RESOLVED' ||
                                dataStatusAfter === 'USED' ||
                                dataStatusAfter === 'CLAIMED' ||
                                dataStatusAfter === 'AUTHORIZED'
                              ? 'state-success-modal'
                              : dataStatusAfter === 'PROCESSING' || dataStatusAfter === 'NEW'
                              ? 'state-pending-modal'
                              : dataStatusAfter === 'CANCELED_SUCCEEDED'
                              ? 'state-cancel-modal'
                              : 'state-cancel-modal'
                          } `}>
                          {dataStatusAfter ? t(dataStatusAfter) : '-'}
                        </div>
                      </div>
                    )}
                    {dataFeeBackAfter && (
                      <div className='cs-content-feedbackContent'>Phản hồi: {dataFeeBackAfter}</div>
                    )}
                  </div>
                )}
                {list?.attachImages?.length > 0 && (
                  <div className='cs-attack-img'>
                    <div style={{ flex: 1, whiteSpace: 'nowrap' }}>
                      <b>{list?.ownerName}</b> đã thêm {list?.attachImages?.length} hình ảnh
                    </div>
                    <div className='image-groups'>
                      {
                        <div
                          className={
                            list?.attachImages?.length >= 4 ? 'imgGetLog scrollX' : 'imgGetLog'
                          }>
                          <div className='image-groups'>
                            {list?.attachImages &&
                              list?.attachImages?.map((img: string, index: number) => {
                                return !img.endsWith('pdf') ? (
                                  <div className='row-img-preview' data-index={index} key={index}>
                                    <img
                                      onClick={(e) => onPreviewImg(e)}
                                      src={
                                        img?.startsWith('http')
                                          ? img
                                          : process.env.NEXT_PUBLIC_API_UPLOAD + img
                                      }
                                      alt='img-kyc'
                                      onError={handleErrorImage}
                                    />
                                  </div>
                                ) : (
                                  <>
                                    <div className='row-img-preview' key={index}>
                                      <a href={img} target='_blank'>
                                        <img
                                          style={{ width: 'unset' }}
                                          src='/assets/img/pdf-icon.png'
                                        />
                                      </a>
                                    </div>
                                  </>
                                );
                              })}
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
