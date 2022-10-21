import React, { useState } from 'react'
import classNames from "classnames";
import { Form } from 'react-bootstrap';
import dynamic from "next/dynamic";
const ModalFixedAmount = dynamic(() => import("./ModalFixedAmount"));
// const ModalPrice = dynamic(() =>
//     import("components/PaymentPages/inputModal/PriceInput")
// );
export default function ModalAddFiledInput({
    typeModal = "",
    className,
    text = "+ Add Input Field",
    listFieldType = {},
    onSetDataField = () => { },
    //modal
    isHideLabel = false,
    isDisabled = false,
    isAlert = false,
}) {

    // button
    const [isShowAddField, setIsShowAddField] = useState(false);
    const [isHoverListField, setIsHoverListField] = useState(false);

    const [isShowPopupFieldAmount, setIsShowPopupFieldAmount] = useState(false);
    const [isShowPopupItemQuantity, setIsShowPopupItemQuantity] = useState(false);
    const [isShowPopupFieldPrice, setIsShowPopupFieldPrice] = useState(false);


    const onClickAddField = (e) => {
        e.preventDefault();
        setIsShowAddField(!isShowAddField);
    };
    const renderListFieldType = () => {
        return (
            <ul className="dropdown-menu nav nav-stacked OptionsDropdown-list show top left" style={{ overflowY: 'auto' }}>
                <div className="OptionsDropdown-title">Select Input Type</div>
                {/* {listFieldType.includes("SingleLineText") && (
                    <li
                        className="OptionsDropdown-item"
                        onMouseEnter={() => setIsHoverListField("SingleLineText")}
                        onMouseLeave={() => setIsHoverListField(false)}
                        onClick={() => {
                            setIsShowPopupFieldAmount(true);
                            setIsShowAddField(false);
                        }}
                    >
                        <i className="i i-fixed_price"></i>
                        <span>Single Line Text</span>
                        <i className="i i-check"></i>
                    </li>
                )}
                {listFieldType.includes("Alphabets") && (
                    <li
                        className="OptionsDropdown-item"
                        onMouseEnter={() => setIsHoverListField("Alphabets")}
                        onMouseLeave={() => setIsHoverListField(false)}
                        onClick={() => {
                            setIsShowPopupFieldPrice(true);
                            setIsShowAddField(false);
                        }}
                    >
                        <i className="i i-fixed_price"></i>
                        <span>Alphabets</span>
                        <i className="i i-check"></i>
                    </li>
                )}
                {listFieldType.includes("Alphanumeric") && (
                    <li
                        className="OptionsDropdown-item"
                        onMouseEnter={() => setIsHoverListField("Alphanumeric")}
                        onMouseLeave={() => setIsHoverListField(false)}
                        // onClick={() => onOpenPopupAddField("ItemQuantity")}
                        onClick={() => {
                            setIsShowPopupItemQuantity(true);
                            setIsShowAddField(false);
                        }}
                    >
                        <i className="i i-multiple_purchase"></i>
                        <span>Alphanumeric</span>
                        <i className="i i-check"></i>
                    </li>
                )} */}
                {listFieldType.includes("Name") && (
                    <li
                        className="OptionsDropdown-item"
                        onMouseEnter={() => setIsHoverListField("Name")}
                        onMouseLeave={() => setIsHoverListField(false)}
                        // onClick={() => onOpenPopupAddField("ItemQuantity")}
                        onClick={() => {
                            setIsShowPopupItemQuantity(true);
                            setIsShowAddField(false);
                        }}
                    >
                        <i className="i i-multiple_purchase"></i>
                        <span>Name</span>
                        <i className="i i-check"></i>
                    </li>
                )}
                {listFieldType.includes("Email") && (
                    <li
                        className="OptionsDropdown-item"
                        onMouseEnter={() => setIsHoverListField("Email")}
                        onMouseLeave={() => setIsHoverListField(false)}
                        // onClick={() => onOpenPopupAddField("ItemQuantity")}
                        onClick={() => {
                            setIsShowPopupItemQuantity(true);
                            setIsShowAddField(false);
                        }}
                    >
                        <i className="i i-multiple_purchase"></i>
                        <span>Email</span>
                        <i className="i i-check"></i>
                    </li>
                )}
                {listFieldType.includes("Phone") && (
                    <li
                        className="OptionsDropdown-item"
                        onMouseEnter={() => setIsHoverListField("Phone")}
                        onMouseLeave={() => setIsHoverListField(false)}
                        // onClick={() => onOpenPopupAddField("ItemQuantity")}
                        onClick={() => {
                            setIsShowPopupItemQuantity(true);
                            setIsShowAddField(false);
                        }}
                    >
                        <i className="i i-multiple_purchase"></i>
                        <span>Phone</span>
                        <i className="i i-check"></i>
                    </li>
                )}
                {listFieldType.includes("Address") && (
                    <li
                        className="OptionsDropdown-item"
                        onMouseEnter={() => setIsHoverListField("Address")}
                        onMouseLeave={() => setIsHoverListField(false)}
                        // onClick={() => onOpenPopupAddField("ItemQuantity")}
                        onClick={() => {
                            setIsShowPopupItemQuantity(true);
                            setIsShowAddField(false);
                        }}
                    >
                        <i className="i i-multiple_purchase"></i>
                        <span>Address</span>
                        <i className="i i-check"></i>
                    </li>
                )}
                {/* {listFieldType.includes("LinkURL") && (
                    <li
                        className="OptionsDropdown-item"
                        onMouseEnter={() => setIsHoverListField("LinkURL")}
                        onMouseLeave={() => setIsHoverListField(false)}
                        // onClick={() => onOpenPopupAddField("ItemQuantity")}
                        onClick={() => {
                            setIsShowPopupItemQuantity(true);
                            setIsShowAddField(false);
                        }}
                    >
                        <i className="i i-multiple_purchase"></i>
                        <span>LinkURL</span>
                        <i className="i i-check"></i>
                    </li>
                )}
                {listFieldType.includes("LargeTextArea") && (
                    <li
                        className="OptionsDropdown-item"
                        onMouseEnter={() => setIsHoverListField("LargeTextArea")}
                        onMouseLeave={() => setIsHoverListField(false)}
                        // onClick={() => onOpenPopupAddField("ItemQuantity")}
                        onClick={() => {
                            setIsShowPopupItemQuantity(true);
                            setIsShowAddField(false);
                        }}
                    >
                        <i className="i i-multiple_purchase"></i>
                        <span>LargeTextArea</span>
                        <i className="i i-check"></i>
                    </li>
                )}
                {listFieldType.includes("PANNumber") && (
                    <li
                        className="OptionsDropdown-item"
                        onMouseEnter={() => setIsHoverListField("PANNumber")}
                        onMouseLeave={() => setIsHoverListField(false)}
                        // onClick={() => onOpenPopupAddField("ItemQuantity")}
                        onClick={() => {
                            setIsShowPopupItemQuantity(true);
                            setIsShowAddField(false);
                        }}
                    >
                        <i className="i i-multiple_purchase"></i>
                        <span>PANNumber</span>
                        <i className="i i-check"></i>
                    </li>
                )}
                {listFieldType.includes("PinCode") && (
                    <li
                        className="OptionsDropdown-item"
                        onMouseEnter={() => setIsHoverListField("PinCode")}
                        onMouseLeave={() => setIsHoverListField(false)}
                        // onClick={() => onOpenPopupAddField("ItemQuantity")}
                        onClick={() => {
                            setIsShowPopupItemQuantity(true);
                            setIsShowAddField(false);
                        }}
                    >
                        <i className="i i-multiple_purchase"></i>
                        <span>PinCode</span>
                        <i className="i i-check"></i>
                    </li>
                )}
                {listFieldType.includes("Dropdown") && (
                    <li
                        className="OptionsDropdown-item"
                        onMouseEnter={() => setIsHoverListField("Dropdown")}
                        onMouseLeave={() => setIsHoverListField(false)}
                        // onClick={() => onOpenPopupAddField("ItemQuantity")}
                        onClick={() => {
                            setIsShowPopupItemQuantity(true);
                            setIsShowAddField(false);
                        }}
                    >
                        <i className="i i-multiple_purchase"></i>
                        <span>Dropdown</span>
                        <i className="i i-check"></i>
                    </li>
                )}
                {listFieldType.includes("DatePicker") && (
                    <li
                        className="OptionsDropdown-item"
                        onMouseEnter={() => setIsHoverListField("DatePicker")}
                        onMouseLeave={() => setIsHoverListField(false)}
                        // onClick={() => onOpenPopupAddField("ItemQuantity")}
                        onClick={() => {
                            setIsShowPopupItemQuantity(true);
                            setIsShowAddField(false);
                        }}
                    >
                        <i className="i i-multiple_purchase"></i>
                        <span>DatePicker</span>
                        <i className="i i-check"></i>
                    </li>
                )} */}
            </ul>
        );
    };
    return (
        <div
            className={classNames(
                "buttonAddField dropdown d-inline-block",
                className
            )}
        >
            <Form className="Form">
                <div className="PaymentButtonForm-CustomerDetails Form-content">
                    <button
                        className="btn btn-default btn-squared-payment-button btn-outline-primary"
                        onClick={onClickAddField}
                    >
                        {text}
                    </button>
                    {isShowAddField && (
                        <div className="dropdown__content ">{renderListFieldType()}</div>
                    )}
                    {(isShowPopupFieldAmount ||
                        isShowPopupItemQuantity ||
                        isShowPopupFieldPrice) && (
                            <div className="EditableUDF EditableDisplayField">
                                <ModalFixedAmount
                                    isHideLabel={isHideLabel}
                                    typeModal={typeModal}
                                    typeInput={isHoverListField}
                                    classType="fixed"
                                    onHide={() =>
                                        isShowPopupFieldAmount
                                            ? setIsShowPopupFieldAmount(false)
                                            : isShowPopupItemQuantity
                                                ? setIsShowPopupItemQuantity(false)
                                                : setIsShowPopupFieldPrice(false)
                                    }
                                    setData={onSetDataField}
                                />
                            </div>
                        )}
                </div>
            </Form>
        </div>
    )
}
