import LoadingFullScreen from 'components/common/Loading/LoadingFullScreen';
import { FilterLoginHistory, InputLoginHistory, LoginHistoryTypes } from 'models';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';




const queryGraphql: string = `subscription subExportLoginHistory {
SubExport{
  SubExportExcel{
      message
      succeeded
      type
      accountId
      url
      data
    }
  }
}`;
export default function LoginHistoryContainer() {
  const dispatch = useDispatch();
  const { query } = useRouter();
  const { t } = useTranslation('common');
  const { reset, control, handleSubmit, formState, register } = useForm<any>({});
  const [totalRow, setTotalRow] = useState<number>(0);
  const [listData, setListData] = useState<Array<LoginHistoryTypes>>([]);
  const [submitForm, setSubmitForm] = useState(false);
  const [filter, setFilter] = useState<FilterLoginHistory>({});
  const [loadingExport, setLoadingExport] = useState(false);
  
  const listBlock = [
    'http://betmomo.club/',
    'http://www/dlthanglong.com/',
    'https://chanle247.com/',
    'https://chanlemomo.win/',
    'https://chanletaixiu.net/',
    'https://cltxuytin.win/',
    'https://momo10s.com/',
    'https://momoloto.club/',
    'http://x102.net/',
    'http://taixiumomo.com/',
    'http://CLMM247.COM',
    'http://MOMO5S.COM'
  ]

  return (
    <>
      {loadingExport && <LoadingFullScreen />}
      <div className='loginHistory-container'>
        {/* <LoginHistoryHeader
          t={t}
          control={control}
          formState={formState}
          handleSubmit={handleSubmit}
          handleSearchLoginHistory={handleSearchLoginHistory}
          register={register}
          reset={reset}
          handleExportFile={handleExportFile}
        /> */}
        <div className='loginHistory-header'>
        <div className='loginHistory-header__title'>
          <h3>{t('Danh s??ch li??n quan ?????n ho???t ?????ng ????nh b???c v?? x??? s???')}</h3>
        </div>
        <div className='loginHistory-header__filter'>
          
        </div>
      </div>
        
        <div className='loginHistory-content' style={{padding: '25px'}}>
          <div style={{height:'500px', overflow: 'scroll'}}>
        <table className='table-list-block-user'>
	<tbody>
		<tr>
			<td>V&iacute; li&ecirc;n quan</td>
			<td>T&ecirc;n ch??? v&iacute;</td>
			<td>CMND/CCCD</td>
			<td>Ng&agrave;y sinh</td>
			<td>?????a ch???</td>
			<td>Th??? ng&acirc;n h&agrave;ng li&ecirc;n k???t</td>
			<td>Ng&acirc;n h&agrave;ng</td>
		</tr>
		<tr>
			<td>879055360</td>
			<td>PH???M QUANG TRUNG</td>
			<td>164419204</td>
			<td>17/01/1992</td>
			<td>X&Atilde; NINH PH&Uacute;C TP. NINH B&Igrave;NH, NINH B&Igrave;NH</td>
			<td>422109xxxxxx6627</td>
			<td>ACB</td>
		</tr>
		<tr>
			<td>879052610</td>
			<td>VU THANH TUNG</td>
			<td>113454749</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>422109xxxxxx6627</td>
			<td>ACB</td>
		</tr>
		<tr>
			<td>879052609</td>
			<td>PH???M THU H&Agrave;</td>
			<td>031195003331</td>
			<td>23/09/1995</td>
			<td>181 C&Aacute;T LINH, L????NG KH&Ecirc; 7 TR&Agrave;NG C&Aacute;T, H???I AN, H???I PH&Ograve;NG</td>
			<td>453618xxxxxx4981</td>
			<td>SCB</td>
		</tr>
		<tr>
			<td>879052612</td>
			<td>PH???M THU H&Agrave;</td>
			<td>031195003331</td>
			<td>23/09/1995</td>
			<td>181 C&Aacute;T LINH, L????NG KH&Ecirc; 7 TR&Agrave;NG C&Aacute;T, H???I AN, H???I PH&Ograve;NG</td>
			<td>453618xxxxxx7130</td>
			<td>SCB</td>
		</tr>
		<tr>
			<td>879052611</td>
			<td>NGUY???N &Aacute;I PH????NG TH???O</td>
			<td>080191000364</td>
			<td>13/02/1991</td>
			<td>61/15 K&Ecirc;NH 19/5, S??N K??? T&Acirc;N PH&Uacute;, TP.H??? CH&Iacute; MINH</td>
			<td>453618xxxxxx7130</td>
			<td>SCB</td>
		</tr>
		<tr>
			<td>879055206</td>
			<td>NGUY???N &Aacute;I PH????NG TH???O</td>
			<td>080191000364</td>
			<td>13/02/1991</td>
			<td>61/15 K&Ecirc;NH 19/5, S??N K??? T&Acirc;N PH&Uacute;, TP.H??? CH&Iacute; MINH</td>
			<td>453618xxxxxx7130</td>
			<td>SCB</td>
		</tr>
		<tr>
			<td>879055206</td>
			<td>NGUY???N &Aacute;I PH????NG TH???O</td>
			<td>080191000364</td>
			<td>13/02/1991</td>
			<td>61/15 K&Ecirc;NH 19/5, S??N K??? T&Acirc;N PH&Uacute;, TP.H??? CH&Iacute; MINH</td>
			<td>453618xxxxxx4740</td>
			<td>SCB</td>
		</tr>
		<tr>
			<td>879055209</td>
			<td>TRINH THI THAI</td>
			<td>215182053</td>
			<td>27/10/1960</td>
			<td>KV5 P.TR???N QUANG-DI???U, TP.QUY NH??N, B&Igrave;NH ?????NH</td>
			<td>453618xxxxxx4740</td>
			<td>SCB</td>
		</tr>
		<tr>
			<td>879055208</td>
			<td>TRINH THI THAI</td>
			<td>215182053</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>453618xxxxxx4740</td>
			<td>SCB</td>
		</tr>
		<tr>
			<td>877002803</td>
			<td>TRAN VAN DUC</td>
			<td>036200008194</td>
			<td>&nbsp;</td>
			<td>0</td>
			<td>453618xxxxxx8560</td>
			<td>SCB</td>
		</tr>
		<tr>
			<td>1284054485</td>
			<td>V?? TH&Agrave;NH TRUNG</td>
			<td>220750031</td>
			<td>17/12/1975</td>
			<td>T??? 4 KHU 3, H???NG GIA H&Agrave; LONG, QU???NG NINH</td>
			<td>994488333</td>
			<td>VBP</td>
		</tr>
		<tr>
			<td>1247257088</td>
			<td>NGUY???N QUANG KH&Aacute;NH</td>
			<td>271322596</td>
			<td>08/10/1980</td>
			<td>?????I R&Igrave;U, TH&Agrave;NG G&Ograve;N, TX.LONG KH&Aacute;NH, ?????NG NAI</td>
			<td>38015360810</td>
			<td>SCB</td>
		</tr>
		<tr>
			<td>1252791445</td>
			<td>L?????NG V??N THAO</td>
			<td>82294068</td>
			<td>10/11/1995</td>
			<td>X&Atilde; L???C TH&Ocirc;N, HUY???N L???C B&Igrave;NH, T???NH L???NG S??N</td>
			<td>38051251011</td>
			<td>SCB</td>
		</tr>
		<tr>
			<td>1666965290</td>
			<td>NGUY???N THANH PHONG</td>
			<td>122154634</td>
			<td>05/01/1995</td>
			<td>X&Atilde; HO&Agrave;NG AN HUY???N HI???P H&Ograve;A, B???C GIANG</td>
			<td>1017526268</td>
			<td>VCB</td>
		</tr>
		<tr>
			<td>1625746397</td>
			<td>NGUY???N H???U ?????C</td>
			<td>197340576</td>
			<td>25/09/1995</td>
			<td>PH&Uacute; &Acirc;N H???I TH&Aacute;I, GIO KINH, QU???NG TR???</td>
			<td>1018399696</td>
			<td>VCB</td>
		</tr>
		<tr>
			<td>1682205861</td>
			<td>L&Ecirc; PHI</td>
			<td>225806312</td>
			<td>26/03/1995</td>
			<td>PH&Uacute;C TH???Y, CAM PH&Uacute;C NAM, CAM RANH, KH&Aacute;NH H&Ograve;A</td>
			<td>422151xxxxxx8048</td>
			<td>sacombank</td>
		</tr>
		<tr>
			<td>1274678686</td>
			<td>NGUY???N TH??? L???I</td>
			<td>14301001199</td>
			<td>24/07/2004</td>
			<td>TDP QUY???T TI???N, TH??? TR???N EA P???K, C?? M&#39;GAR, D???K L???K</td>
			<td>9704151543939730</td>
			<td>VTB</td>
		</tr>
		<tr>
			<td>1644444445</td>
			<td>LUONG THI KIM NGAN</td>
			<td>221465265</td>
			<td>29/05/1998</td>
			<td>TH&Ocirc;N 4, XU&Acirc;N H???I, TX S&Ocirc;NG C???U, PH&Uacute; Y&Ecirc;N</td>
			<td>19981307777</td>
			<td>TPB</td>
		</tr>
		<tr>
			<td>865677850</td>
			<td>NGUY???N CH&Iacute; KHANH</td>
			<td>341967158</td>
			<td>10/02/2002</td>
			<td>An Qu???i, H???i An ??&ocirc;ng, L???p V&ograve;, ?????ng Th&aacute;p</td>
			<td>9704222043259840</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>1886992775</td>
			<td>NGUYEN BAO AN KHANG</td>
			<td>321716218</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>408904xxxxxx1612</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>1866226520</td>
			<td>DO PHAN DINH QUI</td>
			<td>321716217</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>408904xxxxxx2252</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>1866226519</td>
			<td>DO PHAN DINH QUI</td>
			<td>321716211</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>408904xxxxxx7444</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>1866226546</td>
			<td>DO PHAN DINH QUI</td>
			<td>321718219</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>408904xxxxxx7444</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>1866226527</td>
			<td>DO PHAN DINH QUI</td>
			<td>321716218</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>408904xxxxxx7444</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>1866226528</td>
			<td>NGUYEN BAO AN KHANG</td>
			<td>321716210</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>408904xxxxxx9968</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>1866226524</td>
			<td>TRAN QUOC KHANH</td>
			<td>321716210</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>408904xxxxxx3034</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>1866226526</td>
			<td>TRAN QUOC KHANH</td>
			<td>321716211</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>408904xxxxxx3034</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>1866226525</td>
			<td>TRAN QUOC KHANH</td>
			<td>321716211</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>408904xxxxxx3034</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>1213388801</td>
			<td>CAO THI BICH LIEN</td>
			<td>331946151</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>970422xxxxxx5032</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>976793643</td>
			<td>LUU NGOC PHONG</td>
			<td>150978700</td>
			<td>&nbsp;</td>
			<td>X&Atilde; ??&Ocirc;NG C?????NG, HUY???N ??&Ocirc;NG H??NG</td>
			<td>9704155212218130</td>
			<td>VTB</td>
		</tr>
		<tr>
			<td>1633405042</td>
			<td>NGUY???N TH??? MAI TRANG</td>
			<td>001301029213</td>
			<td>&nbsp;</td>
			<td>TH&Ocirc;N 7, BA TR???I, BA V&Igrave;, H&Agrave; N???I</td>
			<td>21510002954171</td>
			<td>BIDV</td>
		</tr>
		<tr>
			<td>869396556</td>
			<td>PH&Ugrave;NG TI&Ecirc;N S???</td>
			<td>132200678</td>
			<td>&nbsp;</td>
			<td>KHU 3, V??N B&Aacute;N, C???M KH&Ecirc;, PH&Uacute; TH???</td>
			<td>422149xxxxxx7353</td>
			<td>TCB</td>
		</tr>
		<tr>
			<td>1885506349</td>
			<td>NGUYEN THI HIEN</td>
			<td>261362825</td>
			<td>14/11/1996</td>
			<td>&nbsp;</td>
			<td>408904xxxxxx1956</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>1885312854</td>
			<td>NGUYEN VAN VUONG</td>
			<td>82782737</td>
			<td>30/09/2001</td>
			<td>S??N T&Acirc;N, V???NG ??&Ocirc;NG, THO???I S??N, AN GIANG</td>
			<td>970422xxxxxx7853</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>1884932518</td>
			<td>NGUYEN PHAN THIEN KHANG</td>
			<td>352587946</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>XXXXXXXXXXXX5318</td>
			<td>Sacombank</td>
		</tr>
		<tr>
			<td>878746704</td>
			<td>NGUYEN VIET ANH</td>
			<td>204819754</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>970422xxxxxx0797</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>1225213158</td>
			<td>NGUY???N AN</td>
			<td>090860537</td>
			<td>17/07/1979</td>
			<td>TH&Ocirc;N 1 ?????I H&Ograve;A, ?????I L???C, QU???NG NAM</td>
			<td>970415xxxxxx8949</td>
			<td>CTG</td>
		</tr>
		<tr>
			<td>1269441496</td>
			<td>NGUY???N TRUNG PHONG</td>
			<td>093458813</td>
			<td>17/07/1979</td>
			<td>TH&Ocirc;N 1 ?????I H&Ograve;A, ?????I L???C, QU???NG NAM</td>
			<td>970415xxxxxx3064</td>
			<td>CTG</td>
		</tr>
		<tr>
			<td>1262028157</td>
			<td>L&Ecirc; TRAN TH??U BIN</td>
			<td>098563150</td>
			<td>17/07/1979</td>
			<td>TH&Ocirc;N 1 ?????I H&Ograve;A, ?????I L???C, QU???NG NAM</td>
			<td>970415xxxxxx3064</td>
			<td>CTG</td>
		</tr>
		<tr>
			<td>906239849</td>
			<td>PH???M V??N HOANG</td>
			<td>097862727</td>
			<td>17/07/1979</td>
			<td>TH&Ocirc;N 1 ?????I H&Ograve;A, ?????I L???C, QU???NG NAM</td>
			<td>970415xxxxxx2059</td>
			<td>CTG</td>
		</tr>
		<tr>
			<td>1217152922</td>
			<td>L&Ecirc; NG???C MINH</td>
			<td>090860539</td>
			<td>17/07/1979</td>
			<td>TH&Ocirc;N 1 ?????I H&Ograve;A, ?????I L???C, QU???NG NAM</td>
			<td>970415xxxxxx8949</td>
			<td>CTG</td>
		</tr>
		<tr>
			<td>1886459987</td>
			<td>V&Otilde; ?????C NGH??A</td>
			<td>206438423</td>
			<td>15/0182004</td>
			<td>H&Ograve;A M???, ?????I NGH??A, ?????I L???C, QU???NG NAM</td>
			<td>970415XXXXXX8304</td>
			<td>CTG</td>
		</tr>
		<tr>
			<td>898376291</td>
			<td>????? VIET HOANG</td>
			<td>091221541</td>
			<td>17/07/1979</td>
			<td>TH&Ocirc;N 1 ?????I H&Ograve;A, ?????I L???C, QU???NG NAM</td>
			<td>970415XXXXXX3998</td>
			<td>CTG</td>
		</tr>
		<tr>
			<td>1215691189</td>
			<td>B&Ugrave;I THI HAO</td>
			<td>094225183</td>
			<td>17/07/1979</td>
			<td>TH&Ocirc;N 1 ?????I H&Ograve;A, ?????I L???C, QU???NG NAM</td>
			<td>970415XXXXXX3487</td>
			<td>CTG</td>
		</tr>
		<tr>
			<td>1675660229</td>
			<td>V?? THI&Ecirc;N S??N</td>
			<td>164564800</td>
			<td>20/03/1996</td>
			<td>GIA H??NG, GIA VI&Ecirc;N, NINH B&Igrave;NH</td>
			<td>8007041082467</td>
			<td>TIMO</td>
		</tr>
		<tr>
			<td>1644803176</td>
			<td>??&Agrave;O V??N T????I</td>
			<td>272424677</td>
			<td>02/02/1958</td>
			<td>PH&Uacute; L&Acirc;M 2, PH??? S??N, T&Acirc;N PH&Uacute;, ?????NG NAI</td>
			<td>9704151553349800</td>
			<td>VTB</td>
		</tr>
		<tr>
			<td>1628162068</td>
			<td>NGUY???N TH??? THANH V&Acirc;N</td>
			<td>371718885</td>
			<td>19/07/1995</td>
			<td>134 NG CH&Iacute; THANH, TP R???CH GI&Aacute;, KI&Ecirc;N GIANG</td>
			<td>4197188701</td>
			<td>TPB</td>
		</tr>
		<tr>
			<td>978025365</td>
			<td>NGUY???N TH??? TH&Uacute;Y</td>
			<td>037182004872</td>
			<td>21/01/1982</td>
			<td>H&Aacute;N NAM, GIA TI???N, GIA VI???N, NINH B&Igrave;NH</td>
			<td>100872881696</td>
			<td>VTB</td>
		</tr>
		<tr>
			<td>865743912</td>
			<td>NGUY???N MINH LU&Acirc;N</td>
			<td>371162553</td>
			<td>11/10/1988</td>
			<td>134 NG CH&Iacute; THANH, TP R???CH GI&Aacute;, KI&Ecirc;N GIANG</td>
			<td>XXXXXXXXX7909</td>
			<td>SACOMBANK</td>
		</tr>
		<tr>
			<td>1687306951</td>
			<td>V?? THI??? HI???N</td>
			<td>150039907</td>
			<td>05/06/1958</td>
			<td>TT QU???NH C&Ocirc;I, QU???NH PH???, TH&Aacute;I B&Igrave;NH</td>
			<td>100871199751</td>
			<td>VTB</td>
		</tr>
		<tr>
			<td>1652116743</td>
			<td>TH&Aacute;I V??N NH???T</td>
			<td>092202005934</td>
			<td>27/03/2002</td>
			<td>TH???NG L???I, TH???NH L???C, V??NH TH???NH, C???N TH??</td>
			<td>104873326468</td>
			<td>VTB</td>
		</tr>
		<tr>
			<td>1627503259</td>
			<td>L????NG MINH LU&Acirc;N</td>
			<td>092093001994</td>
			<td>13/07/1993</td>
			<td>V??NH QU???I, TH??? TR???N V??NH TH???NH, V??NH TH???NH, C???N TH??</td>
			<td>1021665789</td>
			<td>VCB</td>
		</tr>
		<tr>
			<td>878285045</td>
			<td>??&Agrave;O V??N TO&Agrave;N</td>
			<td>197418458</td>
			<td>28/09/2000</td>
			<td>KIM SANH, H???I TH&Agrave;NH, H???I L??NG, QU???NG TR???</td>
			<td>100873530670</td>
			<td>VTB</td>
		</tr>
		<tr>
			<td>878285031</td>
			<td>NGUY???N V?? H&Ograve;A</td>
			<td>352521650</td>
			<td>15/01/2001</td>
			<td>V??NH PH&Uacute;, CH&Acirc;U PH&Uacute; A, CH&Acirc;U ?????C, AN GIANG</td>
			<td>9704222063153250</td>
			<td>MBB</td>
		</tr>
		<tr>
			<td>878734853</td>
			<td>NGUY???N V??N PH&Uacute;</td>
			<td>341847704</td>
			<td>09/11/1996</td>
			<td>AN L???I B, ?????NH Y???N, HUY???N L???P V&Ograve;, ?????NG TH&Aacute;P</td>
			<td>105873552678</td>
			<td>VTB</td>
		</tr>
		<tr>
			<td>878285651</td>
			<td>NGUY???N V?? ?????C</td>
			<td>352521649</td>
			<td>15/01/2001</td>
			<td>V??NH PH&Uacute;, CH&Acirc;U PH&Uacute; A, CH&Acirc;U ?????C, AN GIANG</td>
			<td>107873546982</td>
			<td>VTB</td>
		</tr>
		<tr>
			<td>878360285</td>
			<td>TH&Aacute;I NG???C T&Agrave;I</td>
			<td>352224925</td>
			<td>21/10/1993</td>
			<td>CH&Acirc;U QU???I 1, CH&Acirc;U PH&Uacute; B, CH&Acirc;U ?????C, AN GIANG</td>
			<td>101873572689</td>
			<td>VTB</td>
		</tr>
		<tr>
			<td>878360284</td>
			<td>HU???NH TH??? B&Eacute; NGOAN</td>
			<td>352684037</td>
			<td>13/10/2002</td>
			<td>KH&Aacute;NH H&Ograve;A, KH&Aacute;NH H&Ograve;A, CH&Acirc;U PH&Uacute;, AN GIANG</td>
			<td>97042220800437540</td>
			<td>MBB</td>
		</tr>
		<tr>
			<td>878360287</td>
			<td>D????NG V??N HO&Agrave;NG</td>
			<td>352603819</td>
			<td>17/03/2001</td>
			<td>KH&Oacute;M 8, CH&Acirc;U PH&Uacute; A, CH&Acirc;U ?????C, AN GIANG</td>
			<td>103873551617</td>
			<td>VTB</td>
		</tr>
		<tr>
			<td>878360286</td>
			<td>H???NG MINH TI???N</td>
			<td>351511061</td>
			<td>24/06/1998</td>
			<td>PH&Uacute; B&Igrave;NH, PH&Uacute; AN, PH&Uacute; T&Acirc;N, AN GIANG</td>
			<td>9704222065992820</td>
			<td>MBB</td>
		</tr>
		<tr>
			<td>878360273</td>
			<td>?????NH VI???T CHUNG</td>
			<td>197319811</td>
			<td>10/03/1993</td>
			<td>TH&Uacute;Y BA, H??? V??NH TH???Y, V??NH LINH, QU???NH TR???</td>
			<td>9704222048634280</td>
			<td>MBB</td>
		</tr>
		<tr>
			<td>1695554752</td>
			<td>TR???N &Aacute;I LINH</td>
			<td>B8379022</td>
			<td>15/10/1991</td>
			<td>&nbsp;</td>
			<td>9017041298186</td>
			<td>TIMO</td>
		</tr>
		<tr>
			<td>878766151</td>
			<td>??&agrave;m Kh&aacute;nh Linh</td>
			<td>001182626627</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>970422XXXXXX9916</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>878766221</td>
			<td>Nguy???n Tu???n H??ng</td>
			<td>001127626887</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>970422XXXXXX9916</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>1889706801</td>
			<td>Nguyen van Bang</td>
			<td>251391726</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>970422XXXXXX2765</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>1889706800</td>
			<td>Hoang Van Hau</td>
			<td>251291087</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>970422XXXXXX2765</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>1889706882</td>
			<td>Do Hoang Nam</td>
			<td>261987556</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>970422XXXXXX2765</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>1866226549</td>
			<td>TRAN QUOC KHANH</td>
			<td>321716291</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>408904XXXXXX9480</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>1866226541</td>
			<td>TRAN QUOC KHANH</td>
			<td>321816217</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>408904XXXXXX9480</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>1866226532</td>
			<td>TRAN QUOC KHANH</td>
			<td>321716212</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
		</tr>
		<tr>
			<td>1886972985</td>
			<td>NGUYEN VAN VU&Ograve;NG</td>
			<td>321716213</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>408904XXXXXX2169</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>869794842</td>
			<td>NGUYEN THI TUYET</td>
			<td>32412412421</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>402649XXXXXX9605</td>
			<td>VIETTINBANK</td>
		</tr>
		<tr>
			<td>1673546934</td>
			<td>DAO THI GIANG</td>
			<td>2421421421</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>402649XXXXXX2817</td>
			<td>VIETTINBANK</td>
		</tr>
		<tr>
			<td>1664581076</td>
			<td>NGUYEN THI TUYET</td>
			<td>214124124121</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>402649XXXXXX9605</td>
			<td>VIETTINBANK</td>
		</tr>
		<tr>
			<td>1684486280</td>
			<td>NGUYEN VIET HOA</td>
			<td>634634634634</td>
			<td>30/11/2004</td>
			<td>TDP V???N M??? TH??? TR???N S&Ocirc;NG V???, T??? NGH??A, QU???NG NG&Atilde;I</td>
			<td>402649XXXXXX6554</td>
			<td>VIETTINBANK</td>
		</tr>
		<tr>
			<td>1889317687</td>
			<td>PH???M THANH NH&Agrave;N</td>
			<td>051304001317</td>
			<td>12/06/2001</td>
			<td>NGH??A TH????NG, T??? NGH??A, QU&Atilde;NG NG&Atilde;I</td>
			<td>970422XXXXXX4191</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>921443669</td>
			<td>TR????NG ?????NG H???U PH?????C</td>
			<td>212435389</td>
			<td>10/08/1986</td>
			<td>QU???NG HU???, ?????I H&Ograve;A, ?????I L???C, QU???NG NAM</td>
			<td>970422XXXXXX1703</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>921780928</td>
			<td>NGUY???N TH??? M???</td>
			<td>051186009310</td>
			<td>24/02/2000</td>
			<td>&nbsp;</td>
			<td>970422XXXXXX2552</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>1869509522</td>
			<td>L&Ecirc; XU&Acirc;N NH???T</td>
			<td>197868516</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>970415XXXXXX6621</td>
			<td>CTG</td>
		</tr>
		<tr>
			<td>1684993620</td>
			<td>DDINH TH I NGOAN</td>
			<td>034095001789</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>408904XXXXXX1870</td>
			<td>MB</td>
		</tr>
		<tr>
			<td>1685341802</td>
			<td>DINH NGOC HIEU</td>
			<td>152084085</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>413515XXXXXX1412</td>
			<td>SHB</td>
		</tr>
	</tbody>
</table>

</div>
          {/* <LoginHistoryDatatable
            t={t}
            totalRow={totalRow}
            data={listData}
            getDataList={getDataList}
          /> */}
        </div>
      </div>
    </>
  );
}
