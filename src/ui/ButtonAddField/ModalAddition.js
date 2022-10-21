import ModalConfirm from 'components/common/ModalAlert/ModalConfirm';
// import ModalAdvanced from "components/PaymentPages/create/ModalAdvanced";
// import ModalAddImages from 'components/PaymentPages/create/ModalUploadImagePage';
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

function ModalAddition({
  valueOpt,
  setOptionalAdvanced,
  onCancelStockAvail,
  onConfirmStockAvail,
  toggleLimitedStock,
  onGetStockAvail,
  typeInput,
  typeModal,
  setOptionalAddImage,
  setDataImageShow,
  setOptionlAdvanced,
  formError,
}) {
  console.log('typeModal:', typeModal, typeModal === 'PriceInput');
  console.log('Value opt -> ModalAddition', valueOpt);
  //   {typeModal === "PriceInput" && <ModalAdvanced />}
  if (typeModal === 'PriceInput') {
    return (
      <>
        {/* <ModalAdvanced
          show={valueOpt.advanced.isShow}
          handleClose={(e) => {
            setOptionalAdvanced();
            onCancelStockAvail();
          }}
          typeInput={typeInput}
          setOptionlAdvanced={setOptionlAdvanced}
        /> */}
        {/* <ModalAddImages
          show={valueOpt?.addImage?.isShow}
          handleClose={(e) => {
            setOptionalAddImage();
          }}
          typeInput={typeInput}
          setDataImageShow={setDataImageShow}
        /> */}
      </>
    );
  }
  if (typeModal === 'PriceInput') {
    console.log('typeModal ModalAddImages');
    //return (
    // <ModalAddImages
    //   show={valueOpt?.addImage?.isShow}
    //   handleClose={(e) => {
    //     setOptionalAddImage();
    //   }}
    //   typeInput={typeInput}
    //   setDataImageShow={setDataImageShow}
    // />
    //);
  }
  return (
    <>
      {/* <ModalAddImages
        show={valueOpt?.addImage?.isShow}
        handleClose={(e) => {
          setOptionalAddImage();
        }}
        typeInput={typeInput}
        setDataImageShow={setDataImageShow}
      /> */}
      <ModalConfirm
        isShow={valueOpt.advanced.isShow}
        onCancel={(e) => {
          setOptionalAdvanced();
          onCancelStockAvail();
        }}
        onOk={() => {
          if (Object.keys(formError).length > 0) {
            return false;
          }
          if (valueOpt.advanced.limitedStock && valueOpt.advanced.stockAvail) {
            onConfirmStockAvail();
            setOptionalAdvanced();
          }
          if (!valueOpt.advanced.limitedStock) {
            onConfirmStockAvail();
            setOptionalAdvanced();
          }
        }}
        title='ADVANCED OPTIONS'
        message={
          <>
            <Form
              className='modal-amount-details'
              onSubmit={(e) => {
                e.preventDefault();
              }}>
              <div className='checkbox-theme-default custom-checkbox my-3'>
                <input
                  className='checkbox'
                  type='checkbox'
                  id='check-2'
                  checked={valueOpt.advanced.limitedStock ? true : false}
                  onChange={() => toggleLimitedStock('limitStock')}
                />
                <label htmlFor='check-2' className='fs-17'>
                  <span className='checkbox-text'> Item has Limited stock</span>
                </label>
              </div>

              <div>
                {valueOpt.advanced.limitedStock && (
                  <input
                    onChange={onGetStockAvail}
                    className='form-control'
                    type='text'
                    name='stockAvail'
                    placeholder='Add stock availability here'
                    value={valueOpt.advanced.stockAvail}
                  />
                )}
              </div>
              {typeInput === 'ItemQuantity' && (
                <>
                  <div className='checkbox-theme-default custom-checkbox my-3'>
                    <input
                      className='checkbox'
                      type='checkbox'
                      id='check-3'
                      checked={valueOpt.advanced.isShowQuantityMinMax ? true : false}
                      onChange={() => toggleLimitedStock('limitMinMax')}
                    />
                    <label htmlFor='check-3' className='fs-17'>
                      <span className='checkbox-text'> Limit quantity per order</span>
                    </label>
                  </div>

                  <div>
                    {valueOpt.advanced.isShowQuantityMinMax && (
                      <>
                        <div className='InputGroup InputGroup--inline Input--limits Input'>
                          <div className='Input--limits-content'>
                            <div className='Input'>
                              <div className='Input-content'>
                                <div className='Input-elWrapper'>
                                  <input
                                    name='min'
                                    onChange={onGetStockAvail}
                                    value={valueOpt.advanced.min || ''}
                                    pattern='\d+'
                                    type='text'
                                    placeholder='0'
                                    className='form-control'
                                    defaultValue
                                  />
                                  <span className='Input-addons Input-addons--after'>Min</span>
                                  <div className='formError'>{formError['min>max']}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <span className='separator'>-</span>
                          <div className='Input--limits-content'>
                            <div className='Input'>
                              <div className='Input-content'>
                                <div className='Input-elWrapper'>
                                  <input
                                    name='max'
                                    onChange={onGetStockAvail}
                                    value={valueOpt.advanced.max || ''}
                                    type='text'
                                    pattern='\d+'
                                    placeholder='No Limit'
                                    className='form-control'
                                    defaultValue
                                  />
                                  <span className='Input-addons Input-addons--after'>Max</span>
                                  <div className='formError'>{formError['max<min']}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </Form>
          </>
        }
      />
    </>
  );
}

export default ModalAddition;
