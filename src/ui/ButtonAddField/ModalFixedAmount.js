import React, { useEffect, useRef, useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
// import ModalConfirm from 'components/common/ModalAlert/ModalConfirm';
import ModalAddition from './ModalAddition';
// import ModalAdvanced from "components/PaymentPages/create/ModalAdvanced";

import classNames from 'classnames';
import { Fragment } from 'react';
import { event } from 'jquery';
// import ModalUploadImagePage from 'components/PaymentPages/create/ModalUploadImagePage';
import { checkStrSpecial, checkStrHasWord } from 'utils/helpers';
import { useSelector } from 'react-redux';
/**
 *
 * @param {*} className
 * @param {*} text
 * @param {*} listFieldType = [FixedAmount, ItemQuantity]
 * @returns
 */
function ModalFixedAmount({
  isHideLabel = false,
  onHide,
  setData,
  typeInput,
  typeModal,
  isUpdate = false,
  dataField = [],
  idxItem,
  onDeleteDataField,
  idItem,
}) {
  const dataUpdate = dataField && dataField[idxItem];
  const fieldDataCustomer = useSelector((state) => state.paymentButton.formAmountDetail);

  const [valueLabel, setValueLabel] = useState(
    dataUpdate?.valueLabel || (typeModal === 'PriceInput' && 'Amount') || ''
  );
  const [valueAmount, setValueAmount] = useState(dataUpdate?.valueAmount);
  const [valueOpt, setValueOpt] = useState({
    isOpt: dataUpdate?.valueOpt?.isOpt,
    desc: dataUpdate?.valueOpt?.desc,
    advanced: {
      isShow: dataUpdate?.valueOpt?.advanced?.isShow,
      limitedStock: dataUpdate?.valueOpt?.advanced?.limitedStock || false,
      stockAvail: dataUpdate?.valueOpt?.advanced?.stockAvail,
      isShowQuantityMinMax: dataUpdate?.valueOpt?.advanced?.isShowQuantityMinMax,
      min: dataUpdate?.valueOpt?.advanced?.min,
      max: dataUpdate?.valueOpt?.advanced?.max,
    },
    addImage: {
      isShow: dataUpdate?.valueOpt?.addImage?.isShow,
      dataSrcImg: dataUpdate?.valueOpt?.addImage?.dataSrcImg,
    },
  });
  const [isShowAdditionOpt, setIsShowAdditionOpt] = useState(false);
  const [formError, setFormError] = useState({});
  const prevStockAvailRef = useRef();
  useEffect(() => {
    prevStockAvailRef.current = valueOpt.advanced.stockAvail;
  }, []);

  const onClickCancel = () => onHide();
  const onShowAdditionOpt = () => setIsShowAdditionOpt(!isShowAdditionOpt);
  const onHideAdditionOpt = () => setIsShowAdditionOpt(false);

  const onChangeLabel = (e) => {
    const { value, name } = e.target;

    setValueLabel(value);
    validateString(value, name);
  };
  console.log('fieldDataCustomer >>>>>>', fieldDataCustomer, 'idxItem >> ', idxItem);
  const validateString = (str, name) => {
    str = str.trim();
    const _fieldDataCustomer = [...fieldDataCustomer];
    isUpdate && _fieldDataCustomer.splice(idxItem, 1);
    console.log('dataUpdate --->>>', _fieldDataCustomer, fieldDataCustomer, str, idxItem);

    const duplicateVal = _fieldDataCustomer.find((item) => item.valueLabel.trim() === str);

    if (str === '' || !str) {
      setFormError({
        ...formError,
        [name]: 'Please fill out this field',
      });
      return false;
    } else if (duplicateVal) {
      setFormError({
        ...formError,
        [name]: 'Field label cannot be same as other field',
      });
      return false;
    } else if (checkStrSpecial(str) !== null) {
      setFormError({
        ...formError,
        [name]: 'Please enter valid value',
      });
      return false;
    } else if (checkStrHasWord(str) === null) {
      setFormError({
        ...formError,
        [name]: 'Field label must have at least 1 character',
      });
      return false;
    } else {
      const { ..._formError } = formError;
      delete _formError[name];
      setFormError(_formError);
    }
  };
  const validateNumber = (num, name) => {
    console.log('num:', num);
    if (num === '' || !num) {
      setFormError({
        ...formError,
        [name]: 'Please fill out this field',
      });
      return false;
    } else {
      const { ..._formError } = formError;
      delete _formError[name];
      setFormError(_formError);
    }
  };
  const onChangeAmount = (e) => {
    const { value, name } = e.target;

    if (!value) {
      e.preventDefault();
    }
    const onlyNumberVal = value.replace(/[^\d,]/g, '');
    validateNumber(onlyNumberVal, name);
    setValueAmount(onlyNumberVal);
  };
  const onClickSubmit = (e) => {
    e.preventDefault();

    if (validateString(valueLabel, 'label') === false) return false;
    if (validateNumber(valueAmount, 'amount') === false) return false;
    setIsShowAdditionOpt(false);
    onHide();
    setData({ valueLabel, valueAmount, valueOpt, typeInput, typeModal });
  };

  const setOptionalItem = () => {
    setValueOpt((prev) => {
      return { ...prev, isOpt: !prev.isOpt };
    });
    onHideAdditionOpt();
  };

  const setOptionalDesc = () => {
    setValueOpt((prev) => ({ ...prev, desc: !prev.desc }));
    onHideAdditionOpt();
  };
  const setOptionalAdvanced = () => {
    setValueOpt((prev) => ({
      ...prev,
      advanced: { ...prev.advanced, isShow: !prev.advanced.isShow },
    }));
    onHideAdditionOpt();
  };

  const setOptionlAdvanced = (limitType, countUnit, min, max) => {
    setValueOpt((prev) => ({
      ...prev,
      advanced: {
        ...prev.advanced,
        stockAvail: limitType,
        limitedStock: countUnit,
        min: min,
        max: max,
        isShow: !prev.advanced.isShow,
      },
    }));
  };

  const setOptionalAddImage = () => {
    console.log('1111111111111111111');
    setValueOpt((prev) => ({
      ...prev,
      addImage: { ...prev.addImage, isShow: !prev?.addImage.isShow },
    }));

    onHideAdditionOpt();
  };

  const onGetDesc = (e) => {
    const { value } = e.target;
    console.log('value:', value);
    setValueOpt((prev) => ({ ...prev, desc: value }));
  };
  const toggleLimitedStock = (typeStock) => {
    setValueOpt((prev) => {
      return {
        ...prev,
        advanced: {
          ...prev.advanced,
          limitedStock:
            typeStock === 'limitStock' ? !prev.advanced.limitedStock : prev.advanced.limitedStock,
          isShowQuantityMinMax:
            typeStock === 'limitMinMax'
              ? !prev.advanced.isShowQuantityMinMax
              : prev.advanced.isShowQuantityMinMax,
        },
      };
    });
  };

  const onGetStockAvail = (e, typeStock) => {
    const { name, value } = e?.target;
    validateNumber(value, name);
    const onlyNumberVal = value.replace(/[^\d,]/g, '');

    const inputMaxVal = document.querySelector('[name=max]');
    const inputMinVal = document.querySelector('[name=min]');

    if (name === 'min' && inputMaxVal.value) {
      if ((inputMinVal && Number(inputMinVal.value)) > (inputMaxVal && Number(inputMaxVal.value))) {
        setFormError({
          ...formError,
          ['min>max']: 'Min purchase is more than Max limit',
        });
      } else {
        const { ..._formError } = formError;
        delete _formError['min>max'];
        setFormError(_formError);
      }
    } else {
      if ((inputMaxVal && Number(inputMaxVal.value)) < (inputMinVal && Number(inputMinVal.value))) {
        setFormError({
          ...formError,
          ['max<min']: 'Max purchase is less than Min limit',
        });
      } else {
        const { ..._formError } = formError;
        delete _formError['max<min'];
        setFormError(_formError);
      }
    }
    setValueOpt((prev) => ({
      ...prev,
      advanced: {
        ...prev.advanced,
        [name]: onlyNumberVal,
      },
    }));
  };
  const onCancelStockAvail = () => {
    setValueOpt((prev) => ({
      ...prev,
      advanced: {
        ...prev.advanced,
        stockAvail: prevStockAvailRef.current,
      },
    }));
  };
  const onConfirmStockAvail = () => (prevStockAvailRef.current = valueOpt.advanced.stockAvail);

  const [dataDropDown, setDataDropDown] = useState([{ dataType: '' }]);
  const [valueDataType, setValueDataType] = useState({
    dataType: '',
  });

  // const hanldeChangeDataDropDown = (e) => {

  //   setValueDataType({ ...dataDropDown, [e.target.name]: e.target.value })
  // }
  const onChangeDataDrop = (e, index) => {
    // console.log('event -- index',e.target.value , index);
    // setDataDropDown([{...dataDropDown[index],[e.target.name]:e.target.value}]);
    const value = {
      dataType: e.target.value,
    };
    const _dataDropDown = [...dataDropDown];
    _dataDropDown.splice(index, 1, value);
    setDataDropDown(_dataDropDown);
  };

  const addOptionDropdown = () => {
    // if(valueDataType.dataType !== ""){
    setDataDropDown(dataDropDown.concat(valueDataType));
    // }
  };

  const onDeleteDataDropDown = (index) => {
    console.log('index', index);
    const _dataDropDown = [...dataDropDown];
    _dataDropDown.splice(index, 1);
    setDataDropDown(_dataDropDown);
  };

  // add image
  const setDataImageShow = (imgUrl) => {
    console.log('imgUrl:', imgUrl);
    setValueOpt((prev) => ({
      ...prev,
      addImage: { ...prev.addImage, dataSrcImg: imgUrl },
    }));
  };

  return (
    <>
      {/* <ModalAdvanced isShow={true} /> */}
      {/* {typeModal === "PriceInput" ? (
        <ModalAdvanced />
      ) : (
        <ModalAddition
          valueOpt={valueOpt}
          setOptionalAdvanced={setOptionalAdvanced}
          onCancelStockAvail={onCancelStockAvail}
          onConfirmStockAvail={onConfirmStockAvail}
          toggleLimitedStock={toggleLimitedStock}
          onGetStockAvail={onGetStockAvail}
          typeInput={typeInput}
        />
      )} */}
      <ModalAddition
        formError={formError}
        valueOpt={valueOpt}
        setOptionalAdvanced={setOptionalAdvanced}
        onCancelStockAvail={onCancelStockAvail}
        onConfirmStockAvail={onConfirmStockAvail}
        toggleLimitedStock={toggleLimitedStock}
        onGetStockAvail={onGetStockAvail}
        typeInput={typeInput}
        typeModal={typeModal}
        setOptionalAddImage={setOptionalAddImage}
        setDataImageShow={setDataImageShow}
        setOptionlAdvanced={setOptionlAdvanced}
      />
      <div className='Modal-container Modal-container--CreatorModal-BaseForm ModalFixedAmount'>
        <div className='mimic-expand' />
        <div className='Modal-content Modal-content--PaymentButton-CreateForm'>
          <div className='Modal-body'>
            <Form
              noValidate
              onClick={onHideAdditionOpt}
              validated={true}
              className='Form'
              onSubmit={onClickSubmit}>
              <div className='InputGroup Input--vTop Input '>
                <div className='Input-content'>
                  <div className='Input-elWrapper'>
                    <Form.Group className='mb-0' as={Col} md='12'>
                      {!isHideLabel && (
                        <Form.Label className='fs-14 field-label-custom'>
                          Field Label
                          {valueOpt.isOpt && <div className='Input-desc m-0'>Optional</div>}
                        </Form.Label>
                      )}
                      <Form.Control
                        type='text'
                        value={valueLabel}
                        onChange={onChangeLabel}
                        name='label'
                      />
                      <div className='formError'>{formError.label}</div>
                    </Form.Group>
                  </div>
                </div>
              </div>

              <div className='InputGroup Input--vTop Input '>
                <div className='Input-content'>
                  <div className='Input-elWrapper'>
                    <Form.Group
                      className='mb-0 input-container icon-left position-relative'
                      as={Col}
                      md='12'>
                      {!isHideLabel && (
                        <Form.Label className='fs-14'>
                          <div className='Input-label' text='Title'>
                            Value (đ)
                          </div>
                        </Form.Label>
                      )}

                      {typeInput === 'PriceInput' && typeInput === 'Amount' ? (
                        <span className='input-icon icon-left'>₫</span>
                      ) : (
                        ''
                      )}

                      {typeInput === 'PriceInput' && typeInput === 'Amount' ? (
                        <div className='tooltip-custom' style={{ top: '5%', left: '-30%' }}>
                          ₫ - Vietnamese dong (VNĐ)
                        </div>
                      ) : (
                        ''
                      )}
                      {typeModal === 'Inputfield' &&
                        (typeInput === 'Name' ||
                          typeInput === 'Email' ||
                          typeInput === 'Phone' ||
                          typeInput === 'Address') && (
                          <Fragment>
                            <Form.Control
                              type='text'
                              placeholder='To be filled by customer'
                              disabled
                              style={{ paddingLeft: '20px' }}
                            />
                          </Fragment>
                        )}

                      {typeInput === 'PriceInput' && typeInput === 'Amount' ? (
                        <Fragment>
                          <Form.Control
                            type='number'
                            min='1'
                            value={valueAmount}
                            onChange={onChangeAmount}
                          />
                        </Fragment>
                      ) : typeInput === 'Dropdown' ? (
                        <Fragment>
                          <Form.Control
                            type='text'
                            placeholder='To be filled by customer'
                            disabled
                          />
                          <div className='in-content-dropdown mt-2'>
                            {/* <div className="input-dropdown">
                            <input type="text" className="form-control" name="dataType" value={valueDataType.dataType} onChange={hanldeChangeDataDropDown} />
                            <span className="icon-dele" onClick={() => onDeleteDataDropDown()}><i className="fa fa-times-circle"></i></span>
                          </div> */}
                            {dataDropDown?.map((item, index) => {
                              return (
                                <div key={index} className='input-dropdown'>
                                  <input
                                    type='text'
                                    className='form-control'
                                    name='dataType'
                                    value={item.dataType}
                                    onChange={(event) => onChangeDataDrop(event, index)}
                                  />
                                  <span
                                    className='icon-dele'
                                    onClick={() => onDeleteDataDropDown(index)}>
                                    <i className='fa fa-times-circle'></i>
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          <a
                            className='btn btn-link'
                            style={{ fontSize: '12px' }}
                            onClick={() => addOptionDropdown()}>
                            <i className='fa fa-hand-point-left'></i>Add Another Option
                          </a>
                        </Fragment>
                      ) : (
                        <Fragment>
                          {typeModal === 'Inputfield' &&
                          (typeInput === 'Name' ||
                            typeInput === 'Email' ||
                            typeInput === 'Phone' ||
                            typeInput === 'Address') ? (
                            ''
                          ) : (
                            <Fragment>
                              {valueOpt?.addImage?.dataSrcImg && (
                                <img
                                  style={{
                                    width: '35px',
                                    height: '35px',
                                    position: 'absolute',
                                    top: '2px',
                                    left: '-20px',
                                  }}
                                  src={
                                    process.env.NEXT_PUBLIC_API_UPLOAD +
                                    valueOpt?.addImage?.dataSrcImg
                                  }
                                  alt=''
                                />
                              )}
                              <Form.Control
                                type='text'
                                onChange={onChangeAmount}
                                value={valueAmount}
                                placeholder='To be filled by customer'
                                className='form-control-fixed-cus'
                                name='amount'
                              />
                              <div className='formError'>{formError.amount}</div>
                            </Fragment>
                          )}
                        </Fragment>
                      )}
                    </Form.Group>
                    <Form.Group
                      className='mb-0 input-container icon-left position-relative'
                      as={Col}
                      md='12'>
                      {valueOpt.desc && (
                        <Form.Control
                          type='text'
                          onChange={onGetDesc}
                          className='form-control form-control-sm mt-1'
                          placeholder='Enter field description'
                          style={{
                            borderRadius: '8px',
                            paddingLeft: '20px',
                          }}
                        />
                      )}
                    </Form.Group>
                  </div>
                </div>
                {typeInput === 'ItemQuantity' && (
                  <div className='Input--counterTooltip'>
                    <div className='Input-content Input--disabled Input-count'>
                      <button type='button' disabled>
                        <img
                          src='/assets/img/payment-button/controls-small-actions-add_2.svg'
                          alt=''
                        />
                      </button>
                      <input disabled defaultValue={0} className='input-width-min' />
                      <button type='button' disabled>
                        <img
                          src='/assets/img/payment-button/controls-small-actions-add.svg'
                          alt=''
                        />
                      </button>
                    </div>
                    <div className='rzp-popover  align-top rzp-tooltip theme-dark tooltip-count'>
                      <div className='rzp-tooltip-inner'>
                        <div
                          className='rzp-popover-arrow'
                          style={{ marginLeft: '0px', marginTop: '0px' }}
                        />
                        <div className='rzp-popover-content'>
                          <div className='rzp-popover-body'>
                            Customers can change Item quantity
                            <br />
                            (Min: 0, Max: No Limit)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className='CreatorModal-BaseForm-footer'>
                <a
                  onClick={onClickCancel}
                  className='btn btn-white btn-default btn-squared-payment-button btn-cancel-page mr-2'>
                  Cancel
                </a>
                <button
                  disabled={Object.keys(formError).length !== 0 ? true : false}
                  type='submit'
                  className='btn btn-primary'>
                  Save
                </button>
              </div>
            </Form>

            <div className='OptionsDropdown FieldOptionsDropdown'>
              <div className={`dropdown ${isShowAdditionOpt && 'dropdown--active'}`}>
                <a className='dropdown__trigger ' onClick={() => onShowAdditionOpt()}>
                  <a className='Button--transparent'>
                    <i className='fa fas fa-ellipsis-v' />
                  </a>
                </a>
                <div className='dropdown__content '>
                  {typeModal === 'PriceInput' ? (
                    <ul className='dropdown-menu nav nav-stacked OptionsDropdown-list'>
                      <div className='OptionsDropdown-title'>Additional Options</div>
                      <li
                        onClick={setOptionalAddImage}
                        className={classNames('OptionsDropdown-item', {
                          'OptionsDropdown-item--selected': valueOpt.addImage,
                        })}>
                        <div>Add Image</div>
                        {valueOpt.addImage && <i className='fas fa-check' />}
                      </li>

                      <li
                        onClick={setOptionalDesc}
                        className={classNames('OptionsDropdown-item', {
                          'OptionsDropdown-item--selected': valueOpt.desc,
                        })}>
                        <div>{valueOpt.desc ? 'Remove Description' : 'Add Description'}</div>
                        {valueOpt.desc && <i className='fas fa-check' />}
                      </li>
                      <li
                        onClick={setOptionalItem}
                        className={classNames('OptionsDropdown-item', {
                          'OptionsDropdown-item--selected': valueOpt.isOpt,
                        })}>
                        <div>Optional Item</div>
                        {valueOpt.isOpt && <i className='fas fa-check' />}
                      </li>

                      <li onClick={setOptionalAdvanced} className='OptionsDropdown-item'>
                        <div>Advanced Options</div>
                        <div className='subOption'>
                          Add quantity, define rules around quantity, etc.
                        </div>
                      </li>
                      {isUpdate && (
                        <li
                          onClick={() => {
                            onDeleteDataField();
                            onShowAdditionOpt();
                          }}
                          className='OptionsDropdown-item'>
                          <div className='OptionsDropdown-item--delete'>
                            <i className='i i-delete' />
                            <div>Delete Field</div>
                          </div>
                          <i className='i i-check' />
                        </li>
                      )}
                    </ul>
                  ) : (
                    <ul className='dropdown-menu nav nav-stacked OptionsDropdown-list'>
                      <div className='OptionsDropdown-title'>Additional Options</div>
                      <li
                        onClick={setOptionalItem}
                        className={classNames('OptionsDropdown-item', {
                          'OptionsDropdown-item--selected': valueOpt.isOpt,
                        })}>
                        <div>Optional Item</div>
                        {valueOpt.isOpt && <i className='fas fa-check' />}
                      </li>

                      <li
                        onClick={setOptionalDesc}
                        className={classNames('OptionsDropdown-item', {
                          'OptionsDropdown-item--selected': valueOpt.desc,
                        })}>
                        <div>{valueOpt.desc ? 'Remove Description' : 'Add Description'}</div>
                        {valueOpt.desc && <i className='fas fa-check' />}
                      </li>
                      <li onClick={setOptionalAdvanced} className='OptionsDropdown-item'>
                        <div>Advanced Options</div>
                      </li>
                      {isUpdate && (
                        <li
                          onClick={() => {
                            onDeleteDataField();
                            onShowAdditionOpt();
                          }}
                          className='OptionsDropdown-item'>
                          <div className='OptionsDropdown-item--delete'>
                            <i className='i i-delete' />
                            <div>Delete Field</div>
                          </div>
                          <i className='i i-check' />
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='CreatorModal-BaseForm' onClick={onHideAdditionOpt}></div>
    </>
  );
}

export default ModalFixedAmount;
