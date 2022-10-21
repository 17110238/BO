
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { deleteTopTransaction } from "redux/actions/eWalletTransactionTopReport";
import AgentContainer from "./reportTopAgent/AgentContainer";
import TransactionContainer from "./reportTransaction/TransactionContainer";
interface Props {
    isShowFilter: boolean
}
const ReportSystemContainer = ({ isShowFilter }: Props) => {
    const [tabIndex, setTabIndex] = useState(0);
    const dispatch = useDispatch()
    const { t } = useTranslation('common');
    return (
        <>
            <div className="quantityMerchantContainerReport" style={{position:'relative'}}>
                <Tabs selectedIndex={tabIndex} onSelect={tabIndex => setTabIndex(tabIndex)}>
                    <TabList id='idTabListAction1' >
                        <div className='d-flex' style={{ cursor: 'pointer' }}>
                            <Tab>{t("Báo cáo đại lý")} </Tab>
                            <Tab>{t("Báo cáo giao dịch")}</Tab>
                        </div>
                    </TabList>
                    <TabPanel><AgentContainer isShowFilter={isShowFilter} /></TabPanel>
                    <TabPanel><TransactionContainer isShowFilter={isShowFilter} /></TabPanel>
                </Tabs>

            </div>
        </>
    )
}

export default ReportSystemContainer