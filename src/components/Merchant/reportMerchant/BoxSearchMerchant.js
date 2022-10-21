import React, { useRef } from 'react'
import { Row, Form, Col } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import DatePickerCustom from "components/common/DatePickerCustom/DatePickerCustom";
export default function BoxSearchMerchant({ valueSearch, handleChange, getListPayouts,  dateValue ,handleFromChange, handleToChange }) {
	const { t } = useTranslation("common");
	const toRef = useRef(null);
	const onSubmit = (e) => {
		e.preventDefault();
		getListPayouts()
	}
	return (
		<div className="box-search-payout">
			<Form onSubmit={onSubmit}>
				<Row>
					<Form.Group as={Col} xl="3" md="4" sm="6">
						<Form.Label>{t("Tìm kiếm")}</Form.Label>
						<Form.Control
							type="text"
							placeholder={t("Enter keywords")}
							name="keyword"
							value={valueSearch.keyword}
							onChange={handleChange}
						/>
					</Form.Group>
					<div className="form-group ml-3">
						<Form.Label>{t("Duration")}</Form.Label>
						<div className="date-picker-custom">
							<DatePickerCustom
								rangeDivider="-"
								from={dateValue?.from}
								to={dateValue?.to}
								toRef={toRef}
								onFromChange={handleFromChange}
								onToChange={handleToChange}
							/>
						</div>
					</div>
					<Form.Group as={Col} xl="2" md="4" sm="6">
						<Form.Label>{t("Loại")}</Form.Label>
						<Form.Control as="select" name="state" value={valueSearch.state} onChange={handleChange}>
							{/* <option value="">{t("All")} </option> */}
							<option value="EMAIL">{t("EMAIL")} </option>
							<option value="PHONE">{t("SDT")} </option>
							<option value="MCID">{t("MC ID")} </option>
							<option value="MERCHANTNAME">{t("tên Merchant")} </option>
							<option value="BRANDNAME">{t("BRANDNAME")} </option>

						</Form.Control>
					</Form.Group>
					{/* <Form.Group as={Col} xl="2" md="4" sm="6">
						<Form.Label>{t("Trạng Thái")}</Form.Label>
						<Form.Control as="select" name="kycState" value={valueSearch.kycState} onChange={handleChange}>
							<option value="">{t("All")} </option>
							<option value="PENDING">{t("PENDING")} </option>
							<option value="REJECT">{t("REJECT")} </option>
							<option value="CONTRACT">{t("CONTRACT")} </option>
							<option value="CONTRACT_SIGNED">{t("CONTRACT_SIGNED")} </option>
							<option value="CONTRACT_APPROVING">{t("CONTRACT_APPROVING")} </option>
							<option value="APPROVING">{t("APPROVING")} </option>

						</Form.Control>
					</Form.Group> */}
					<div className="d-flex align-items-center ml-3 ">
						<button className="btn btn-primary btn-search">
						<i className='fas fa-search'></i>{t("Tìm kiếm")}
						</button>
					</div>
				</Row>
			</Form>
		</div>

	)
}
