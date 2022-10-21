import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Form, Row, Col } from "react-bootstrap";
import classNames from "classnames";
const ModalFixedAmount = dynamic(() => import("./ModalFixedAmount"));
// const ModalPrice = dynamic(() =>
//   import("components/PaymentPages/inputModal/PriceInput")
// );

// import {}
/**
 *
 * @param {*} className
 * @param {*} text
 * @param {*} listFieldType = [FixedAmount, ItemQuantity]
 * @returns
 */
function ButtonAddField({
  typeModal = '',
  idItem,
  className,
  text = 'Add Amount Field',
  listFieldType = {},
  onSetDataField = () => {},
  additionOptData,
  // modal
  isHideLabel = false,
  isDisabled = false,
  isAlert = false,
  setDataImageShow,
}) {
  // button
  const [isShowAddField, setIsShowAddField] = useState(false);
  const [isHoverListField, setIsHoverListField] = useState(false);

  const [isShowPopupFieldAmount, setIsShowPopupFieldAmount] = useState(false);
  const [isShowPopupItemQuantity, setIsShowPopupItemQuantity] = useState(false);
  const [isShowPopupFieldPrice, setIsShowPopupFieldPrice] = useState(false);

  // modal

  const onClickAddField = (e) => {
    e.preventDefault();
    setIsShowAddField(!isShowAddField);
  };

  const renderListFieldType = () => {
    return (
      <ul className='dropdown-menu dropdown-menu-field nav nav-stacked OptionsDropdown-list show top left'>
        <div className='OptionsDropdown-title'>Select Amount Type</div>
        {listFieldType.includes('FixedAmount') && (
          <li
            className='OptionsDropdown-item'
            onMouseEnter={() => setIsHoverListField('FixedAmount')}
            onMouseLeave={() => setIsHoverListField(false)}
            onClick={() => {
              setIsShowPopupFieldAmount(true);
              setIsShowAddField(false);
            }}>
            <img src='/assets/img/payment-button/icon-fix-amount.svg' alt='' />
            <span>Fixed Amount</span>
            <i className='i i-check'></i>
          </li>
        )}
        {listFieldType.includes('DecideAmount') && (
          <li
            className='OptionsDropdown-item'
            onMouseEnter={() => setIsHoverListField('DecideAmount')}
            onMouseLeave={() => setIsHoverListField(false)}
            onClick={() => {
              setIsShowPopupFieldPrice(true);
              setIsShowAddField(false);
            }}>
            <img src='/assets/img/payment-button/glyphs-nav-toolbar-account.svg' alt='' />

            <span>Customers Decide Amount</span>
          </li>
        )}
        {listFieldType.includes('ItemQuantity') && (
          <li
            className='OptionsDropdown-item'
            onMouseEnter={() => setIsHoverListField('ItemQuantity')}
            onMouseLeave={() => setIsHoverListField(false)}
            // onClick={() => onOpenPopupAddField("ItemQuantity")}
            onClick={() => {
              setIsShowPopupItemQuantity(true);
              setIsShowAddField(false);
            }}>
            <img src='/assets/img/payment-button/icon-package.svg' alt='' />
            <span>Item with Quantity</span>
            <i className='i i-check'></i>
          </li>
        )}

        {isHoverListField && (
          <div className='info'>
            {isHoverListField === 'FixedAmount' && (
              <>
                <h4>Fixed Amount</h4>
                <p>add a field which contains the price value which customer should pay</p>
              </>
            )}
            {isHoverListField === 'DecideAmount' && (
              <>
                <h4>Customers Decide Amount</h4>
                <p>Add a free field which helps customer to fill a amount which they wish to pay</p>
              </>
            )}
            {isHoverListField === 'ItemQuantity' && (
              <>
                <h4>Item with Quantity</h4>
                <p>
                  add a field which price quantity selection widget to facilitate to purchase
                  multiple quantites
                </p>
              </>
            )}
          </div>
        )}
      </ul>
    );
  };
  return (
    <div className={classNames('buttonAddField dropdown d-inline-block', className)}>
      <Form className='Form'>
        <div className='PaymentButtonForm-CustomerDetails Form-content'>
          <button
            className='btn btn-default btn-add-plant__item btn-squared-payment-button btn-primary'
            onClick={onClickAddField}>
            {typeModal !== 'PriceInput' && (
              <img src='/assets/img/payment-button/add-icon.png' alt='' className='mr-2' />
            )}
            {text}
          </button>
          {isShowAddField && <div className='dropdown__content '>{renderListFieldType()}</div>}
          {(isShowPopupFieldAmount || isShowPopupItemQuantity || isShowPopupFieldPrice) && (
            <div className='EditableUDF EditableDisplayField'>
              <ModalFixedAmount
                isHideLabel={isHideLabel}
                typeModal={typeModal}
                typeInput={isHoverListField}
                classType='fixed'
                onHide={() =>
                  isShowPopupFieldAmount
                    ? setIsShowPopupFieldAmount(false)
                    : isShowPopupItemQuantity
                    ? setIsShowPopupItemQuantity(false)
                    : setIsShowPopupFieldPrice(false)
                }
                setData={onSetDataField}
                setDataImageShow={setDataImageShow}
                idItem={idItem}
              />
            </div>
          )}
          {/* {isShowPopupFieldPrice && (
            <ModalPrice
              type={isHoverListField}
              classType="fixed"
              onHide={setIsShowPopupFieldPrice}
              setData={onSetDataField}
              isHideLabel={isHideLabel}
            />
          )} */}
        </div>
      </Form>
    </div>
  );
}

export default ButtonAddField;
