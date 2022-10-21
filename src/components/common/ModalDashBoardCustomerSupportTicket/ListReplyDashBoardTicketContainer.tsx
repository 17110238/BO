import Nodata from 'components/common/NoData/Nodata';
import dayjs from 'dayjs';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getRelyDashBoardTicket } from 'redux/actions';
import Viewer from 'viewerjs';
interface Props {
  id?: number | any;
  filter?: {
    method?: string | null;
    state?: string | null;
  };
  paging?: {
    start: number;
    limit: number;
  };
  sort?: {
    createdAt: number;
  };
  checkAddTicket?: boolean;
  onCheckUpdate?: (data: boolean) => void;
}

const ListReplyTicketContainer: React.FC<Props> = ({ id, checkAddTicket, onCheckUpdate }) => {
  const { t } = useTranslation('common');
  const dispatch = useDispatch();
  const [listDetailReply, setListDetailReply] = useState([]);
  const [userHelper, setUserHelper] = useState<number>();

  useEffect(() => {
    if (checkAddTicket) {
      dispatch(
        getRelyDashBoardTicket({ filter: { ticketId: id } }, (status, res) => {
          if (status) {
            setListDetailReply(res);
          }
        })
      );
      onCheckUpdate && onCheckUpdate(false);
    }
  }, [checkAddTicket]);

  useEffect(() => {
    const payload = {
      filter: { ticketId: id },
      paging: {
        start: 0,
        limit: 100,
      },
    };
    dispatch(
      getRelyDashBoardTicket(payload, (status, res) => {
        if (status) {
          setListDetailReply(res);
          setUserHelper(res[0]?.accountInfo?.id);
        }
      })
    );
  }, []);

  const viewer = useRef<any>();
  const [img, setImg] = useState<string>('');

  useEffect(() => {
    const previewBlock = document.querySelector('.preview-identity-img2') as HTMLElement;
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

  const handlePreviewImg = (e: MouseEvent<any>, row?: any) => {
    viewer.current && viewer.current.show();
    const target = e.target as any;
    setImg(row);
  };

  const handleErrorImage: React.ReactEventHandler<any> = (e) => {
    const target = e.target as any;
    target.src = '/assets/images/img-na.png';
    target.onerror = null;
  };

  return (
    <div className='supplierContainer box-content listReplyDashboardTicketContainer'>
      <div className='preview-identity-img2 d-none' style={{ zIndex: '10000' }}>
        <img src={img} alt='' />
      </div>
      {listDetailReply
        ?.slice(0)
        .reverse()
        ?.map((data: any,index:number) => {
          return (
            <div
            key={index}
              className={
                data?.accountInfo?.id === userHelper
                  ? 'reply-item-container right'
                  : 'reply-item-container left'
              }>
              <div className='reply-time'>
                {data?.createdAt ? dayjs(data?.createdAt).format('HH:mm:ss DD/MM/YYYY') : '-'}
              </div>
              <div className='reply-chat'>
                <div className='reply-chart-avatar'>
                  <img
                    onError={handleErrorImage}
                    src={
                      data?.accountInfo?.avatar
                        ? data?.accountInfo?.avatar
                        : '/assets/images/img-na.png'
                    }
                    alt='No avartar'
                  />
                </div>
                <div
                  className='reply-chat-wrap'
                  style={data?.content.length > 100 ? { borderRadius: 10 } : {}}>
                  <span>
                    {data?.accountInfo?.name ? data?.accountInfo?.name : data?.accountInfo?.id}
                  </span>
                  <p>{data?.content ? data?.content : '-'}</p>
                </div>
                {data?.images && (
                  <div className='reply-img'>
                    <div className={'imgGetLog'}>
                      <div className='image-groups'>
                        {data?.images &&
                          data?.images?.map((img: string, index: number) => {
                            return !img.endsWith('pdf') ? (
                              <div
                                className='row-img-preview'
                                data-index={index}
                                key={index}
                                onClick={(e) =>
                                  handlePreviewImg(
                                    e,
                                    img.startsWith('http')
                                      ? img
                                      : process.env.NEXT_PUBLIC_API_UPLOAD + img
                                  )
                                }>
                                <img
                                  src={
                                    img.startsWith('http')
                                      ? img
                                      : process.env.NEXT_PUBLIC_API_UPLOAD + img
                                  }
                                  alt='img-kyc'
                                  onError={handleErrorImage}
                                />
                              </div>
                            ) : (
                              <div className='row-img-preview' key={index}>
                                <a href={img} target='_blank'>
                                  <img style={{ width: 'unset' }} src='/assets/img/pdf-icon.png' />
                                </a>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      {listDetailReply?.length == 0 && (
        <Nodata imageDataEmpty={''} messageDataEmpty={'Không có phản hồi nào!!!'} />
      )}
    </div>
  );
};

export default ListReplyTicketContainer;
