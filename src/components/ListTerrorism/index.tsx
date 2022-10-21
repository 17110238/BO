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
          <h3>{t('Danh sách khủng bố/TTKB')}</h3>
        </div>
        <div className='loginHistory-header__filter'>
          
        </div>
      </div>
        
        <div className='loginHistory-content' style={{padding: '25px'}}>
          <div style={{height:'500px', overflow: 'scroll'}}>
        <table className='table-list-block-user'>
				
	<tbody>
		<tr>
			<td>1</td>
			<td>B&ugrave;i Bằng Đo&agrave;n</td>
			<td>L&yacute; Th&aacute;i H&ugrave;ng</td>
			<td>20/02/1952</td>
			<td>Mỹ</td>
			<td>&nbsp;</td>
			<td>VT</td>
			<td>Th&agrave;nh vi&ecirc;n &ldquo;Mặt trận quốc gia thống nhất giải ph&oacute;ng Việt Nam&rdquo;, hiện l&agrave; &quot;Tổng b&iacute; thư Việt t&acirc;n&rdquo;.</td>
		</tr>
		<tr>
			<td>2</td>
			<td>Đỗ Ho&agrave;ng Điềm</td>
			<td>B&ugrave;i Đức Khi&ecirc;m</td>
			<td>21/07/1963</td>
			<td>Mỹ</td>
			<td>460249033</td>
			<td>VT</td>
			<td>Th&agrave;nh vi&ecirc;n &ldquo;Mặt trận quốc gia thống nhất giải ph&oacute;ng Việt Nam&rdquo;, hiện l&agrave; &quot;Chủ tịch Việt t&acirc;n&rdquo;.</td>
		</tr>
		<tr>
			<td>3</td>
			<td>Đỗ Đăng Li&ecirc;u</td>
			<td>B&iacute; Danh: L&ecirc; Văn Li&ecirc;u</td>
			<td>22/10/1947</td>
			<td>&Uacute;c</td>
			<td>&nbsp;</td>
			<td>VT</td>
			<td>Ủy vi&ecirc;n Trung ương &ldquo;Việt t&acirc;n&rdquo;.</td>
		</tr>
		<tr>
			<td>4</td>
			<td>H&agrave; Đ&ocirc;ng Xuyến</td>
			<td>Nguyễn Duy Nhi&ecirc;n</td>
			<td>23/09/1965</td>
			<td>Mỹ</td>
			<td>303739517</td>
			<td>VT</td>
			<td>Ủy vi&ecirc;n Trung ương &ldquo;Việt t&acirc;n&rdquo;.</td>
		</tr>
		<tr>
			<td>5</td>
			<td>Ho&agrave;ng Tứ Duy</td>
			<td>Đo&agrave;n Quốc Huy</td>
			<td>29/11/1971</td>
			<td>Mỹ</td>
			<td>15812123</td>
			<td>VT</td>
			<td>Th&agrave;nh vi&ecirc;n &ldquo;Mặt trận quốc gia thống nhất giải ph&oacute;ng Việt Nam&rdquo;, hiện l&agrave; ph&aacute;t ng&ocirc;n vi&ecirc;n của &ldquo;Việt t&acirc;n&rdquo;.</td>
		</tr>
		<tr>
			<td>6</td>
			<td>Huỳnh Phạm Phương Trang</td>
			<td>Đỗ Hồng Trang</td>
			<td>22/10/1973</td>
			<td>Đan Mạch, Mỹ</td>
			<td>102380265</td>
			<td>VT</td>
			<td>Ủy vi&ecirc;n Trung ương &ldquo;Việt t&acirc;n&rdquo;.</td>
		</tr>
		<tr>
			<td>7</td>
			<td>Lương Văn Mỹ</td>
			<td>L&ecirc; T&acirc;m Ch&aacute;nh, Đinh Tấn Lực, Lu James</td>
			<td>07/05/1952</td>
			<td>Mỹ</td>
			<td>530687160</td>
			<td>VT</td>
			<td>Ủy vi&ecirc;n Trung ương &ldquo;Việt t&acirc;n&rdquo;.</td>
		</tr>
		<tr>
			<td>8</td>
			<td>Nguyễn Đỗ Thanh Phong</td>
			<td>Chử Định Phong</td>
			<td>18/08/1970</td>
			<td>&Uacute;c</td>
			<td>&nbsp;</td>
			<td>VT</td>
			<td>Ủy vi&ecirc;n Trung ương &ldquo;Việt t&acirc;n&rdquo;.</td>
		</tr>
		<tr>
			<td>9</td>
			<td>Nguyễn Kim Hườn</td>
			<td>Nguyễn Kim</td>
			<td>13/11/1944</td>
			<td>Mỹ</td>
			<td>&nbsp;</td>
			<td>VT</td>
			<td>Ủy vi&ecirc;n Trung ương &ldquo;Việt t&acirc;n&rdquo;.</td>
		</tr>
		<tr>
			<td>10</td>
			<td>Nguyễn Ngọc Đức</td>
			<td>L&yacute; Quang Đức</td>
			<td>18/07/1955</td>
			<td>Ph&aacute;p</td>
			<td>07AZ38359; 07AA80151</td>
			<td>VT</td>
			<td>Ủy vi&ecirc;n Trung ương &ldquo;Việt t&acirc;n&rdquo;.</td>
		</tr>
		<tr>
			<td>11</td>
			<td>Nguyễn Quốc Qu&acirc;n</td>
			<td>Chu Cảnh L&acirc;m; L&ecirc; Trung; Tuấn Anh; Nguyen Richard; Nguyen Richard Tuan Phong</td>
			<td>20/11/1953</td>
			<td>Mỹ</td>
			<td>469267405</td>
			<td>VT</td>
			<td>Ng&agrave;y 13/5/2008, Nguyễn Quốc Qu&acirc;n bị T&ograve;a &aacute;n Nh&acirc;n d&acirc;n th&agrave;nh phố Hồ Ch&iacute; Minh tuy&ecirc;n &aacute;n về tội danh &quot;Khủng bố&quot; quy định tại Điều 84 Bộ luật h&igrave;nh sự nước Cộng h&ograve;a x&atilde; hội chủ nghĩa Việt Nam (theo Bản &aacute;n số 383/2008/HSST, ng&agrave;y 13/5/2008); xử phạt 06 th&aacute;ng t&ugrave; giam.</td>
		</tr>
		<tr>
			<td>12</td>
			<td>Nguyễn Thế Vũ</td>
			<td>Nguyễn Thế Vũ</td>
			<td>&nbsp;</td>
			<td>Việt Nam</td>
			<td>&nbsp;</td>
			<td>VT</td>
			<td>Ng&agrave;y 13/5/2008, Nguyễn Thế Vũ bị T&ograve;a &aacute;n Nh&acirc;n d&acirc;n Th&agrave;nh Phố Hồ Ch&iacute; Minh x&eacute;t xử sơ thẩm về tội danh &ldquo;Khủng bố&rdquo; quy định tại khoản 3 Điều 84 Bộ luật h&igrave;nh sự nước Cộng h&ograve;a x&atilde; hội chủ nghĩa Việt Nam (theo Bản &aacute;n số 383/2008/HSST, ng&agrave;y 13/5/2008).</td>
		</tr>
		<tr>
			<td>13</td>
			<td>Nguyễn Hải</td>
			<td>Khunmi Somsak, Nguyễn Quang Phục, Nguyễn Quốc Hải</td>
			<td>&nbsp;</td>
			<td>Việt Nam</td>
			<td>&nbsp;</td>
			<td>VT</td>
			<td>Ng&agrave;y 13/5/2008, Nguyễn Hải bị T&ograve;a &aacute;n Nh&acirc;n d&acirc;n Th&agrave;nh Phố Hồ Ch&iacute; Minh x&eacute;t xử sơ thẩm về tội danh &ldquo;Khủng bố&rdquo; quy định tại khoản 3 Điều 84 Bộ luật h&igrave;nh sự nước Cộng h&ograve;a x&atilde; hội chủ nghĩa Việt Nam (theo Bản &aacute;n số 383/2008/HSST, ng&agrave;y 13/5/2008).</td>
		</tr>
		<tr>
			<td>14</td>
			<td>Nguyễn Thị Thanh V&acirc;n</td>
			<td>Trần Thanh V&acirc;n</td>
			<td>04/06/1956</td>
			<td>Ph&aacute;p</td>
			<td>03VH96685</td>
			<td>VT</td>
			<td>Ng&agrave;y 26/11/2007, Nguyễn Thị Thanh V&acirc;n bị Cơ quan An ninh điều tra - Bộ C&ocirc;ng an ra Quyết định khởi tố bị can số: 211/ANĐT tội danh &ldquo;Khủng bố&rdquo; được quy định tại Điều 84 Bộ luật h&igrave;nh sự nước Cộng h&ograve;a x&atilde; hội chủ nghĩa Việt Nam.</td>
		</tr>
		<tr>
			<td>15</td>
			<td>Trương Leon</td>
			<td>Trương Văn Sỹ, Ba.</td>
			<td>20/09/1953</td>
			<td>Mỹ, Việt Nam</td>
			<td>120629249</td>
			<td>VT</td>
			<td>Ng&agrave;y 26/11/2007, Trương Leon bị Cơ quan An ninh điều tra - Bộ C&ocirc;ng an ra Quyết định khởi tố bị can số: 211/ANĐT tội danh &ldquo;Khủng bố&rdquo; được quy định tại Điều 84 Bộ luật h&igrave;nh sự nước Cộng h&ograve;a x&atilde; hội chủ nghĩa Việt Nam.</td>
		</tr>
		<tr>
			<td>16</td>
			<td>Ng&ocirc; Văn Ho&agrave;ng H&ugrave;ng</td>
			<td>Ng&ocirc; H&ugrave;ng, Nguyễn Phi Long</td>
			<td>20/12/1952</td>
			<td>Canada</td>
			<td>&nbsp;</td>
			<td>QTTDV</td>
			<td>Qu&ecirc; qu&aacute;n: Mỹ Tho, Tiền Giang<br />
			Chỗ ở hiện nay: Số 31 RVE Meunited West, Laval, Quebec, Canada;<br />
			Vai tr&ograve; trong tổ chức: &ldquo;Tổng tư lệnh&rdquo; tự xưng của Tổ chức khủng bố &ldquo;Triều đại Việt&rdquo;.</td>
		</tr>
		<tr>
			<td>17</td>
			<td>Trần Thanh Đ&igrave;nh</td>
			<td>&nbsp;</td>
			<td>27/7/1957</td>
			<td>Đức</td>
			<td>&nbsp;</td>
			<td>QTTDV</td>
			<td>Vai tr&ograve; trong tổ chức: &ldquo;Ph&oacute; Thủ tướng&rdquo; tự xưng của Tổ chức khủng bố &ldquo;Triều Đại Việt&rdquo;</td>
		</tr>
		<tr>
			<td>18</td>
			<td>Ng&ocirc; Mạnh Cương</td>
			<td>Ng&ocirc; Cường, Nguy&ecirc;n Kh&ocirc;i</td>
			<td>10/9/1961</td>
			<td>Ph&aacute;p</td>
			<td>&nbsp;</td>
			<td>QTTDV</td>
			<td>Qu&ecirc; qu&aacute;n: Th&agrave;nh phố Hồ Ch&iacute; Minh<br />
			Vai tr&ograve; trong tổ chức: &ldquo;Tổng cục trưởng Tổng cục đặc nhiệm&rdquo; của tổ chức khủng bố &ldquo;Triều Đại Việt&rdquo;.</td>
		</tr>
		<tr>
			<td>19</td>
			<td>Huỳnh Thanh Ho&agrave;ng</td>
			<td>Huỳnh Ho&agrave;ng, Andy Huynh</td>
			<td>5/4/1976</td>
			<td>Mỹ</td>
			<td>&nbsp;</td>
			<td>QTTDV</td>
			<td>Chỗ ở hiện nay: số 1037 N. Archibald Ave #1017g, Ontario, CA 91764, Mỹ;<br />
			Vai tr&ograve; trong tổ chức: Ph&aacute;t ng&ocirc;n vi&ecirc;n Tổ chức khủng bố &ldquo;Triều Đại Việt&rdquo;</td>
		</tr>
		<tr>
			<td>20</td>
			<td>Dương B&aacute; Giang</td>
			<td>&nbsp;</td>
			<td>1971</td>
			<td>Việt Nam</td>
			<td>&nbsp;</td>
			<td>TVTDV</td>
			<td>- Qu&ecirc; qu&aacute;n: Nghệ An;<br />
			- Hộ khẩu thường tr&uacute;: 47/28 đường Huỳnh Văn Nghệ, x&atilde; Bắc Sơn, huyện Trảng Bom, tỉnh Đồng Nai;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 08/12;<br />
			- D&acirc;n tộc: Kinh; T&ocirc;n gi&aacute;o: Thi&ecirc;n ch&uacute;a;<br />
			- Nghề nghiệp: Lao động tự do;<br />
			- Vai tr&ograve; trong tổ chức: Th&agrave;nh vi&ecirc;n Tổ chức khủng bố &ldquo;Triều đại Việt&rdquo;;<br />
			- H&agrave;nh vi khủng bố: Trực chế tạo thiết bị k&iacute;ch nổ từ xa v&agrave; tham gia vụ g&acirc;y nổ tại C&ocirc;ng an phường 12, quận T&acirc;n B&igrave;nh, Th&agrave;nh phố Hồ Ch&iacute; Minh ng&agrave;y 20/6/2018;<br />
			- Ng&agrave;y 29/6/2018, bị Cơ quan An ninh điều tra, C&ocirc;ng an Th&agrave;nh phố Hồ Ch&iacute; Minh bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 113 Bộ luật H&igrave;nh sự năm 2015 (sửa đổi, bổ sung năm 2017);<br />
			- Ng&agrave;y 22/9/2020, T&ograve;a &aacute;n nh&acirc;n d&acirc;n Th&agrave;nh phố Hồ Ch&iacute; Minh mở phi&ecirc;n t&ograve;a x&eacute;t xử sơ thẩm, tuy&ecirc;n phạt Dương B&aacute; Giang 18 năm t&ugrave;, 05 năm quản chế.</td>
		</tr>
		<tr>
			<td>21</td>
			<td>Vũ Ho&agrave;ng Nam</td>
			<td>&nbsp;</td>
			<td>17/4/1996</td>
			<td>Việt Nam</td>
			<td>&nbsp;</td>
			<td>TVTDV</td>
			<td>- Qu&ecirc; qu&aacute;n: Th&agrave;nh phố Hồ Ch&iacute; Minh;<br />
			- Hộ khẩu thường tr&uacute;: 68/25 Đồng Đen, phường 14, quận T&acirc;n B&igrave;nh, Th&agrave;nh phố Hồ Ch&iacute; Minh;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 12/12;<br />
			- D&acirc;n tộc: Kinh; T&ocirc;n gi&aacute;o: Thi&ecirc;n ch&uacute;a;<br />
			- Nghề nghiệp: Lao động tự do;<br />
			- Vai tr&ograve; trong tổ chức: Th&agrave;nh vi&ecirc;n Tổ chức khủng bố &ldquo;Triều đại Việt&rdquo;;<br />
			- H&agrave;nh vi khủng bố: Trực chế g&acirc;y ra vụ g&acirc;y nổ tại C&ocirc;ng an phường 12, quận T&acirc;n B&igrave;nh, Th&agrave;nh phố Hồ Ch&iacute; Minh ng&agrave;y 20/6/2018;<br />
			- Ng&agrave;y 02/7/2018, bị Cơ quan An ninh điều tra, C&ocirc;ng an Th&agrave;nh phố Hồ Ch&iacute; Minh bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 113 Bộ luật H&igrave;nh sự năm 2015 (sửa đổi, bổ sung năm 2017);<br />
			- Ng&agrave;y 22/9/2020, T&ograve;a &aacute;n nh&acirc;n d&acirc;n Th&agrave;nh phố Hồ Ch&iacute; Minh mở phi&ecirc;n t&ograve;a x&eacute;t xử sơ thẩm, tuy&ecirc;n phạt Vũ Ho&agrave;ng Nam 17 năm t&ugrave;, 05 năm quản chế.</td>
		</tr>
		<tr>
			<td>22</td>
			<td>Nguyễn Khanh</td>
			<td>&nbsp;</td>
			<td>25/12/1964</td>
			<td>Việt Nam</td>
			<td>&nbsp;</td>
			<td>TVTDV</td>
			<td>- Qu&ecirc; qu&aacute;n: B&igrave;nh Dương<br />
			- Hộ khẩu thường tr&uacute;: Số 275, Tổ 15, X&oacute;m 2, ấp Th&aacute;i H&ograve;a, x&atilde; Hố Nai 3, huyện Trảng Bom, tỉnh Đồng Nai;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 07/12;<br />
			- D&acirc;n tộc: Kinh; T&ocirc;n gi&aacute;o: Thi&ecirc;n ch&uacute;a;<br />
			- Nghề nghiệp: Lao động tự do;<br />
			- Vai tr&ograve; trong tổ chức: Th&agrave;nh vi&ecirc;n Tổ chức khủng bố &ldquo;Triều đại Việt&rdquo;.<br />
			- H&agrave;nh vi khủng bố:<br />
			+ Trực tiếp mua, chế tạo quả nổ v&agrave; tham gia vụ g&acirc;y nổ tại C&ocirc;ng an phường 12, quận T&acirc;n B&igrave;nh, Th&agrave;nh phố Hồ Ch&iacute; Minh ng&agrave;y 20/6/2018.<br />
			+ Cung cấp quả nổ, chỉ đạo đồng bọn khảo s&aacute;t địa b&agrave;n, t&igrave;m c&aacute;ch g&acirc;y nổ tại một số Cơ quan Nh&agrave; nước tại tỉnh Hậu Giang, Ki&ecirc;n Giang.<br />
			- Ng&agrave;y 26/6/2018, bị Cơ quan An ninh điều tra, C&ocirc;ng an Th&agrave;nh phố Hồ Ch&iacute; Minh bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 113 v&agrave; tội &ldquo;Chế tạo, t&agrave;ng trữ, mua b&aacute;n tr&aacute;i ph&eacute;p vật liệu nổ&rdquo; theo Điều 305 Bộ luật H&igrave;nh sự năm 2015 (sửa đổi, bổ sung năm 2017).<br />
			- Ng&agrave;y 22/9/2020, T&ograve;a &aacute;n nh&acirc;n d&acirc;n Th&agrave;nh phố Hồ Ch&iacute; Minh mở phi&ecirc;n t&ograve;a x&eacute;t xử sơ thẩm, tuy&ecirc;n phạt Nguyễn Khanh 24 năm t&ugrave;, 05 năm quản chế.</td>
		</tr>
		<tr>
			<td>23</td>
			<td>Dương Khắc Minh</td>
			<td>&nbsp;</td>
			<td>25/11/1993</td>
			<td>Việt Nam</td>
			<td>&nbsp;</td>
			<td>TVTDV</td>
			<td>- Qu&ecirc; qu&aacute;n: Thanh H&oacute;a;<br />
			- Hộ khẩu thường tr&uacute;: Đội 2, X&oacute;m 5, x&atilde; Thiệu Dương, Th&agrave;nh phố Thanh H&oacute;a, tỉnh Thanh H&oacute;a;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 12/12;<br />
			- D&acirc;n tộc: Kinh; T&ocirc;n gi&aacute;o: Kh&ocirc;ng;<br />
			- Nghề nghiệp: Lao động tự do;<br />
			- Vai tr&ograve; trong tổ chức: Th&agrave;nh vi&ecirc;n Tổ chức khủng bố &ldquo;Triều đại Việt&rdquo;.<br />
			- H&agrave;nh vi khủng bố: Trực tiếp tham gia vụ g&acirc;y nổ tại C&ocirc;ng an phường 12, quận T&acirc;n B&igrave;nh, Th&agrave;nh phố Hồ Ch&iacute; Minh ng&agrave;y 20/6/2018.<br />
			- Ng&agrave;y 08/7/2018, bị Cơ quan An ninh điều tra, C&ocirc;ng an Th&agrave;nh phố Hồ Ch&iacute; Minh bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 113 Bộ luật H&igrave;nh sự năm 2015 (sửa đổi, bổ sung năm 2017).<br />
			- Ng&agrave;y 22/9/2020, T&ograve;a &aacute;n nh&acirc;n d&acirc;n Th&agrave;nh phố Hồ Ch&iacute; Minh mở phi&ecirc;n t&ograve;a x&eacute;t xử sơ thẩm, tuy&ecirc;n phạt Dương Khắc Minh 17 năm t&ugrave;, 05 năm quản chế.</td>
		</tr>
		<tr>
			<td>24</td>
			<td>Phạm Trần Phong Vũ</td>
			<td>&nbsp;</td>
			<td>6/8/1982</td>
			<td>Việt Nam</td>
			<td>&nbsp;</td>
			<td>TVTDV</td>
			<td>- Qu&ecirc; qu&aacute;n: Ki&ecirc;n Giang;<br />
			- Hộ khẩu thường tr&uacute;: Số 150/6 đường Mạc Cửu, phường Vĩnh Thanh, th&agrave;nh phố Rạch Gi&aacute;, tỉnh Ki&ecirc;n Giang;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 12/12;<br />
			- D&acirc;n tộc: Kinh; T&ocirc;n gi&aacute;o: Kh&ocirc;ng;<br />
			- Nghề nghiệp: Thợ cơ kh&iacute;;<br />
			- Vai tr&ograve; trong tổ chức: Th&agrave;nh vi&ecirc;n Tổ chức khủng bố &ldquo;Triều đại Việt&rdquo;;<br />
			- H&agrave;nh vi khủng bố: Trực tiếp tham gia vụ g&acirc;y nổ tại trụ sở C&ocirc;ng an tỉnh Hậu Giang ng&agrave;y 05/7/2018;<br />
			- Ng&agrave;y 01/8/2018, bị Cơ quan An ninh điều tra, C&ocirc;ng an tỉnh Ki&ecirc;n Giang bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 113 Bộ luật H&igrave;nh sự năm 2015 (sửa đổi, bổ sung năm 2017);<br />
			- Ng&agrave;y 22/9/2020, T&ograve;a &aacute;n nh&acirc;n d&acirc;n Th&agrave;nh phố Hồ Ch&iacute; Minh mở phi&ecirc;n t&ograve;a x&eacute;t xử sơ thẩm, tuy&ecirc;n phạt Phạm Trần Phong Vũ 17 năm t&ugrave;, 05 năm quản chế.</td>
		</tr>
		<tr>
			<td>25</td>
			<td>L&ecirc; Văn Thương</td>
			<td>&nbsp;</td>
			<td>1988</td>
			<td>Việt Nam</td>
			<td>&nbsp;</td>
			<td>TVTDV</td>
			<td>- Qu&ecirc; qu&aacute;n: Quảng Ng&atilde;i;<br />
			- Hộ khẩu thường tr&uacute;: x&atilde; Nghĩa Thắng, huyện Tư Nghĩa, tỉnh Quảng Ng&atilde;i.<br />
			- Tr&igrave;nh độ văn h&oacute;a: 12/12;<br />
			- D&acirc;n tộc: Kinh; T&ocirc;n gi&aacute;o: Kh&ocirc;ng;<br />
			- Nghề nghiệp: Tự do;<br />
			- Vai tr&ograve; trong tổ chức: Th&agrave;nh vi&ecirc;n Tổ chức khủng bố &ldquo;Triều đại Việt&rdquo;.<br />
			- H&agrave;nh vi khủng bố: Trực chế tạo thiết bị k&iacute;ch nổ từ xa v&agrave; tham gia vụ g&acirc;y nổ tại C&ocirc;ng an phường 12, quận T&acirc;n B&igrave;nh, Th&agrave;nh phố Hồ Ch&iacute; Minh ng&agrave;y 20/6/2018.</td>
		</tr>
		<tr>
			<td>26</td>
			<td>Nguyễn Minh Tấn</td>
			<td>&nbsp;</td>
			<td>1978</td>
			<td>Việt Nam</td>
			<td>&nbsp;</td>
			<td>TVTDV</td>
			<td>- Qu&ecirc; qu&aacute;n: Quảng Ng&atilde;i;<br />
			- Hộ khẩu thường tr&uacute;: Thị trấn C&acirc;y Dương, huyện Phụng Hiệp, tỉnh Hậu Giang.<br />
			- Tr&igrave;nh độ văn h&oacute;a: 12/12;<br />
			- D&acirc;n tộc: Kinh; T&ocirc;n gi&aacute;o: Kh&ocirc;ng;<br />
			- Nghề nghiệp: Kinh doanh;<br />
			- Vai tr&ograve; trong tổ chức: Th&agrave;nh vi&ecirc;n Tổ chức khủng bố &ldquo;Triều đại Việt&rdquo;;<br />
			- H&agrave;nh vi khủng bố: Nhận tiền, chỉ đạo từ Ng&ocirc; Văn Ho&agrave;ng H&ugrave;ng, mua vật liệu chế tạo quả nổ, trực tiếp g&acirc;y nổ tại trụ sở C&ocirc;ng an tỉnh Hậu Giang;<br />
			- Ng&agrave;y 01/8/2018, Cơ quan ANĐT C&ocirc;ng an tỉnh Hậu Giang đ&atilde; ra quyết định khởi tố bị can, bắt tạm giam Nguyễn Minh Tấn về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 113 Bộ luật H&igrave;nh sự năm 2015 (sửa đổi, bổ sung năm 2017);<br />
			- Ng&agrave;y 22/9/2020, T&ograve;a &aacute;n Nh&acirc;n d&acirc;n TP. Hồ Ch&iacute; Minh mở phi&ecirc;n t&ograve;a x&eacute;t xử sơ thẩm tuy&ecirc;n phạt Nguyễn Minh Tấn 18 năm t&ugrave; về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo;, 05 năm phạt quản chế kể từ ng&agrave;y chấp h&agrave;nh xong.</td>
		</tr>
		<tr>
			<td>27</td>
			<td>Nguyễn Thị B&iacute;ch V&acirc;n</td>
			<td>&nbsp;</td>
			<td>1954</td>
			<td>Việt Nam</td>
			<td>&nbsp;</td>
			<td>TVTDV</td>
			<td>- Qu&ecirc; qu&aacute;n: TP. Hồ Ch&iacute; Minh;<br />
			- Nơi ở trước khi bị bắt: Khu phố 3, phường T&acirc;n Thới Nhất, Quận 12, TP. Hồ Ch&iacute; Minh<br />
			- Tr&igrave;nh độ văn h&oacute;a: 5/12;<br />
			- D&acirc;n tộc: Kinh; T&ocirc;n gi&aacute;o: Kh&ocirc;ng;<br />
			- Nghề nghiệp: Lao động tự do;<br />
			- Vai tr&ograve; trong tổ chức: Th&agrave;nh vi&ecirc;n Tổ chức khủng bố &ldquo;Triều đại Việt&rdquo;;<br />
			- H&agrave;nh vi khủng bố: L&ocirc;i k&eacute;o người tham gia tổ chức &ldquo;Triều đại Việt&rdquo;; nhận chỉ đạo từ Ng&ocirc; Văn Ho&agrave;ng H&ugrave;ng mua h&oacute;a chất chế tạo quả nổ phục vụ &acirc;m mưu, &yacute; đồ khủng bố ph&aacute; hoại;<br />
			- Ng&agrave;y 03/8/2018, Cơ quan ANĐT C&ocirc;ng an tỉnh Tiền Giang đ&atilde; ra quyết định khởi tố bị can, cấm đi khỏi nơi cư tr&uacute; đối với Nguyễn Thị B&iacute;ch V&acirc;n về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 113 Bộ luật H&igrave;nh sự năm 2015 (sửa đổi, bổ sung năm 2017);<br />
			- Ng&agrave;y 22/9/2020, T&ograve;a &aacute;n Nh&acirc;n d&acirc;n TP. Hồ Ch&iacute; Minh mở phi&ecirc;n t&ograve;a x&eacute;t xử sơ thẩm tuy&ecirc;n phạt Nguyễn Thị B&iacute;ch V&acirc;n 12 năm t&ugrave; giam về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo;, 05 năm phạt quản chế kể từ ng&agrave;y chấp h&agrave;nh xong h&igrave;nh phạt t&ugrave;.</td>
		</tr>
		<tr>
			<td>28</td>
			<td>Hồ Anh Tuấn</td>
			<td>&nbsp;</td>
			<td>1973</td>
			<td>Việt Nam</td>
			<td>&nbsp;</td>
			<td>TVTDV</td>
			<td>- Qu&ecirc; qu&aacute;n: Tiền Giang;<br />
			- Hộ khẩu thường tr&uacute;: Phường 5, TP. Mỹ Tho, tỉnh Tiền Giang.<br />
			- Tr&igrave;nh độ văn h&oacute;a: 9/12;<br />
			- D&acirc;n tộc: Kinh; T&ocirc;n gi&aacute;o: Kh&ocirc;ng;<br />
			- Nghề nghiệp: Bu&ocirc;n b&aacute;n;<br />
			- Vai tr&ograve; trong tổ chức: Th&agrave;nh vi&ecirc;n Tổ chức khủng bố &ldquo;Triều đại Việt&rdquo;;<br />
			- H&agrave;nh vi khủng bố: L&ocirc;i k&eacute;o người tham gia tổ chức &ldquo;Triều đại Việt&rdquo;;<br />
			- Ng&agrave;y 01/8/2018, Cơ quan ANĐT C&ocirc;ng an tỉnh Tiền Giang đ&atilde; ra quyết định khởi tố bị can, bắt tạm giam đối với Hồ Anh Tuấn về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 113 Bộ luật H&igrave;nh sự năm 2015 (sửa đổi, bổ sung năm 2017);<br />
			- Ng&agrave;y 22/9/2020, T&ograve;a &aacute;n Nh&acirc;n d&acirc;n TP. Hồ Ch&iacute; Minh mở phi&ecirc;n t&ograve;a x&eacute;t xử sơ thẩm tuy&ecirc;n phạt Hồ Anh Tuấn 09 năm t&ugrave; giam về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo;, 03 năm phạt quản chế kể từ ng&agrave;y chấp h&agrave;nh xong h&igrave;nh phạt t&ugrave;.</td>
		</tr>
		<tr>
			<td>29</td>
			<td>V&otilde; C&ocirc;ng Hải</td>
			<td>&nbsp;</td>
			<td>22/9/1965</td>
			<td>Việt Nam</td>
			<td>&nbsp;</td>
			<td>TVTDV</td>
			<td>- Qu&ecirc; qu&aacute;n: Th&agrave;nh phố Hồ Ch&iacute; Minh;<br />
			- Hộ khẩu thường tr&uacute;: 511A, ấp Nguyễn Văn Rỗ, x&atilde; B&agrave;n T&acirc;n Định, huyện Giồng Riềng, tỉnh Ki&ecirc;n Giang;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 07/12;<br />
			- D&acirc;n tộc: Kinh; T&ocirc;n gi&aacute;o: kh&ocirc;ng;<br />
			- Nghề nghiệp: t&agrave;i xế, thợ điện;<br />
			- Vai tr&ograve; trong tổ chức: Th&agrave;nh vi&ecirc;n Tổ chức khủng bố &ldquo;Triều đại Việt&rdquo;;<br />
			- H&agrave;nh vi khủng bố: M&oacute;c nối, l&ocirc;i k&eacute;o người tham gia tổ chức; may cờ của tổ chức &ldquo;Triều đại Việt&rdquo;; tham gia g&acirc;y nổ tại C&ocirc;ng an tỉnh Hậu Giang;<br />
			- Ng&agrave;y 03/8/2018, bị Cơ quan An ninh điều tra C&ocirc;ng an tỉnh Ki&ecirc;n Giang bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 113 Bộ luật H&igrave;nh sự năm 2015 (sửa đổi, bổ sung năm 2017);<br />
			- Ng&agrave;y 22/9/2020, T&ograve;a &aacute;n nh&acirc;n d&acirc;n Th&agrave;nh phố Hồ Ch&iacute; Minh mở phi&ecirc;n t&ograve;a x&eacute;t xử sơ thẩm, tuy&ecirc;n phạt V&otilde; C&ocirc;ng Hải 09 năm t&ugrave;, 03 năm quản chế.</td>
		</tr>
		<tr>
			<td>30</td>
			<td>Nguyễn Thanh B&igrave;nh</td>
			<td>&nbsp;</td>
			<td>08/10/1957</td>
			<td>Việt Nam</td>
			<td>&nbsp;</td>
			<td>TVTDV</td>
			<td>- Qu&ecirc; qu&aacute;n: An Giang;<br />
			- Hộ khẩu thường tr&uacute;: 136 đường Trần Ph&uacute;, ấp Ph&uacute; Hữu, thị trấn Ph&uacute; H&ograve;a, huyện Thoại Sơn, tỉnh An Giang;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 09/12;<br />
			- D&acirc;n tộc: Kinh; T&ocirc;n gi&aacute;o: phật gi&aacute;o;<br />
			- Nghề nghiệp: bu&ocirc;n b&aacute;n;<br />
			- Vai tr&ograve; trong tổ chức: Th&agrave;nh vi&ecirc;n Tổ chức khủng bố &ldquo;Triều đại Việt&rdquo;;<br />
			- H&agrave;nh vi khủng bố: t&igrave;m nơi để lập mật cứ; t&igrave;m mua s&uacute;ng đạn từ Campuchia mang về Việt Nam; m&oacute;c nối, l&ocirc;i k&eacute;o người tham gia tổ chức;<br />
			- Ng&agrave;y 04/8/2018, bị Cơ quan An ninh điều tra C&ocirc;ng an tỉnh An Giang bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 113 Bộ luật H&igrave;nh sự năm 2015 (sửa đổi, bổ sung năm 2017);<br />
			- Ng&agrave;y 22/9/2020, T&ograve;a &aacute;n nh&acirc;n d&acirc;n Th&agrave;nh phố Hồ Ch&iacute; Minh mở phi&ecirc;n t&ograve;a x&eacute;t xử sơ thẩm, tuy&ecirc;n phạt Nguyễn Thanh B&igrave;nh 09 năm t&ugrave;, 03 năm quản chế.</td>
		</tr>
		<tr>
			<td>31</td>
			<td>Hồ Nguyễn Quốc Hưng</td>
			<td>&nbsp;</td>
			<td>06/07/1981</td>
			<td>Việt Nam</td>
			<td>&nbsp;</td>
			<td>TVTDV</td>
			<td>- Qu&ecirc; qu&aacute;n: Tiền Giang;<br />
			- Hộ khẩu thường tr&uacute;: số 50/15 Giống Dứa, phường 7, th&agrave;nh phố Mỹ Tho, tỉnh Tiền Giang;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 09/12;<br />
			- D&acirc;n tộc: Kinh; T&ocirc;n gi&aacute;o: kh&ocirc;ng;<br />
			- Nghề nghiệp: Lao động tự do;<br />
			- Vai tr&ograve; trong tổ chức: Th&agrave;nh vi&ecirc;n Tổ chức khủng bố &ldquo;Triều đại Việt&rdquo;.<br />
			- H&agrave;nh vi khủng bố:<br />
			+ Được giao nhiệm vụ t&igrave;m thu&ecirc; nh&agrave; trọ; mua cối xay c&agrave; ph&ecirc; để xay than chế tạo thuốc nổ;<br />
			- Ng&agrave;y 07/8/2018, bị Cơ quan An ninh điều tra C&ocirc;ng an tỉnh Tiền Giang bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 113 Bộ luật H&igrave;nh sự năm 2015 (sửa đổi, bổ sung năm 2017);<br />
			- Ng&agrave;y 22/9/2020, T&ograve;a &aacute;n nh&acirc;n d&acirc;n Th&agrave;nh phố Hồ Ch&iacute; Minh mở phi&ecirc;n t&ograve;a x&eacute;t xử sơ thẩm, tuy&ecirc;n phạt Hồ Nguyễn Quốc Hưng 10 năm t&ugrave;, 03 năm quản chế.</td>
		</tr>
		<tr>
			<td>32</td>
			<td>Trần Văn Đoan</td>
			<td>&nbsp;</td>
			<td>17/02/1988</td>
			<td>Việt Nam</td>
			<td>&nbsp;</td>
			<td>TVTDV</td>
			<td>- Qu&ecirc; qu&aacute;n: Ki&ecirc;n Giang<br />
			- Hộ khẩu thường tr&uacute;: Khu phố Kinh B, thị trấn Tấn Hiệp, huyện T&acirc;n Hiệp; tỉnh Ki&ecirc;n Giang<br />
			- Tr&igrave;nh độ văn h&oacute;a: 09/12;<br />
			- D&acirc;n tộc: Kinh; T&ocirc;n gi&aacute;o: H&ograve;a Hảo;<br />
			- Nghề nghiệp: c&ocirc;ng nh&acirc;n;<br />
			- Vai tr&ograve; trong tổ chức: Th&agrave;nh vi&ecirc;n Tổ chức khủng bố &ldquo;Triều đại Việt&rdquo;;<br />
			- H&agrave;nh vi khủng bố: m&oacute;c nối, l&ocirc;i k&eacute;o người d&acirc;n tộc Sti&ecirc;ng th&agrave;nh lập căn cứ T&acirc;y Nguy&ecirc;n, &yacute; đồ l&agrave;m nơi cất giấu vũ kh&iacute; tuyển mộ, huấn luyện lực lượng để tiến h&agrave;nh c&aacute;c hoạt động khủng bố, ph&aacute; hoại;<br />
			- Ng&agrave;y 03/11/2018, bị Cơ quan An ninh điều tra, C&ocirc;ng an tỉnh B&igrave;nh Phước bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 113 Bộ luật H&igrave;nh sự năm 2015 (sửa đổi, bổ sung năm 2017);<br />
			- Ng&agrave;y 22/9/2020, T&ograve;a &aacute;n nh&acirc;n d&acirc;n Th&agrave;nh phố Hồ Ch&iacute; Minh mở phi&ecirc;n t&ograve;a x&eacute;t xử sơ thẩm, tuy&ecirc;n phạt Trần Văn Đoan 09 năm t&ugrave;, 03 năm quản chế.</td>
		</tr>
		<tr>
			<td>33</td>
			<td>Điểu L&eacute;</td>
			<td>&nbsp;</td>
			<td>1952</td>
			<td>Việt Nam</td>
			<td>&nbsp;</td>
			<td>TVTDV</td>
			<td>- Qu&ecirc; qu&aacute;n: B&igrave;nh Phước<br />
			- Hộ khẩu thường tr&uacute;: Th&ocirc;n Bu Kroai, Đức Hạnh, B&ugrave; Gia Mập, B&igrave;nh Phước<br />
			- Tr&igrave;nh độ văn h&oacute;a: 02/12;<br />
			- D&acirc;n tộc: STi&ecirc;ng; T&ocirc;n gi&aacute;o: kh&ocirc;ng;<br />
			- Nghề nghiệp: lao động tự do;<br />
			- Vai tr&ograve; trong tổ chức: Th&agrave;nh vi&ecirc;n Tổ chức khủng bố &ldquo;Triều đại Việt&rdquo;;<br />
			- H&agrave;nh vi khủng bố: M&oacute;c nối, l&ocirc;i k&eacute;o người cho tổ chức; t&igrave;m hiểu đường đi để số đối tượng b&ecirc;n ngo&agrave;i x&acirc;m nhập v&agrave;o trong nước hoạt động chống ph&aacute;; t&igrave;m vị tr&iacute; x&acirc;y dựng chiến khu để t&iacute;ch trữ lực lượng, tập hợp lực lượng;<br />
			- Ng&agrave;y 03/11/2018, bị Cơ quan An ninh điều tra C&ocirc;ng an tỉnh B&igrave;nh Phước bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 113 Bộ luật H&igrave;nh sự năm 2015 (sửa đổi, bổ sung năm 2017);<br />
			- Ng&agrave;y 22/9/2020, T&ograve;a &aacute;n nh&acirc;n d&acirc;n Th&agrave;nh phố Hồ Ch&iacute; Minh mở phi&ecirc;n t&ograve;a x&eacute;t xử sơ thẩm, tuy&ecirc;n phạt Điểu L&eacute; 07 năm t&ugrave;, 03 năm quản chế.</td>
		</tr>
		<tr>
			<td>34</td>
			<td>Điểu A Nam</td>
			<td>&nbsp;</td>
			<td>30/12/1986</td>
			<td>Việt Nam</td>
			<td>&nbsp;</td>
			<td>TVTDV</td>
			<td>- Qu&ecirc; qu&aacute;n: B&igrave;nh Phước;<br />
			- Hộ khẩu thường tr&uacute;: Th&ocirc;n Bu Kroai, Đức Hạnh, B&ugrave; Gia Mập, B&igrave;nh Phước;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 12/12;<br />
			- D&acirc;n tộc: STi&ecirc;ng; T&ocirc;n gi&aacute;o: Tin l&agrave;nh;<br />
			- Nghề nghiệp: c&ocirc;ng nh&acirc;n;<br />
			- Vai tr&ograve; trong tổ chức: Th&agrave;nh vi&ecirc;n Tổ chức khủng bố &ldquo;Triều đại Việt&rdquo;;<br />
			- H&agrave;nh vi khủng bố: M&oacute;c nối, l&ocirc;i k&eacute;o người cho tổ chức; t&igrave;m vị tr&iacute; để cất giấu lương thực, thực phẩm, thuốc men cho tổ chức;<br />
			- Ng&agrave;y 03/11/2018, bị Cơ quan An ninh điều tra, C&ocirc;ng an tỉnh B&igrave;nh Phước bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 113 Bộ luật H&igrave;nh sự năm 2015 (sửa đổi, bổ sung năm 2017);<br />
			- Ng&agrave;y 22/9/2020, T&ograve;a &aacute;n nh&acirc;n d&acirc;n Th&agrave;nh phố Hồ Ch&iacute; Minh mở phi&ecirc;n t&ograve;a x&eacute;t xử sơ thẩm, tuy&ecirc;n phạt Điểu A Nam 07 năm t&ugrave;, 03 năm quản chế.</td>
		</tr>
		<tr>
			<td>35</td>
			<td>Nguyễn Tấn Th&agrave;nh</td>
			<td>&nbsp;</td>
			<td>30/7/1990</td>
			<td>Việt Nam</td>
			<td>&nbsp;</td>
			<td>TVTDV</td>
			<td>- Qu&ecirc; qu&aacute;n: B&igrave;nh Dương;<br />
			- Hộ khẩu thường tr&uacute;: 275 tổ 15, x&oacute;m 2, ấp Th&aacute;i H&ograve;a, x&atilde; Hố Nai 3, huyện Trảng B&ograve;m, tỉnh Đồng Nai;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 12/12;<br />
			- D&acirc;n tộc: Kinh; T&ocirc;n gi&aacute;o: Thi&ecirc;n ch&uacute;a;<br />
			- Nghề nghiệp: t&agrave;i xế;<br />
			- Vai tr&ograve; trong tổ chức: Th&agrave;nh vi&ecirc;n Tổ chức khủng bố &ldquo;Triều đại Việt&rdquo;;<br />
			- H&agrave;nh vi khủng bố: đối tượng li&ecirc;n quan vụ nổ tại phường 12, quận T&acirc;n B&igrave;nh, Th&agrave;nh phố Hồ Ch&iacute; Minh;<br />
			- Ng&agrave;y 26/6/2018, bị Cơ quan An ninh điều tra, C&ocirc;ng an th&agrave;nh phố Hồ Ch&iacute; Minh bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 113 Bộ luật H&igrave;nh sự năm 2015 (sửa đổi, bổ sung năm 2017);<br />
			- Ng&agrave;y 22/9/2020, T&ograve;a &aacute;n nh&acirc;n d&acirc;n Th&agrave;nh phố Hồ Ch&iacute; Minh mở phi&ecirc;n t&ograve;a x&eacute;t xử sơ thẩm, tuy&ecirc;n phạt Nguyễn Tấn Th&agrave;nh 03 năm t&ugrave;, 02 năm quản chế.</td>
		</tr>
		<tr>
			<td>36</td>
			<td>Trương Thị Trang</td>
			<td>&nbsp;</td>
			<td>1983</td>
			<td>Việt Nam</td>
			<td>&nbsp;</td>
			<td>TVTDV</td>
			<td>- Qu&ecirc; qu&aacute;n: Hậu Giang;<br />
			- Hộ khẩu thường tr&uacute;: Khu vực 4, Phường 4, TP. Vị Thanh, tỉnh Hậu Giang;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 9/12;<br />
			- D&acirc;n tộc: Kinh; T&ocirc;n gi&aacute;o: Kh&ocirc;ng;<br />
			- Nghề nghiệp: Gi&aacute;o vi&ecirc;n;<br />
			- Vai tr&ograve; trong tổ chức: Th&agrave;nh vi&ecirc;n Tổ chức khủng bố &ldquo;Triều đại Việt&rdquo;;<br />
			- H&agrave;nh vi khủng bố: Nhận, chuyển tiền của Ng&ocirc; Văn Ho&agrave;ng H&ugrave;ng, đối tượng cầm đầu &ldquo;Triều đại Việt&rdquo; cho số đối tượng trong nước thực hiện h&agrave;nh vi phạm tội;<br />
			- Ng&agrave;y 15/10/2018, Cơ quan ANĐT C&ocirc;ng an tỉnh Hậu Giang đ&atilde; ra quyết định khởi tố bị can, cấm đi khỏi nơi cư tr&uacute; đối với Trương Thị Trang về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 113, Bộ luật H&igrave;nh sự năm 2015 (sửa đổi, bổ sung năm 2017);<br />
			- Ng&agrave;y 22/9/2020, T&ograve;a &aacute;n Nh&acirc;n d&acirc;n TP. Hồ Ch&iacute; Minh tuy&ecirc;n phạt Trương Thị Trang 03 năm t&ugrave; giam về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo;, 02 năm phạt quản chế kể từ ng&agrave;y chấp h&agrave;nh xong h&igrave;nh phạt t&ugrave;.</td>
		</tr>
		<tr>
			<td>37</td>
			<td>Trần Thị Thu Hạnh</td>
			<td>&nbsp;</td>
			<td>1981</td>
			<td>Việt Nam</td>
			<td>&nbsp;</td>
			<td>TVTDV</td>
			<td>- Qu&ecirc; qu&aacute;n: Vĩnh Long;<br />
			- Hộ khẩu thường tr&uacute;: Ấp Đ&ocirc;ng Hậu, x&atilde; Đ&ocirc;ng B&igrave;nh, thị x&atilde; B&igrave;nh Minh, tỉnh Vĩnh Long;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 2/12;<br />
			- D&acirc;n tộc: Kinh; T&ocirc;n gi&aacute;o: Kh&ocirc;ng;<br />
			- Nghề nghiệp: kh&ocirc;ng;<br />
			- Vai tr&ograve; trong tổ chức: Th&agrave;nh vi&ecirc;n Tổ chức khủng bố &ldquo;Triều đại Việt&rdquo;;<br />
			- H&agrave;nh vi khủng bố: Nhận tiền từ Ng&ocirc; Văn Ho&agrave;ng H&ugrave;ng; mua tiền chất chế tạo quả nổ để thực hiện &acirc;m mưu, &yacute; đồ khủng bố, ph&aacute; hoại;<br />
			- Ng&agrave;y 05/8/2018, bị Cơ quan An ninh điều tra C&ocirc;ng an tỉnh Ki&ecirc;n Giang bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 113 Bộ luật H&igrave;nh sự năm 2015 (sửa đổi, bổ sung năm 2017);<br />
			- Ng&agrave;y 22/9/2020, T&ograve;a &aacute;n Nh&acirc;n d&acirc;n TP. Hồ Ch&iacute; Minh mở phi&ecirc;n t&ograve;a x&eacute;t xử sơ thẩm tuy&ecirc;n phạt Trần Thị Thu Hạnh 03 năm t&ugrave; giam về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo;, 02 năm phạt quản chế kể từ ng&agrave;y chấp h&agrave;nh xong h&igrave;nh phạt t&ugrave;.</td>
		</tr>
		<tr>
			<td>38</td>
			<td>Đ&agrave;o Minh Qu&acirc;n</td>
			<td>Minh Qu&acirc;n,<br />
			Anh Thương</td>
			<td>27/7/1952</td>
			<td>Mỹ</td>
			<td>&nbsp;</td>
			<td>CPVNLT</td>
			<td>Qu&ecirc; qu&aacute;n: Kỳ Hương, Tam Kỳ, Quảng Nam;<br />
			Chỗ ở hiện nay: PO BOX 2807 ANAHEMIM, CA 92814, Mỹ;<br />
			Vai tr&ograve; trong tổ chức: &ldquo;Thủ tướng&rdquo; tự xưng của tổ chức &ldquo;Ch&iacute;nh phủ quốc gia Việt Nam l&acirc;m thời&rdquo;.<br />
			Th&aacute;ng 8/2017, Cơ quan An ninh điều tra, Bộ C&ocirc;ng an ra quyết định khởi tố bị can, truy n&atilde; Đ&agrave;o Minh Qu&acirc;n về tội &ldquo;Khủng bố chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 84 BLHS Việt Nam</td>
		</tr>
		<tr>
			<td>39</td>
			<td>Kelly Triệu Thanh Hoa</td>
			<td>Kelly Triệu</td>
			<td>13/8/1968</td>
			<td>Mỹ</td>
			<td>&nbsp;</td>
			<td>CPVNLT</td>
			<td>Chỗ ở hiện nay: Mỹ;<br />
			Vai tr&ograve; trong tổ chức: cấp bậc &ldquo;chuẩn tướng&rdquo;, chức vụ &ldquo;phụ trách thanh ni&ecirc;n&rdquo; của tổ chức &ldquo;Ch&iacute;nh phủ quốc gia Việt Nam l&acirc;m thời&rdquo;</td>
		</tr>
		<tr>
			<td>40</td>
			<td>L&acirc;m &Aacute;i Huệ</td>
			<td>L&acirc;m Kim Huệ</td>
			<td>02/10/1968</td>
			<td>Canada</td>
			<td>&nbsp;</td>
			<td>CPVNLT</td>
			<td>Chỗ ở hiện nay: Canada;<br />
			Vai tr&ograve; trong tổ chức: cấp bậc &ldquo;chuẩn tướng&rdquo;, chức vụ &ldquo;Thứ trưởng Bộ t&agrave;i ch&iacute;nh&rdquo; của tổ chức &ldquo;Ch&iacute;nh phủ quốc gia Việt Nam l&acirc;m thời&rdquo;</td>
		</tr>
		<tr>
			<td>41</td>
			<td>Phạm Thị Anh Đ&agrave;o</td>
			<td>Lisa Phạm</td>
			<td>04/06/1979</td>
			<td>Mỹ</td>
			<td>&nbsp;</td>
			<td>CPVNLT</td>
			<td>Chỗ ở hiện nay: 614 Progressive Way, Denmark, South California 29042, Mỹ;<br />
			Vai tr&ograve; trong tổ chức: Th&agrave;nh vi&ecirc;n tổ chức &ldquo;Ch&iacute;nh phủ quốc gia Việt Nam l&acirc;m thời&rdquo;, nhiệm vụ k&iacute;ch động khủng bố, ph&aacute; hoại manh động chống ph&aacute; Việt Nam;<br />
			Th&aacute;ng 8/2017, Cơ quan An ninh điều tra, Bộ C&ocirc;ng an ra quyết định khởi tố bị can, truy n&atilde; Phạm Lisa về tội &ldquo;Khủng bố chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 84 BLHS Việt Nam</td>
		</tr>
		<tr>
			<td>42</td>
			<td>L&yacute; Hồng Th&aacute;i</td>
			<td>Nguyễn Minh Ch&aacute;nh</td>
			<td>1952</td>
			<td>Mỹ</td>
			<td>&nbsp;</td>
			<td>CPVNLT</td>
			<td>Qu&ecirc; qu&aacute;n: H&agrave; Nội;<br />
			Chỗ ở hiện nay: Mỹ;<br />
			Vai tr&ograve; trong tổ chức: cấp bậc &ldquo;trung tướng&rdquo;, chức vụ &ldquo;Tổng cục trưởng tổng cục v&otilde; học&rdquo;, &ldquo;T&ocirc;̉ng tham mưu phó Qu&acirc;n lực qu&ocirc;́c gia VNCH&rdquo; của tổ chức &ldquo;Ch&iacute;nh phủ quốc gia Việt Nam l&acirc;m thời&rdquo;</td>
		</tr>
		<tr>
			<td>43</td>
			<td>Nguyễn Đức Thắng</td>
			<td>&nbsp;</td>
			<td>1930</td>
			<td>Mỹ</td>
			<td>&nbsp;</td>
			<td>CPVNLT</td>
			<td>Chỗ ở hiện nay: Mỹ;<br />
			Vai tr&ograve; trong tổ chức: cấp bậc &ldquo;chuẩn tướng&rdquo;, chức vụ &ldquo;Ch&aacute;nh văn ph&ograve;ng Thủ tướng&rdquo; của tổ chức &ldquo;Ch&iacute;nh phủ quốc gia Việt Nam l&acirc;m thời&rdquo;</td>
		</tr>
		<tr>
			<td>44</td>
			<td>Qu&aacute;ch Thế H&ugrave;ng</td>
			<td>L&ecirc; Nguyễn B&igrave;nh</td>
			<td>01/04/1948</td>
			<td>Mỹ</td>
			<td>&nbsp;</td>
			<td>CPVNLT</td>
			<td>Qu&ecirc; qu&aacute;n: thị x&atilde; Thủ Dầu Một, B&igrave;nh Dương;<br />
			Chỗ ở hiện nay: 5386 Somerset St, Los Angeles, California 90032, Mỹ;<br />
			Nghề nghiệp: B&aacute;c sỹ;<br />
			Vai tr&ograve; trong tổ chức: &ldquo;Tổng cục trưởng Tổng cục Qu&acirc;n Huấn&rdquo;, &ldquo;Tổng tham mưu ph&oacute; Qu&acirc;n lực Việt Nam cộng h&ograve;a&rdquo;, cấp bậc &ldquo;đại tướng&rdquo; của tổ chức &ldquo;Ch&iacute;nh phủ quốc gia Việt Nam l&acirc;m thời&rdquo;</td>
		</tr>
		<tr>
			<td>45</td>
			<td>Đặng Ho&agrave;ng Thiện</td>
			<td>&nbsp;</td>
			<td>10/11/1992</td>
			<td>Việt nam</td>
			<td>&nbsp;</td>
			<td>TVVNLT</td>
			<td>- HKTT: Số 9/11 đường số 4, cư x&aacute; Đ&ocirc; Th&agrave;nh, Phường 4, Quận 3, TP. Hồ Ch&iacute; Minh;<br />
			- Chỗ ở khi bị bắt: 241/58 T&acirc;n H&ograve;a Đ&ocirc;ng, Phường 14, Quận 6, TP. Hồ Ch&iacute; Minh;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 12/12;<br />
			- D&acirc;n tộc: Kinh T&ocirc;n gi&aacute;o: Phật gi&aacute;o;<br />
			- Nghề nghiệp: Bu&ocirc;n b&aacute;n;<br />
			- L&agrave; th&agrave;nh vi&ecirc;n tổ chức phản động &ldquo;Ch&iacute;nh phủ quốc gia Việt Nam l&acirc;m thời&rdquo;, tham gia vụ đặt bom xăng tại S&acirc;n bay quốc tế T&acirc;n Sơn Nhất v&agrave;o dịp Lễ 30/4/2017;<br />
			- Th&aacute;ng 4/2017, bị Cơ quan An ninh điều tra Bộ C&ocirc;ng an bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 84 BLHS;<br />
			- Th&aacute;ng 12/2017, T&ograve;a &aacute;n nh&acirc;n d&acirc;n TP. Hồ Ch&iacute; Minh tuy&ecirc;n phạt Đặng Ho&agrave;ng Thiện 16 năm t&ugrave;, 05 năm quản chế về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo;, theo Điều 84 BLHS.</td>
		</tr>
		<tr>
			<td>46</td>
			<td>B&ugrave;i C&ocirc;ng Th&agrave;nh</td>
			<td>&nbsp;</td>
			<td>06/08/1990</td>
			<td>Việt nam</td>
			<td>&nbsp;</td>
			<td>TVVNLT</td>
			<td>- Qu&ecirc; qu&aacute;n: TP. Hồ Ch&iacute; Minh;<br />
			- HKTT: 636A, Khu phố 5, phường Linh Đ&ocirc;ng, quận Thủ Đức, TP. Hồ Ch&iacute; Minh;<br />
			- Chỗ ở khi bị bắt: 679/10 Phan Đăng Lưu, phường Tương B&igrave;nh Hiệp, TP. Thủ Dầu Một, tỉnh B&igrave;nh Dương;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 11/12;<br />
			- D&acirc;n tộc: Kinh T&ocirc;n gi&aacute;o: Thi&ecirc;n ch&uacute;a;<br />
			- Nghề nghiệp: Bảo vệ;<br />
			- L&agrave; th&agrave;nh vi&ecirc;n tổ chức phản động &ldquo;Ch&iacute;nh phủ quốc gia Việt Nam l&acirc;m thời&rdquo;, tham gia vụ đặt bom xăng tại S&acirc;n bay quốc tế T&acirc;n Sơn Nhất v&agrave;o dịp Lễ 30/4/2017;<br />
			- Th&aacute;ng 4/2017, bị Cơ quan An ninh điều tra Bộ C&ocirc;ng an bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo;, theo Điều 84 BLHS;<br />
			- Th&aacute;ng 12/2017, T&ograve;a &aacute;n nh&acirc;n d&acirc;n TP. Hồ Ch&iacute; Minh tuy&ecirc;n B&ugrave;i C&ocirc;ng Th&agrave;nh 08 năm t&ugrave;, 03 năm quản chế về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo;, theo Điều 84 BLHS.</td>
		</tr>
		<tr>
			<td>47</td>
			<td>Vũ Mộng Phong</td>
			<td>&nbsp;</td>
			<td>28/8/1971</td>
			<td>Việt nam</td>
			<td>&nbsp;</td>
			<td>TVVNLT</td>
			<td>- Qu&ecirc; qu&aacute;n: Đồng Nai;<br />
			- HKTT: 143 Th&ocirc;n 2, x&atilde; Gia Huynh, huyện T&aacute;nh Linh, tỉnh B&igrave;nh Thuận;<br />
			- Chỗ ở khi bị bắt: 143 Th&ocirc;n 2, x&atilde; Gia Huynh, huyện T&aacute;nh Linh, tỉnh B&igrave;nh Thuận;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 6/12;<br />
			- D&acirc;n tộc: Kinh T&ocirc;n gi&aacute;o: Kh&ocirc;ng;<br />
			- Nghề nghiệp: Lao động tự do;<br />
			- Th&aacute;ng 4/2017, bị Cơ quan An ninh điều tra Bộ C&ocirc;ng an bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 84 BLHS;<br />
			- Th&aacute;ng 12/2017, T&ograve;a &aacute;n nh&acirc;n d&acirc;n TP. Hồ Ch&iacute; Minh tuy&ecirc;n phạt Vũ Mộng Phong 08 năm t&ugrave;, 03 năm quản chế về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo;, theo Điều 84 BLHS.</td>
		</tr>
		<tr>
			<td>48</td>
			<td>Trương Tấn Ph&aacute;t</td>
			<td>&nbsp;</td>
			<td>21/01/1984</td>
			<td>Việt nam</td>
			<td>&nbsp;</td>
			<td>TVVNLT</td>
			<td><br />
			4. Đối tượng Trương Tấn Ph&aacute;t<br />
			<br />
			- Họ v&agrave; t&ecirc;n: Trương Tấn Ph&aacute;t<br />
			- Sinh ng&agrave;y: 21/01/1984;<br />
			- Qu&ecirc; qu&aacute;n: TP. Hồ Ch&iacute; Minh;<br />
			- HKTT: 173/6A1 Trường Chinh, phường T&acirc;n Hưng Thuận, Quận 12, TP. Hồ Ch&iacute; Minh;<br />
			- Chỗ ở khi bị bắt: 173/6A1 Trường Chinh, phường T&acirc;n Hưng Thuận, Quận 12, TP. Hồ Ch&iacute; Minh;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 12/12;<br />
			- D&acirc;n tộc: Kinh T&ocirc;n gi&aacute;o: Thi&ecirc;n ch&uacute;a;<br />
			- Nghề nghiệp: Họa vi&ecirc;n kiến tr&uacute;c x&acirc;y dựng;<br />
			- Th&aacute;ng 4/2017, bị Cơ quan An ninh điều tra Bộ C&ocirc;ng an bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 84 BLHS;<br />
			- Th&aacute;ng 12/2017, T&ograve;a &aacute;n nh&acirc;n d&acirc;n TP. Hồ Ch&iacute; Minh tuy&ecirc;n phạt Trương Tấn Ph&aacute;t 05 năm t&ugrave;, 03 năm quản chế về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo;, theo Điều 84 BLHS.</td>
		</tr>
		<tr>
			<td>49</td>
			<td>Trần Văn No</td>
			<td>&nbsp;</td>
			<td>17/5/1984</td>
			<td>Việt nam</td>
			<td>&nbsp;</td>
			<td>TVVNLT</td>
			<td>- Qu&ecirc; qu&aacute;n: Quảng Nam;<br />
			- HKTT: Ấp C&ocirc;ng Tạo, x&atilde; B&igrave;nh Ph&uacute;, huyện T&acirc;n Hồng, tỉnh Đồng Th&aacute;p;<br />
			- Chỗ ở khi bị bắt: 110/30, tổ 54, Khu phố 3, phường An Ph&uacute; Đ&ocirc;ng, Quận 12, TP. Hồ Ch&iacute; Minh;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 6/12;<br />
			- D&acirc;n tộc: Kinh T&ocirc;n gi&aacute;o: Tin l&agrave;nh;<br />
			- Nghề nghiệp: Thợ may;<br />
			- Th&aacute;ng 4/2017, bị Cơ quan An ninh điều tra Bộ C&ocirc;ng an bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 84 BLHS;<br />
			- Th&aacute;ng 12/2017, T&ograve;a &aacute;n nh&acirc;n d&acirc;n TP. Hồ Ch&iacute; Minh tuy&ecirc;n phạt Trần Văn No 06 năm t&ugrave;, 03 năm quản chế về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo;, theo Điều 84 BLHS.</td>
		</tr>
		<tr>
			<td>50</td>
			<td>Trần Quốc Lượng</td>
			<td>&nbsp;</td>
			<td>20/01/1991</td>
			<td>Việt nam</td>
			<td>&nbsp;</td>
			<td>TVVNLT</td>
			<td>- Qu&ecirc; qu&aacute;n: B&igrave;nh Định;<br />
			- HKTT: Th&ocirc;n Thanh Hợp, x&atilde; Vụ Bổn, huyện Kr&ocirc;ng Păk, tỉnh Đăk Lăk;<br />
			- Chỗ ở khi bị bắt: 254 đường x&iacute; nghiệp B&ocirc;ng Nam Bộ, ấp Thanh H&oacute;a, x&atilde; Hố Nai 3, huyện Trảng Bom, tỉnh Đồng Nai;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 12/12;<br />
			- D&acirc;n tộc: Kinh T&ocirc;n gi&aacute;o: Kh&ocirc;ng;<br />
			- Nghề nghiệp: Kỹ thuật vi&ecirc;n điện thoại;<br />
			- Th&aacute;ng 4/2017, bị Cơ quan An ninh điều tra Bộ C&ocirc;ng an bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 84 BLHS;<br />
			- Th&aacute;ng 12/2017, T&ograve;a &aacute;n nh&acirc;n d&acirc;n TP. Hồ Ch&iacute; Minh tuy&ecirc;n phạt Trần Quốc Lượng 05 năm t&ugrave;, 03 năm quản chế về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo;, theo Điều 84 BLHS.</td>
		</tr>
		<tr>
			<td>51</td>
			<td>Th&aacute;i H&agrave;n Phong</td>
			<td>&nbsp;</td>
			<td>22/9/1982</td>
			<td>Việt nam</td>
			<td>&nbsp;</td>
			<td>TVVNLT</td>
			<td>- Qu&ecirc; qu&aacute;n: Đồng Nai;<br />
			- HKTT: Ấp Thọ H&ograve;a, x&atilde; Xu&acirc;n Thọ, huyện Xu&acirc;n Lộc, tỉnh Đồng Nai;<br />
			- Chỗ ở khi bị bắt: Th&ocirc;n 2, x&atilde; Gia Huynh, huyện T&aacute;nh Linh, tỉnh B&igrave;nh Thuận;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 9/12;<br />
			- D&acirc;n tộc: Kinh T&ocirc;n gi&aacute;o: Kh&ocirc;ng;<br />
			- Nghề nghiệp: Lao động tự do;<br />
			- Th&aacute;ng 4/2017, bị Cơ quan An ninh điều tra Bộ C&ocirc;ng an bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 84 BLHS;<br />
			- Th&aacute;ng 12/2017, T&ograve;a &aacute;n nh&acirc;n d&acirc;n TP. Hồ Ch&iacute; Minh tuy&ecirc;n phạt Th&aacute;i H&agrave;n Phong 14 năm t&ugrave;, 05 năm quản chế về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo;, theo Điều 84 BLHS.</td>
		</tr>
		<tr>
			<td>52</td>
			<td>Nguyễn Thị Chung</td>
			<td>&nbsp;</td>
			<td>07/07/1982</td>
			<td>Việt nam</td>
			<td>&nbsp;</td>
			<td>TVVNLT</td>
			<td>- Qu&ecirc; qu&aacute;n: Bến Tre;<br />
			- HKTT: Khu phố 3, thị trấn Dầu Tiếng, huyện Dầu Tiếng, tỉnh B&igrave;nh Dương;<br />
			- Chỗ ở khi bị bắt: Khu phố 1, thị trấn Dầu Tiếng, huyện Dầu Tiếng, tỉnh B&igrave;nh Dương;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 12/12;<br />
			- D&acirc;n tộc: Kinh T&ocirc;n gi&aacute;o: Kh&ocirc;ng;<br />
			- Nghề nghiệp: C&ocirc;ng nh&acirc;n;<br />
			- Th&aacute;ng 4/2017, bị Cơ quan An ninh điều tra Bộ C&ocirc;ng an bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 84 BLHS;<br />
			- Th&aacute;ng 12/2017, T&ograve;a &aacute;n nh&acirc;n d&acirc;n TP. Hồ Ch&iacute; Minh tuy&ecirc;n phạt Nguyễn Thị Chung 12 năm t&ugrave;, 05 năm quản chế về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo;, theo Điều 84 BLHS</td>
		</tr>
		<tr>
			<td>53</td>
			<td>Nguyễn Ngọc Tiền</td>
			<td>&nbsp;</td>
			<td>17/10/1990</td>
			<td>Việt nam</td>
			<td>&nbsp;</td>
			<td>TVVNLT</td>
			<td>- Qu&ecirc; qu&aacute;n: B&igrave;nh Dương;<br />
			- HKTT: 16/2 tổ 24, khu phố Long Thới, phường L&aacute;i Thi&ecirc;u, thị x&atilde; Thuận An, tỉnh B&igrave;nh Dương;<br />
			- Chỗ ở khi bị bắt: 16/2 tổ 24, khu phố Long Thới, phường L&aacute;i Thi&ecirc;u, thị x&atilde; Thuận An, tỉnh B&igrave;nh Dương;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 6/12;<br />
			- D&acirc;n tộc: Kinh T&ocirc;n gi&aacute;o: Kh&ocirc;ng;<br />
			- Nghề nghiệp: Lao động tự do;<br />
			- Th&aacute;ng 4/2017, bị Cơ quan An ninh điều tra Bộ C&ocirc;ng an bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 84 BLHS;<br />
			- Th&aacute;ng 12/2017, T&ograve;a &aacute;n nh&acirc;n d&acirc;n TP. Hồ Ch&iacute; Minh tuy&ecirc;n phạt Nguyễn Ngọc Tiền 11 năm t&ugrave;, 03 năm quản chế về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo;, theo Điều 84 BLHS.</td>
		</tr>
		<tr>
			<td>54</td>
			<td>Nguyễn Đức Sinh</td>
			<td>&nbsp;</td>
			<td>25/02/1985</td>
			<td>Việt nam</td>
			<td>&nbsp;</td>
			<td>TVVNLT</td>
			<td>- Qu&ecirc; qu&aacute;n: Qu&atilde;ng Ng&atilde;i;<br />
			- HKTT: Th&ocirc;n Định T&acirc;n, x&atilde; B&igrave;nh Ch&acirc;u, huyện B&igrave;nh Sơn, tỉnh Quảng Ng&atilde;i;<br />
			- Chỗ ở khi bị bắt: Th&ocirc;n 2, x&atilde; Gia Huynh, huyện T&aacute;nh Linh, tỉnh B&igrave;nh Thuận;<br />
			- D&acirc;n tộc: Kinh T&ocirc;n gi&aacute;o: Kh&ocirc;ng;<br />
			- Nghề nghiệp: Lao động tự do;<br />
			- Th&aacute;ng 4/2017, bị Cơ quan An ninh điều tra Bộ C&ocirc;ng an bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 84 BLHS;<br />
			- Th&aacute;ng12/2017, T&ograve;a &aacute;n nh&acirc;n d&acirc;n TP. Hồ Ch&iacute; Minh tuy&ecirc;n phạt Nguyễn Đức Sinh 10 năm t&ugrave;, 03 năm quản chế về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo;, theo Điều 84 BLHS</td>
		</tr>
		<tr>
			<td>55</td>
			<td>Ng&ocirc; Thụy Tường Vy</td>
			<td>&nbsp;</td>
			<td>26/02/1986</td>
			<td>Việt nam</td>
			<td>&nbsp;</td>
			<td>TVVNLT</td>
			<td>Qu&ecirc; qu&aacute;n: Đồng Nai;<br />
			- HKTT: 46/11/6 Trần Th&aacute;nh T&ocirc;ng, phường 15, quận T&acirc;n B&igrave;nh, TP. Hồ Ch&iacute; Minh;<br />
			- Chỗ ở khi bị bắt: 46/11/6 Trần Th&aacute;nh T&ocirc;ng, phường 15, quận T&acirc;n B&igrave;nh, TP. Hồ Ch&iacute; Minh;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 12/12 Chuy&ecirc;n m&ocirc;n: Cao đẳng s&acirc;n khấu Điện ảnh;<br />
			- D&acirc;n tộc: Kinh T&ocirc;n gi&aacute;o: Thi&ecirc;n ch&uacute;a;<br />
			- Nghề nghiệp: Dạy Yoga;<br />
			- Th&aacute;ng 4/2017, bị Cơ quan An ninh điều tra Bộ C&ocirc;ng an bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 84 BLHS;<br />
			- Ng&agrave;y 26, 27/12/2017, T&ograve;a &aacute;n nh&acirc;n d&acirc;n TP. Hồ Ch&iacute; Minh tuy&ecirc;n phạt Ng&ocirc; Thụy Tường Vy 11 năm t&ugrave;, 03 năm quản chế về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo;, theo Điều 84 BLHS</td>
		</tr>
		<tr>
			<td>56</td>
			<td>L&ecirc; H&ugrave;ng Cường</td>
			<td>&nbsp;</td>
			<td>05/05/1991</td>
			<td>Việt nam</td>
			<td>&nbsp;</td>
			<td>TVVNLT</td>
			<td>- Qu&ecirc; qu&aacute;n: Long An;<br />
			- HKTT: Số 18 Ng&ocirc; Quyền, tổ 19, ấp Trường An, x&atilde; Trường T&acirc;y, huyện H&ograve;a Th&agrave;nh, tỉnh T&acirc;y Ninh;<br />
			- Chỗ ở khi bị bắt: 100/15 Phan Chu Trinh, phường L&aacute;i Thi&ecirc;u, thị x&atilde; Thuận An, tỉnh B&igrave;nh Dương;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 6/12;<br />
			- D&acirc;n tộc: Kinh T&ocirc;n gi&aacute;o: Cao đ&agrave;i;<br />
			- Nghề nghiệp: Lao động tự do;<br />
			- Th&aacute;ng 4/2017, bị Cơ quan An ninh điều tra Bộ C&ocirc;ng an bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 84 BLHS;<br />
			- Th&aacute;ng 12/2017, T&ograve;a &aacute;n nh&acirc;n d&acirc;n TP. Hồ Ch&iacute; Minh tuy&ecirc;n phạt L&ecirc; H&ugrave;ng Cường 05 năm t&ugrave;, 03 năm quản chế về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo;, theo Điều 84 BLHS</td>
		</tr>
		<tr>
			<td>57</td>
			<td>H&ugrave;ng Văn Vương</td>
			<td>&nbsp;</td>
			<td>30/6/1993</td>
			<td>Việt nam</td>
			<td>&nbsp;</td>
			<td>TVVNLT</td>
			<td>- Qu&ecirc; qu&aacute;n: B&igrave;nh Định;<br />
			- HKTT: 63/7/12 Nguyễn Huệ, Tổ 1, Khu vực 1, phường Trần Ph&uacute;, TP. Quy Nhơn, tỉnh B&igrave;nh Định;<br />
			- Chỗ ở khi bị bắt: 63/7/12 Nguyễn Huệ, Tổ 1, Khu vực 1, phường Trần Ph&uacute;, TP. Quy Nhơn, tỉnh B&igrave;nh Định;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 9/12;<br />
			- D&acirc;n tộc: Kinh T&ocirc;n gi&aacute;o: Kh&ocirc;ng;<br />
			- Nghề nghiệp: Lao động tự do;<br />
			- Th&aacute;ng 4/2017, bị Cơ quan An ninh điều tra Bộ C&ocirc;ng an bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 84 BLHS;<br />
			- Th&aacute;ng 12/2017, T&ograve;a &aacute;n nh&acirc;n d&acirc;n TP. Hồ Ch&iacute; Minh tuy&ecirc;n phạt H&ugrave;ng Văn Vương 06 năm t&ugrave;, 03 năm quản chế về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo;, theo Điều 84 BLHS</td>
		</tr>
		<tr>
			<td>58</td>
			<td>Ho&agrave;ng Văn Dương</td>
			<td>&nbsp;</td>
			<td>06/05/1994</td>
			<td>Việt nam</td>
			<td>&nbsp;</td>
			<td>TVVNLT</td>
			<td>Qu&ecirc; qu&aacute;n: Đồng Nai;<br />
			- HKTT: Khu phố 3, phường Xu&acirc;n Thanh, thị x&atilde; Long Kh&aacute;nh, tỉnh Đồng Nai;<br />
			- Chỗ ở khi bị bắt: Ấp Suối Đục, x&atilde; Xu&acirc;n T&acirc;m, huyện Xu&acirc;n Lộc, tỉnh Đồng Nai;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 6/12;<br />
			- D&acirc;n tộc: Kinh T&ocirc;n gi&aacute;o: Kh&ocirc;ng;<br />
			- Nghề nghiệp: c&ocirc;ng nh&acirc;n;<br />
			- Th&aacute;ng 4/2017, bị Cơ quan An ninh điều tra Bộ C&ocirc;ng an bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 84 BLHS;<br />
			- Th&aacute;ng 12/2017, T&ograve;a &aacute;n nh&acirc;n d&acirc;n TP. Hồ Ch&iacute; Minh tuy&ecirc;n phạt Ho&agrave;ng Văn Dương 04 năm t&ugrave;, 03 năm quản chế về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo;, theo Điều 84 BLHS</td>
		</tr>
		<tr>
			<td>59</td>
			<td>Đo&agrave;n Văn Thế</td>
			<td>&nbsp;</td>
			<td>14/3/1994</td>
			<td>Việt nam</td>
			<td>&nbsp;</td>
			<td>TVVNLT</td>
			<td>- Qu&ecirc; qu&aacute;n: Th&aacute;i B&igrave;nh;<br />
			- HKTT: Th&ocirc;n B&aacute;t Cấp Đ&ocirc;ng, x&atilde; Bắc Hải, huyện Tiền Hải, tỉnh Th&aacute;i B&igrave;nh;<br />
			- Chỗ ở khi bị bắt: Th&ocirc;n B&aacute;t Cấp Đ&ocirc;ng, x&atilde; Bắc Hải, huyện Tiền Hải, tỉnh Th&aacute;i B&igrave;nh;<br />
			- Tr&igrave;nh độ văn h&oacute;a: 12/12;<br />
			- Chuy&ecirc;n m&ocirc;n: Cao đẳng y;<br />
			- D&acirc;n tộc: Kinh T&ocirc;n gi&aacute;o: Kh&ocirc;ng;<br />
			- Nghề nghiệp: Lao động tự do;<br />
			- Th&aacute;ng 4/2017, bị Cơ quan An ninh điều tra Bộ C&ocirc;ng an bắt về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo; theo Điều 84 BLHS;<br />
			- Th&aacute;ng 12/2017, T&ograve;a &aacute;n nh&acirc;n d&acirc;n TP. Hồ Ch&iacute; Minh tuy&ecirc;n phạt Đo&agrave;n Văn Thế 07 năm t&ugrave;, 03 năm quản chế về tội &ldquo;Khủng bố nhằm chống ch&iacute;nh quyền nh&acirc;n d&acirc;n&rdquo;, theo Điều 84 BLHS.</td>
		</tr>
		<tr>
			<td>60</td>
			<td>IGNACE MURWANASHYAKA</td>
			<td>&nbsp;</td>
			<td>14 May 1963</td>
			<td>Rwanda</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Reported to have died in prison in Germany on 16 April 2019. Arrested by German authorities on 17 November 2009 and found guilty by a German court on 28 September 2015 of leadership of a foreign terrorist group and aiding in war crimes. Received a 13-year sentence and is in prison in Germany as of June 2016. Re-elected FDLR President on 29 November 2014 for a five-year term.</td>
		</tr>
		<tr>
			<td>61</td>
			<td>STRATON MUSONI</td>
			<td>&nbsp;</td>
			<td>6 Apr. 1961</td>
			<td>Rwanda</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Arrested by German authorities on 17 November 2009, found guilty in a German court on 28 September 2015 of leadership of a foreign terrorist group, and received an 8-year sentence. Musoni was released from prison immediately after the trial, having served over 5 years of his sentence.</td>
		</tr>
		<tr>
			<td>62</td>
			<td>OMAR MAHMOUD UTHMAN</td>
			<td>&nbsp;</td>
			<td>30 Dec. 1960</td>
			<td>Jordan</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Associated with Al-Qaida-related groups in the United Kingdom and other countries. Convicted in absentia in Jordan for involvement in terrorist acts in 1998. Arrested in Feb. 2001 in the United Kingdom, was further detained between Oct. 2002 and Mar. 2005 and between Aug. 2005 and Jun. 2008. In custody since Dec. 2008. Deported to Jordan from the United Kingdom on 7 July 2013 to face terrorism charges. Review pursuant to Security Council resolution 1822 (2008) was concluded on 19 Oct. 2009. Review pursuant to Security Council resolution 2368 (2017) was concluded on 4 Dec. 2019</td>
		</tr>
		<tr>
			<td>63</td>
			<td>ADEL</td>
			<td>&nbsp;</td>
			<td>14 Jul. 1970</td>
			<td>Tunisia</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Deported from Italy to Tunisia on 28 February 2004. Serving a 12-year prison sentence in Tunisia for membership in a terrorist organization abroad as at Jan. 2010. Arrested in Tunisia in 2013. Legally changed family name from Ben Soltane to Hamdi in 2014. Review pursuant to Security Council resolution 1822 (2008) was concluded on 21 Jun. 2010. Review pursuant to Security Council resolution 2368 (2017) was concluded on 4 Dec. 2019.</td>
		</tr>
		<tr>
			<td>64</td>
			<td>MEHDI</td>
			<td>&nbsp;</td>
			<td>3 Apr. 1968</td>
			<td>Tunisia</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Italian Fiscal Code: KMMMHD68D03Z352N. Deported from Italy to Tunisia on 22 July 2005. Serving an eight-year prison term in Tunisia for membership of a terrorist organization abroad as at Jan. 2010. Review pursuant to Security Council resolution 1822 (2008) was concluded on 21 Jun. 2010. Review pursuant to Security Council resolution 2368 (2017) was concluded on 4 Dec. 2019</td>
		</tr>
		<tr>
			<td>65</td>
			<td>MOUNIR</td>
			<td>&nbsp;</td>
			<td>3 Apr. 1974</td>
			<td>Morocco</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Arrested on 28 Nov. 2001 and found guilty in Germany of being an accessory to murder and of membership in a terrorist organization and sentenced to 15 years of imprisonment on 8 Jan. 2007. Father&#39;s name is Brahim Brik. Mother&#39;s name is Habiba Abbes. Review pursuant to Security Council resolution 1822 (2008) was concluded on 20 May 2010. Review pursuant to Security Council resolution 2368 (2017) was concluded on 4 Dec. 2019</td>
		</tr>
		<tr>
			<td>66</td>
			<td>YAZID</td>
			<td>&nbsp;</td>
			<td>20 Jan. 1964</td>
			<td>Malaysia</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Founding member of Jemaah Islamiyah (JI) (QDe.092) who worked on Al-Qaida&rsquo;s (QDe.004) biological weapons program, provided support to those involved in Al-Qaida&rsquo;s 11 Sep. 2001 attacks in the United States of America, and was involved in JI bombing operations. Detained in Malaysia from 2001 to 2008. Arrested in Malaysia in 2013 and sentenced to 7 years in Jan. 2016 for failing to report information relating to terrorist acts. Due for release in Feb. 2020. Review pursuant to Security Council resolution 1989 (2011) was concluded on 6 Mar. 2014. Photos included in INTERPOL-UN Security Council Special Notice web link: https://www.interpol.int/en/notice/search/un/1424794. Review pursuant to Security Council resolution 2253 (2015) was concluded on 21 Feb. 2019.</td>
		</tr>
		<tr>
			<td>67</td>
			<td>AL-AZHAR</td>
			<td>&nbsp;</td>
			<td>20 Nov. 1975</td>
			<td>Tunisia</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Sentenced to six years and ten months of imprisonment for membership of a terrorist association by the Appeal Court of Milan, Italy, on 7 Feb. 2008. Imprisoned in Sfax Prison on 5 June 2007 pursuant to an order issued by the Appeals Tribunal in Tunisia for joining an organization linked to terrorist crimes (case No.9301/207). Sentenced to two years and 15 days&rsquo; imprisonment and released on 18 June 2008.U Considered a fugitive from justice by the Italian authorities as at Jul. 2008. Under administrative control measure in Tunisia as at 2010. Review pursuant to Security Council resolution 1822 (2008) was concluded on 21 Jun. 2010. Review pursuant to Security Council resolution 2368 (2017) was concluded on 24 November 2020</td>
		</tr>
		<tr>
			<td>68</td>
			<td>ISNILON</td>
			<td>&nbsp;</td>
			<td>18 Mar. 1966</td>
			<td>Philippines</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Senior leader of Abu Sayyaf Group (ASG) (QDe.001). Leader of local affiliates of the Islamic State in Iraq and the Levant (ISIL), listed as Al-Qaida in Iraq (AQI) (QDe.115), in the southern Philippines as of May 2017. Physical description: eye colour: brown; hair colour: brown; height: 5 feet 6 inches &ndash; 168 cm; weight: 120 pounds &ndash; 54 kg; build: slim; complexion: light-skinned; has facial birthmarks. Review pursuant to Security Council resolution 1822 (2008) was concluded on 8 Jun. 2010. Wanted by the Philippines authorities for terrorist offences and by authorities of the United States of America for involvement in terrorist acts. Review pursuant to Security Council resolution 2368 (2017) was concluded on 4 Dec. 2019</td>
		</tr>
		<tr>
			<td>69</td>
			<td>RADULAN</td>
			<td>&nbsp;</td>
			<td>1955</td>
			<td>Philippines</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Physical description: eye colour: black; hair colour: gray; height: 5 feet 6 inches &ndash; 168 cm; weight: 140 pounds &ndash; 64 kg; build: slight; right arm is amputated above his elbow. Review pursuant to Security Council resolution 1822 (2008) was concluded on 8 Jun. 2010. Wanted by the Philippines authorities for terrorist offences and by authorities of the United States of America for involvement in the kidnapping of its national. Photos included in. Review pursuant to Security Council resolution 2368 (2017) was concluded on 24 November 2020.</td>
		</tr>
		<tr>
			<td>70</td>
			<td>NESSIM</td>
			<td>&nbsp;</td>
			<td>3 Aug. 1973</td>
			<td>Tunisia</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Considered a fugitive from justice by the Italian authorities and sentenced in absentia to 6 years detention on 20 Nov. 2008. Sentenced in Tunisia to 4 years imprisonment for terrorist activity and in detention in Tunisia as at Jun. 2009. Review pursuant to Security Council resolution 1822 (2008) was concluded on 20 Jul. 2009. Review pursuant to Security Council resolution 2368 (2017) was concluded on 24 November 2020</td>
		</tr>
		<tr>
			<td>71</td>
			<td>GHAZY</td>
			<td>&nbsp;</td>
			<td>1974</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>He is a cousin of Akram Turki Hishan Al Mazidih (QDi.276). Terrorist attack organizer for the Islamic State in Iraq and the Levant, listed as Al-Qaida in Iraq (AQI) (QDe.115) as of 2015. Review pursuant to Security Council resolution 2253 (2015) was concluded on 21 Feb. 2019</td>
		</tr>
		<tr>
			<td>72</td>
			<td>UMAR</td>
			<td>&nbsp;</td>
			<td>20 Jul. 1966</td>
			<td>Indonesia</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Senior member of Jemaah Islamiyah (QDe.092) involved in planning and funding multiple terrorist attacks in the Philippines and Indonesia. Provided training to Abu Sayyaf Group (QDe.001). Convicted for his role in the 2002 Bali bombings and sentenced to 20 years in prison in Jun. 2012. Remains in custody in Indonesia as at May 2015. Review pursuant to Security Council resolution 2368 (2017) was concluded on 15 November 2021</td>
		</tr>
		<tr>
			<td>73</td>
			<td>MUHAMMAD</td>
			<td>&nbsp;</td>
			<td>28 May 1984</td>
			<td>Indonesian</td>
			<td>3219222002</td>
			<td>HDBALHQCD</td>
			<td>Senior member of Jemaah Islamiyah (QDe.092) directly involved in obtaining funding for terrorist attacks. Sentenced in Indonesia to five years in prison on 29 Jun. 2010. Father&rsquo;s name is Mohamad Iqbal Abdurrahman (QDi.086). Review pursuant to Security Council resolution 2368 (2017) was concluded on 24 November 2020. Review pursuant to Security Council resolution 2368 (2017) was concluded on 15 November 2021</td>
		</tr>
		<tr>
			<td>74</td>
			<td>JAMAL</td>
			<td>&nbsp;</td>
			<td>1 Jan. 1964</td>
			<td>Egypt</td>
			<td>6487</td>
			<td>HDBALHQCD</td>
			<td>rained in Afghanistan in the late 1980s with Al-Qaida (QDe.004) to make bombs. Former top military commander of the Egyptian Islamic Jihad (QDe.003). Since 2011, established Muhammad Jamal Network (MJN) (QDe.136) and terrorist training camps in Egypt and Libya. Conducted MJN&rsquo;s terrorist activities with support from Al-Qaida in the Arabian Peninsula (AQAP) (QDe.129). Reported to be involved in the attack on the United States Mission in Benghazi, Libya, on 11 Sep. 2012. Headed Nasr City terrorist cell in Egypt in 2012. Linked to Aiman al-Zawahiri (QDi.006) and the leadership of AQAP and the Organization of Al-Qaida in the Islamic Maghreb (AQIM) (QDe.014). Arrested and imprisoned multiple times by Egyptian authorities since ca. 2000. Released in 2011 but re-arrested by Egyptian authorities in Nov. 2012. Imprisoned in Egypt pending trial as of Sep. 2013. Wife&rsquo;s name is Samah &lsquo;Ali Al-Dahabani (Yemeni national). Review pursuant to Security Council resolution 2253 (2015) was concluded on 21 Feb. 2019</td>
		</tr>
		<tr>
			<td>75</td>
			<td>ABUBAKAR</td>
			<td>&nbsp;</td>
			<td>1969</td>
			<td>Nigeria</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Member of the Kanuri tribe. Physical description: eye colour: black; hair colour: black. Photo available for inclusion in the INTERPOL-UN Security Council Special Notice. Leader of Jama&#39;atu Ahlis Sunna Lidda&#39;Awati Wal-Jihad (Boko Haram) (QDe.138). Under Shekau&rsquo;s leadership, Boko Haram has been responsible for a series of major terrorist attacks. Review pursuant to Security Council resolution 2368 (2017) was concluded on 4 Dec. 2019</td>
		</tr>
		<tr>
			<td>76</td>
			<td>SAID</td>
			<td>&nbsp;</td>
			<td>25 Jun. 1964</td>
			<td>Algeria</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>A veteran member of the &lsquo;Chechen Network&rsquo; (not listed) and other terrorist groups. He was convicted of his role and membership in the &lsquo;Chechen Network&rsquo; in France in 2006. Joined Jabhat al-Nusrah, listed as Al-Nusrah Front for the People of the Levant (QDe.137) in October 2013. Review pursuant to Security Council resolution 2368 (2017) was concluded on 4 Dec. 2019</td>
		</tr>
		<tr>
			<td>77</td>
			<td>EMILIE</td>
			<td>&nbsp;</td>
			<td>9 Dec. 1984</td>
			<td>France</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>French terrorist fighter who travelled to Syria and joined Islamic State in Iraq and the Levant, listed as Al-Qaida in Iraq (AQI) (QDe.115). Active in radicalizing and propagating Al-Qaida&rsquo;s (QDe.004) ideology through the Internet. Incites violent activities against France. French arrest warrant issued on 12 Jun. 2015 by a magistrate of the anti-terrorism division of the Prosecutor&rsquo;s Office in Paris for her participation in a terrorist criminal association. Review pursuant to Security Council resolution 2368 (2017) was concluded on 15 November 2021</td>
		</tr>
		<tr>
			<td>78</td>
			<td>KEVIN</td>
			<td>&nbsp;</td>
			<td>12 Mar. 1993</td>
			<td>France</td>
			<td>05AT521433</td>
			<td>HDBALHQCD</td>
			<td>French terrorist fighter who travelled to Syria and joined Islamic State in Iraq and the Levant, listed as Al-Qaida in Iraq (AQI) (QDe.115). Active in radicalizing and propagating Al-Qaida&rsquo;s (QDe.004) ideology through the Internet. Incites violent activities against France. French arrest warrant issued on 12 Jun. 2015 by a magistrate of the anti-terrorism division of the Prosecutor&rsquo;s Office in Paris for her participation in a terrorist criminal association. Review pursuant to Security Council resolution 2368 (2017) was concluded on 15 November 2021</td>
		</tr>
		<tr>
			<td>79</td>
			<td>OUMAR</td>
			<td>&nbsp;</td>
			<td>5 Aug. 1975</td>
			<td>Senegal</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>A leader of an armed group linked to Al-Nusrah Front for the People of the Levant (QDe.137) and a key facilitator for a Syrian foreign terrorist fighter network. Active in terrorist propaganda through the Internet. Review pursuant to Security Council resolution 2368 (2017) was concluded on 4 Dec. 2019</td>
		</tr>
		<tr>
			<td>80</td>
			<td>ALI</td>
			<td>&nbsp;</td>
			<td>9 Mar. 1986</td>
			<td>Tunisia</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Physical description: eye colour: brown; height: 171cm. Photo available for inclusion in the INTERPOL-UN Security Council Special Notice. Previous occupation: trading agent. A member of Ansar al-Shari&rsquo;a in Tunisia (QDe.143), active in recruitment of foreign terrorist fighters and arms smuggling. Detained and sentenced to 30 months imprisonment for planning terrorist acts in 2005 in Tunisia. Planned and perpetrated the attack against the Consulate of the United States in Benghazi, Libya on 11 Sep. 2012. Arrest warrant issued by the Tunisian National Guard (as at Mar. 2015). Father&rsquo;s name is Taher Ouni Harzi, mother&rsquo;s name is Borkana Bedairia. Reportedly killed in an airstrike in Mosul, Iraq, in Jun. 2015. Review pursuant to Security Council resolution 2253 (2015) was concluded on 21 Feb. 2019. Review pursuant to Security Council resolution 2368 (2017) was concluded on 15 November 2021</td>
		</tr>
		<tr>
			<td>81</td>
			<td>TARAK</td>
			<td>&nbsp;</td>
			<td>3 May 1982</td>
			<td>Tunisia</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Physical description: eye colour: brown; height: 172cm. Photo available for inclusion in the INTERPOL-UN Security Council Special Notice. Previous occupation: worker. A dangerous and active member of Al Qaida in Iraq (QDe.115) in 2004, also active in facilitating and hosting members of Ansar al-Shari&rsquo;a in Tunisia (QDe.143) in Syria. Sentenced, in absentia, on 30 October 2007, to 24 years imprisonment for terrorist activities by the Appeals Court of Tunis. Father&rsquo;s name is Taher Ouni Harzi, mother&rsquo;s name is Borkana Bedairia. Reportedly killed in Syria in Jun. 2015. Review pursuant to Security Council resolution 2253 (2015) was concluded on 21 Feb. 2019. Review pursuant to Security Council resolution 2368 (2017) was concluded on 15 November 2021</td>
		</tr>
		<tr>
			<td>82</td>
			<td>ASEEL</td>
			<td>&nbsp;</td>
			<td>22 Nov. 1996</td>
			<td>United Kingdom of Great Britain and Northern Ireland</td>
			<td>516088643</td>
			<td>HDBALHQCD</td>
			<td>Foreign terrorist fighter with Islamic State in Iraq and the Levant, listed as Al-Qaida in Iraq (QDe.115), in the Syrian Arab Republic. Wanted by the authorities of the United Kingdom. Physical description: hair colour: brown/black. Review pursuant to Security Council resolution 2368 (2017) was concluded on 24 November 2020</td>
		</tr>
		<tr>
			<td>83</td>
			<td>NASSER</td>
			<td>&nbsp;</td>
			<td>29 Apr. 1994</td>
			<td>United Kingdom of Great Britain and Northern Ireland</td>
			<td>210804241</td>
			<td>HDBALHQCD</td>
			<td>Foreign terrorist fighter with Islamic State in Iraq and the Levant (ISIL), listed as Al-Qaida in Iraq (QDe.115), in the Syrian Arab Republic. Wanted by the authorities of the United Kingdom. Physical description: hair colour: brown/black. Photo available for inclusion in the INTERPOL-UN Security Council Special Notice. Review pursuant to Security Council resolution 2368 (2017) was concluded on 24 November 2020</td>
		</tr>
		<tr>
			<td>84</td>
			<td>OMAR</td>
			<td>&nbsp;</td>
			<td>21 Mar. 1987</td>
			<td>United Kingdom of Great Britain and Northern Ireland</td>
			<td>205939411</td>
			<td>HDBALHQCD</td>
			<td>Foreign terrorist fighter with Islamic State in Iraq and the Levant (ISIL), listed as Al-Qaida in Iraq (QDe.115), in the Syrian Arab Republic. Physical description: eye colour: brown; hair colour: brown/black. Photo available for inclusion in the INTERPOL-UN Security Council Special Notice. Review pursuant to Security Council resolution 2368 (2017) was concluded on 24 November 2020</td>
		</tr>
		<tr>
			<td>85</td>
			<td>MAGHOMED</td>
			<td>&nbsp;</td>
			<td>24 Nov. 1974</td>
			<td>Russian Federation</td>
			<td>515458008</td>
			<td>HDBALHQCD</td>
			<td>As at Aug. 2015, leader of Jamaat Abu Banat terrorist group, which forms part of the Islamic State in Iraq and the Levant (ISIL), listed as Al-Qaida in Iraq (QDe.115), and operates on the outskirts of Syrian Arab Republic cities Aleppo and Idlib, extorting funds from and carrying out kidnappings and public executions of local Syrians. Physical description: eye colour brown, hair colour: dark, build: strong, straight nose, height: 180-185 cm, speaks Russian, English, Arabic. Wanted by the authorities of the Russian Federation for terrorist crimes committed in its territory. Photo available for inclusion in the INTERPOL-UN Security Council Special Notice. Review pursuant to Security Council resolution 2368 (2017) was concluded on 24 November 2020.</td>
		</tr>
		<tr>
			<td>86</td>
			<td>ISLAM</td>
			<td>&nbsp;</td>
			<td>29 Sep. 1983</td>
			<td>Russian Federation</td>
			<td>620169661</td>
			<td>HDBALHQCD</td>
			<td>As at Aug. 2015, emir of Russian-speaking militants of the Islamic State of Iraq and the Levant (ISIL), listed as Al-Qaida in Iraq (QDe.115). Controls the Syrian Arab Republic cities of Al Dana and Idlib as an ISIL chief. Wanted by the authorities of the Russian Federation for terrorist crimes committed in its territory. Photo available for inclusion in the INTERPOL-UN Security Council Special Notice. Review pursuant to Security Council resolution 2368 (2017) was concluded on 24 November 2020.</td>
		</tr>
		<tr>
			<td>87</td>
			<td>AKHMED</td>
			<td>&nbsp;</td>
			<td>4 Jul. 1980</td>
			<td>Russian Federation</td>
			<td>9600133195</td>
			<td>HDBALHQCD</td>
			<td>As at Aug. 2015, one of the leaders of the Islamic State in Iraq and the Levant (ISIL), listed as Al-Qaida in Iraq (QDe.115), commanding directly 130 militants. Physical description: eye colour: brown, hair colour: black, build: solid; distinguishing marks: oval face, beard, missing a right hand and left leg, speaks Russian, Chechen and possibly German and Arabic. Wanted by the authorities of the Russian Federation for terrorist crimes committed in its territory. Photo available for inclusion in the INTERPOL-UN Security Council Special Notice. Review pursuant to Security Council resolution 2368 (2017) was concluded on 24 November 2020.</td>
		</tr>
		<tr>
			<td>88</td>
			<td>TARKHAN</td>
			<td>&nbsp;</td>
			<td>11 Nov. 1965</td>
			<td>Russian Federation</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>As at Aug. 2015, leads Jamaat Tarkhan, a terrorist group that forms part of the Islamic State in Iraq and the Levant, listed as Al-Qaida in Iraq (QDe.115). Wanted by the authorities of the Russian Federation for terrorist crimes committed in its territory, including through an international arrest warrant. Photo available for inclusion in the INTERPOL-UN Security Council Special Notice. Review pursuant to Security Council resolution 2368 (2017) was concluded on 15 November 2021.</td>
		</tr>
		<tr>
			<td>89</td>
			<td>ZAURBEK</td>
			<td>&nbsp;</td>
			<td>7 Sep. 1975</td>
			<td>Russian Federation</td>
			<td>8304661431</td>
			<td>HDBALHQCD</td>
			<td>As at Aug. 2015, one of the leaders of the Army of Emigrants and Supporters (QDe.148). Wanted by the authorities of the Russian Federation for terrorist crimes committed in its territory. Photo available for inclusion in the INTERPOL-UN Security Council Special Notice. Review pursuant to Security Council resolution 2368 (2017) was concluded on 24 November 2020</td>
		</tr>
		<tr>
			<td>90</td>
			<td>SHAMIL</td>
			<td>&nbsp;</td>
			<td>29 Oct. 1980</td>
			<td>Russian Federation</td>
			<td>514448632</td>
			<td>HDBALHQCD</td>
			<td>As at Aug. 2015, leader of Jamaat Abu Hanifa, a terrorist group that is part of the Al-Nusrah Front for the People of the Levant (QDe.137). Physical description: eye colour: brown, hair colour: black, build: slim, height 175-180 cm. Distinguishing marks: long face, speech defect. Wanted by the authorities of the Russian Federation for terrorist crimes committed in its territory. Photo available for inclusion in the INTERPOL-UN Security Council Special Notice. Review pursuant to Security Council resolution 2368 (2017) was concluded on 24 November 2020</td>
		</tr>
		<tr>
			<td>91</td>
			<td>BOUBAKER</td>
			<td>&nbsp;</td>
			<td>1 Aug. 1983</td>
			<td>France/Tunisia</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>French-Tunisian foreign terrorist fighter for Islamic State in Iraq and the Levant (ISIL), listed as Al-Qaida in Iraq (QDe.115). Review pursuant to Security Council resolution 2368 (2017) was concluded on 15 November 2021</td>
		</tr>
		<tr>
			<td>92</td>
			<td>MAXIME</td>
			<td>&nbsp;</td>
			<td>17 Mar. 1992</td>
			<td>France</td>
			<td>101127200129</td>
			<td>HDBALHQCD</td>
			<td>French foreign terrorist fighter for Islamic State in Iraq and the Levant, listed as Al-Qaida in Iraq (QDe.115). French arrest warrant issued on 20 Jan. 2015 by a magistrate of the anti-terrorism division of the Prosecutor&rsquo;s Office in Paris for murder in connection with a terrorist entity and participation in a terrorist criminal association. Review pursuant to Security Council resolution 2368 (2017) was concluded on 15 November 2021</td>
		</tr>
		<tr>
			<td>93</td>
			<td>MORAD</td>
			<td>&nbsp;</td>
			<td>26 Feb. 1993</td>
			<td>Morocco</td>
			<td>UZ6430184</td>
			<td>HDBALHQCD</td>
			<td>Facilitator for travel of foreign terrorist fighters to join Islamic State in Iraq and the Levant, listed as Al-Qaida in Iraq (QDe.115), in Syrian Arab Republic. Review pursuant to Security Council resolution 2368 (2017) was concluded on 15 November 2021.</td>
		</tr>
		<tr>
			<td>94</td>
			<td>MOUNIR</td>
			<td>&nbsp;</td>
			<td>10 May 1983</td>
			<td>Tunisia</td>
			<td>8619445</td>
			<td>HDBALHQCD</td>
			<td>Foreign terrorist fighter facilitator experienced in establishing and securing travel routes. Deeply involved in providing material support to the Organization of Al-Qaida in the Islamic Maghreb (QDe.014) in North Africa. Assisted foreign terrorist fighters&rsquo; travel throughout North Africa and to Syrian Arab Republic to join Islamic State in Iraq and the Levant, listed as Al-Qaida in Iraq (QDe.115). Profession: farm worker. Mother&#39;s name: Mbarka Helali. Review pursuant to Security Council resolution 2368 (2017) was concluded on 15 November 2021.</td>
		</tr>
		<tr>
			<td>95</td>
			<td>MOHAMMED</td>
			<td>&nbsp;</td>
			<td>22 Sep. 1988</td>
			<td>Egypt</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Member of Al-Qaida (QDe.004). Involved in recruiting suicide bombers to go to Syrian Arab Republic and planning terrorist activities against targets in Europe. Arrested in Cairo, Egypt in 2013. Review pursuant to Security Council resolution 2368 (2017) was concluded on 15 November 2021</td>
		</tr>
		<tr>
			<td>96</td>
			<td>ASLAN</td>
			<td>&nbsp;</td>
			<td>22 Oct. 1974</td>
			<td>Russian Federation</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Wanted by the authorities of the Russian Federation for terrorist crimes. Commands a suicide battalion of Riyadus-Salikhin Reconnaissance and Sabotage Battalion of Chechen Martyrs (RSRSBCM) (QDe.100). Review pursuant to Security Council resolution 2368 (2017) was concluded on 15 November 2021</td>
		</tr>
		<tr>
			<td>97</td>
			<td>RUSTAM</td>
			<td>&nbsp;</td>
			<td>9 Mar. 1981</td>
			<td>Russian Federation</td>
			<td>555627</td>
			<td>HDBALHQCD</td>
			<td>Led a group of over 160 terrorist fighters, which operates in the Republics of Dagestan, Chechnya and Ingushetia, Russian Federation. Killed on 3 December 2016 in Makhachkala, the Republic of Dagestan, Russian Federation. Photo available for inclusion in the INTERPOL-UN Security Council Special Notice. Review pursuant to Security Council resolution 2253 (2015) was concluded on 21 Feb. 2019. Review pursuant to Security Council resolution 2368 (2017) was concluded on 15 November 2021.</td>
		</tr>
		<tr>
			<td>98</td>
			<td>FARED</td>
			<td>&nbsp;</td>
			<td>18 Feb. 1989</td>
			<td>Germany/Algeria</td>
			<td>5802098444</td>
			<td>HDBALHQCD</td>
			<td>German foreign terrorist fighter for Islamic State in Iraq and the Levant, listed as Al-Qaida in Iraq (QDe.115). Physical description: eye colour: brown; hair colour: black; height: 178cm; weight: 80kg. European arrest warrant issued by the investigating judge of the German Federal Supreme Court on 13 Aug. 2014</td>
		</tr>
		<tr>
			<td>99</td>
			<td>ALEXANDA</td>
			<td>&nbsp;</td>
			<td>13 Dec. 1983</td>
			<td>United Kingdom of Great Britain and Northern Ireland</td>
			<td>94477324</td>
			<td>HDBALHQCD</td>
			<td>Foreign terrorist fighter with Islamic State in Iraq and the Levant (ISIL), listed as Al-Qaida in Iraq (QDe.115), in the Syrian Arab Republic. Physical description: eye colour: dark brown; hair colour: black; complexion: dark. Distinguishing marks: beard. Ethnic background: Ghanaian Cypriot</td>
		</tr>
		<tr>
			<td>100</td>
			<td>ELSHAFEE</td>
			<td>&nbsp;</td>
			<td>16 Jul. 1988</td>
			<td>United Kingdom of Great Britain and Northern Ireland</td>
			<td>801121547</td>
			<td>HDBALHQCD</td>
			<td>Foreign terrorist fighter with Islamic State in Iraq and the Levant (ISIL), listed as Al-Qaida in Iraq (QDe.115), in the Syrian Arab Republic. Physical description: eye colour: dark brown; hair colour: black; complexion: dark. Distinguishing marks: beard. Mother&rsquo;s name: Maha Elgizouli.</td>
		</tr>
		<tr>
			<td>101</td>
			<td>MOHAMMED</td>
			<td>&nbsp;</td>
			<td>11 Oct. 1978</td>
			<td>Indonesia</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Senior member of Islamic State in Iraq and the Levant (ISIL), listed as Al-Qaida in Iraq (QDe.115). Recruited for ISIL and instructed individuals to perpetrate terrorist acts via online video. Physical description: hair colour: black; build: slight. Speaks Indonesian, Arabic and Mindanao dialect</td>
		</tr>
		<tr>
			<td>102</td>
			<td>RAFI</td>
			<td>&nbsp;</td>
			<td>3 Jun. 1966</td>
			<td>Malaysia /Indonesia</td>
			<td>A31142734</td>
			<td>HDBALHQCD</td>
			<td>Senior member of Islamic State in Iraq and the Levant (ISIL), listed as Al-Qaida in Iraq (QDe.115). Recruited for ISIL and instructed individuals to perpetrate terrorist acts via online video. Physical description: eye colour: brown; hair colour: brown; complexion: dark. Speaks Malay, English, limited Arabic</td>
		</tr>
		<tr>
			<td>103</td>
			<td>MUHAMMED</td>
			<td>&nbsp;</td>
			<td>3 Mar. 1990</td>
			<td>Philippines</td>
			<td>XX3966391</td>
			<td>HDBALHQCD</td>
			<td>enior member of Islamic State in Iraq and the Levant (ISIL), listed as Al-Qaida in Iraq (QDe.115). Recruited for ISIL and instructed individuals to perpetrate terrorist acts via online video. Physical description: height: 156cm; weight: 60 kg (as at Sep. 2016); eye colour: black; hair colour: black; build: medium; high cheekbones. Speaks Tagalog, English, Arabic.</td>
		</tr>
		<tr>
			<td>104</td>
			<td>EMRAAN</td>
			<td>&nbsp;</td>
			<td>4 Jul. 1967</td>
			<td>a) Trinidad and Tobago b) United States of America</td>
			<td>TB162181</td>
			<td>HDBALHQCD</td>
			<td>Senior member of Islamic State in Iraq and the Levant (ISIL), listed as Al-Qaida in Iraq (QDe.115). Recruited for ISIL and instructed individuals to perpetrate terrorist acts. Physical description: height 176 cm, weight 73 kg, medium built, colour of eyes- brown, colour of hair- black/bald, complexion- brown. Speaks English</td>
		</tr>
		<tr>
			<td>105</td>
			<td>ASHRAF</td>
			<td>&nbsp;</td>
			<td>5 Oct. 1991</td>
			<td>Tunisia</td>
			<td>13601334</td>
			<td>HDBALHQCD</td>
			<td>Senior member of Islamic State in Iraq and the Levant (ISIL), listed as Al-Qaida in Iraq (QDe.115). Recruited for ISIL and instructed individuals to perpetrate terrorist acts via online video.</td>
		</tr>
		<tr>
			<td>106</td>
			<td>MAHAD</td>
			<td>&nbsp;</td>
			<td>Between 1957 and 1962</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Listed pursuant to paragraph 8(a) of resolution 1844 (2008) as &ldquo;Engaging in or providing support for acts that threaten the peace, security or stability of Somalia, including acts that threaten the Djibouti Agreement of 18 August 2008 or the political process, or threaten the TFIs or AMISOM by force.&rdquo; Karate played a key role in the Amniyat, the wing of al-Shabaab responsible for the recent attack on Garissa University College in Kenya that resulted in nearly 150 deaths. The Amniyat is al-Shabaab&rsquo;s intelligence wing, which plays a key role in the execution of suicide attacks and assassinations in Somalia, Kenya, and other countries in the region, and provides logistics and support for al-Shabaab&rsquo;s terrorist activities.</td>
		</tr>
		<tr>
			<td>107</td>
			<td>ALI</td>
			<td>&nbsp;</td>
			<td>1966</td>
			<td>Somalia</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Listed pursuant to paragraph 43(a) of resolution 2093 (2013) as &ldquo;Engaging in or providing support for acts that threaten the peace, security or stability of Somalia, including acts that threaten the peace and reconciliation process in Somalia, or threaten the Federal Government of Somalia or AMISOM by force.&rdquo; As a spokesperson for Al-Shabaab, Rage is involved in promulgating and supporting the group&rsquo;s terrorist activities.</td>
		</tr>
		<tr>
			<td>108</td>
			<td>ABDUL KABIR</td>
			<td>&nbsp;</td>
			<td>1963</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>&nbsp;</td>
			<td>Active in terrorist operations in Eastern Afghanistan. Collects money from drug traffickers. Believed to be in Afghanistan/Pakistan border area. Member of the Taliban Supreme Council as at 2009. Family is originally from Neka District, Paktia Province, Afghanistan. Responsible for attack on Afghan parliamentarians in November 2007 in Baghlan; owns land in central Baghlan Province. Belongs to Zadran tribe. Review pursuant to Security Council resolution 1822 (2008) was concluded on 23 Jul. 2010.</td>
		</tr>
		<tr>
			<td>109</td>
			<td>THE HOUTHIS</td>
			<td>ANSARALLAH<br />
			ANSAR ALLAH<br />
			PARTISANS OF GOD<br />
			SUPPORTERS OF GOD</td>
			<td>&nbsp;</td>
			<td>Yemen</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Listed pursuant to paragraph 5 of resolution 2624 (2022) as subject to the measures imposed by paragraph 14 of resolution 2216 (2015) (targeted arms embargo). The Houthis have engaged in acts that threaten the peace, security, and stability of Yemen. The Houthis have engaged in attacks striking civilians and civilian infrastructure in Yemen, implemented a policy of sexual violence and repression against politically active and professional women, engaged in the recruitment and use of children, incited violence against groups including on the basis of religion and nationality, and indiscriminately used landmines and improvised explosive devices on the West Coast of Yemen. The Houthis have also obstructed the delivery of humanitarian assistance to Yemen, or access to, or distribution of, humanitarian assistance in Yemen. The Houthis have conducted attacks on commercial shipping in the Red Sea using waterborne improvised explosive devices and sea mines. The Houthis have also perpetrated repeated cross-border terrorist attacks striking civilians and civilian infrastructure in the Kingdom of Saudi Arabia and the United Arab Emirates and threatened to intentionally target civilian sites. INTERPOL-UN Security Council Special Notice web link: https://www.interpol.int/en/How-we-work/Notices/View-UN-Notices-Entities</td>
		</tr>
		<tr>
			<td>110</td>
			<td>KHATIBA AL-TAWHID WAL-JIHAD (KTJ)</td>
			<td>JANNAT OSHIKLARI<br />
			Jama`at al-Tawhid wal-Jihad<br />
			JANNAT OSHIKLARI</td>
			<td>&nbsp;</td>
			<td>Syrian Arab Republic</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Khatiba al-Tawhid wal-Jihad (formerly known as Jannat Oshiklari) is a terrorist organization operating under the umbrella of the international terrorist organization Al-Nusrah Front for the People of the Levant (QDe.137). The group mainly operates in the provinces of Hama, Idlib and Ladhiqiyah, in the Syrian Arab Republic, and also conduct operations in Turkey, Kyrgyzstan, Uzbekistan, Russian Federation, Tajikistan, Kazakhstan, Egypt, Afghanistan, Ukraine. The number of fighters of KTJ is about 500. KTJ also cooperates with such terrorist organizations as Khatiba Imam al-Bukhari (QDe.158) and the Islamic Jihad Group (QDe.119). INTERPOL-UN Security Council Special Notice web link: https://www.interpol.int/en/How-we-work/Notices/View-UN-Notices-Entities</td>
		</tr>
		<tr>
			<td>111</td>
			<td>ISLAMIC STATE IN THE GREATER SAHARA (ISGS)</td>
			<td>Islamic State in Iraq and Syria &ndash; Greater Sahara (ISIS-GS)<br />
			Islamic State of Iraq and the Levant - Greater Sahara (ISIL-GS)<br />
			Islamic State of the Greater Sahel<br />
			ISIS in the Greater Sahel<br />
			ISIS in the Greater Sahara<br />
			ISIS in the Islamic Sahel</td>
			<td>&nbsp;</td>
			<td>Islamic State in Iraq</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Formed in May 2015 by Adnan Abu Walid al-Sahraoui (QDi.415). Associated with the Islamic State in Iraq and the Levant (listed as Al-Qaida in Iraq (QDe.115)). Splinter group of Al-Mourabitoun (QDe.141). Committed terrorist attacks in Mali, Niger and Burkina Faso. INTERPOL-UN Security Council Special Notice web link: https://www.interpol.int/en/How-we-work/Notices/View-UN-Notices-Entities click here</td>
		</tr>
		<tr>
			<td>112</td>
			<td>ISLAMIC STATE WEST AFRICA PROVINCE (ISWAP)</td>
			<td>Islamic State in Iraq and the Levant &ndash; West Africa (ISIL-WA)<br />
			Islamic State of Iraq and Syria &ndash; West Africa (ISIS-WA)<br />
			Islamic State of Iraq and Syria West Africa Province (ISISWAP)<br />
			Islamic State of Iraq and the Levant &ndash; West Africa</td>
			<td>&nbsp;</td>
			<td>Islamic State in Iraq</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Associated with the Islamic State in Iraq and the Levant (listed as Al-Qaida in Iraq (QDe.115)). Formed in March 2015 by Abubakar Shekau (QDi.322). Splinter group of Jama&#39;atu Ahlis Sunna Lidda&#39;Awati Wal-Jihad (Boko Haram) (QDe.138). Committed terrorist attacks in Nigeria. INTERPOL-UN Security Council Special Notice web link: https://www.interpol.int/en/How-we-work/Notices/View-UN-Notices-Entities click here</td>
		</tr>
		<tr>
			<td>113</td>
			<td>KHATIBA IMAM AL-BUKHARI (KIB)</td>
			<td>Khataib al-Imam al-Bukhari</td>
			<td>&nbsp;</td>
			<td>Afghanistan/Pakistan border area (previous location)<br />
			Khan-Shaykhun, Syrian Arab Republic<br />
			Idlib, Aleppo and Khama, Syrian Arab Republic (operation zone)</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Associated with Al-Nusrah Front for the People of the Levant (QDe.137). Committed terrorist attacks in the Syrian Arab Republic. Since 2016 redeployed to Northern Afghanistan to project attacks against Central Asia countries. INTERPOL-UN Security Council Special Notice web link: https://www.interpol.int/en/How-we-work/Notices/View-UN-Notices-Entities click here</td>
		</tr>
		<tr>
			<td>114</td>
			<td>MUJAHIDIN INDONESIAN TIMUR (MIT)</td>
			<td>Mujahidin of Eastern Indonesia<br />
			East Indonesia Mujahideen<br />
			Mujahidin Indonesia Timor<br />
			Mujahidin Indonesia Barat (MIB)<br />
			Mujahidin of Western Indonesia</td>
			<td>&nbsp;</td>
			<td>Indonesia</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Terrorist group linked to Islamic State in Iraq and the Levant (ISIL), listed as Al-Qaida in Iraq (QDe.115), Jemaah Islamiyah (JI) (QDe.092), and Jemmah Anshorut Tauhid (JAT) (QDe.133). Operates in Java and Sulawesi, Indonesia and also active in Indonesia&rsquo;s eastern provinces. Its former leader was Abu Wardah, a.k.a. Santoso (deceased). Review pursuant to Security Council resolution 2368 (2017) was concluded on 15 November 2021. INTERPOL-UN Security Council Special Notice web link: https://www.interpol.int/en/How-we-work/Notices/View-UN-Notices-Entities click here</td>
		</tr>
		<tr>
			<td>115</td>
			<td>HARAKAT SHAM AL-ISLAM</td>
			<td>Haraket Sham al-Islam<br />
			Sham al-Islam<br />
			Sham al-Islam Movement</td>
			<td>&nbsp;</td>
			<td>Syrian Arab Republic</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Moroccan-led terrorist organization formed in Aug. 2013 and operating in Syrian Arab Republic. Principally composed of foreign terrorist fighters and associated with AI-Nusrah Front for the People of the Levant (QDe.137). INTERPOL-UN Security Council Special Notice web link: https://www.interpol.int/en/How-we-work/Notices/View-UN-Notices-Entities click here</td>
		</tr>
		<tr>
			<td>116</td>
			<td>THE ARMY OF EMIGRANTS AND SUPPORTERS</td>
			<td>Battalion of Emigrants and Supporters<br />
			Army of Emigrants and Supporters organization<br />
			Battalion of Emigrants and Ansar<br />
			Jaysh al-Muhajirin wal-Ansar (JAMWA)</td>
			<td>&nbsp;</td>
			<td>Jabal Turkuman area, Lattakia Governorate, Syrian Arab Republic</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Established by foreign terrorist fighters in 2013. Location: Syrian Arab Republic. Affiliated with Islamic State in Iraq and the Levant, listed as Al-Qaida in Iraq (QDe.115) and AI-Nusrah Front for the People of the Levant (QDe.137). Review pursuant to Security Council resolution 2368 (2017) was concluded on 24 November 2020. INTERPOL-UN Security Council Special Notice web link: https://www.interpol.int/en/How-we-work/Notices/View-UN-Notices-Entities click here</td>
		</tr>
		<tr>
			<td>117</td>
			<td>HILAL AHMAR SOCIETY INDONESIA (HASI)</td>
			<td>Yayasan Hilal Ahmar<br />
			Indonesia Hilal Ahmar Society for Syria</td>
			<td>&nbsp;</td>
			<td>Lampung, Jakarta, Semarang, Yogyakarta, Solo, Surabaya and Makassar, Indonesia</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Ostensibly humanitarian wing of Jemaah Islamiyah (QDe.092). Operates in Lampung, Jakarta, Semarang, Yogyakarta, Solo, Surabaya and Makassar, Indonesia. Has been recruiting, funding and facilitating travel of foreign terrorist fighters to Syria. Not affiliated with the humanitarian group International Federation of the Red Cross and Red Crescent Societies (IFRC). Review pursuant to Security Council resolution 2368 (2017) was concluded on 24 November 2020. INTERPOL-UN Security Council Special Notice web link: https://www.interpol.int/en/How-we-work/Notices/View-UN-Notices-Entities click here</td>
		</tr>
		<tr>
			<td>118</td>
			<td>ANSAR AL CHARIA BENGHAZI</td>
			<td>نصار الشريعة (Ansar al Charia)<br />
			Ansar al-Charia<br />
			Ansar al-Sharia<br />
			Ansar al-Charia Benghazi<br />
			Ansar al-Sharia Benghazi<br />
			أنصار الشريعة بليبيا (Ansar al Charia in Libya (ASL)<br />
			كتيبة أنصار الشريعة (Katibat Ansar al Charia)<br />
			Ansar al Sharia</td>
			<td>&nbsp;</td>
			<td>Operates in Benghazi, Libya</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Associated with the Organization of Al-Qaida in the Islamic Maghreb (QDe.014), Al Mourabitoun (QDe.141), Ansar al-Shari&rsquo;a in Tunisia (AAS-T) (QDe.143), and Ansar al Charia Derna (QDe.145). The leader is Mohamed al-Zahawi (not listed). Runs training camps for foreign terrorist fighters travelling to Syria, Iraq and Mali. Review pursuant to Security Council resolution 2368 (2017) was concluded on 4 Dec. 2019 INTERPOL-UN Security Council Special Notice web link: https://www.interpol.int/en/How-we-work/Notices/View-UN-Notices-Entities click here</td>
		</tr>
		<tr>
			<td>119</td>
			<td>ANSAR AL CHARIA DERNA</td>
			<td>Ansar al-Charia Derna<br />
			Ansar al-Sharia Derna<br />
			أنصار الشريعة (Ansar al Charia)<br />
			Ansar al-Sharia<br />
			Ansar al Sharia</td>
			<td>&nbsp;</td>
			<td>Derna and Jebel Akhdar, Libya</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Associated with the Organization of Al-Qaida in the Islamic Maghreb (QDe.014), Ansar al-Shari&rsquo;a in Tunisia (AAS-T) (QDe.143) and Ansar al Charia Benghazi (QDe.146). Runs training camps for foreign terrorist fighters travelling to Syria and Iraq. Review pursuant to Security Council resolution 2368 (2017) was concluded on 4 Dec. 2019 INTERPOL-UN Security Council Special Notice web link: https://www.interpol.int/en/How-we-work/Notices/View-UN-Notices-Entities click here</td>
		</tr>
		<tr>
			<td>120</td>
			<td>ANSARUL MUSLIMINA FI BILADIS SUDAN</td>
			<td>Ansaru<br />
			Jama&#39;atu Ansaril Muslimina fi Biladis Sudan (JAMBS)<br />
			Jama&rsquo;atu Ansarul Muslimina fi Biladis-Sudan (JAMBS)<br />
			Jamma&rsquo;atu Ansarul Muslimina fi Biladis-Sudan (JAMBS)<br />
			Vanguards for the Protection of Muslims in Black Africa<br />
			Vanguard for the Protection of Muslims in Black Africa</td>
			<td>&nbsp;</td>
			<td>Nigeria</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Terrorist and paramilitary group established in 2012 and operating in Nigeria. Associated with the Organization of Al-Qaida in the Islamic Maghreb (AQIM) (QDe.014), Jama&#39;atu Ahlis Sunna Lidda&#39;Awati Wal-Jihad (Boko Haram) (QDe.138) and Abubakar Mohammed Shekau (QDi322). Review pursuant to Security Council resolution 2368 (2017) was concluded on 4 Dec. 2019 INTERPOL-UN Security Council Special Notice web link: https://www.interpol.int/en/How-we-work/Notices/View-UN-Notices-Entities click here</td>
		</tr>
		<tr>
			<td>121</td>
			<td>AL-NUSRAH FRONT FOR THE PEOPLE OF THE LEVANT</td>
			<td>Conquest of the Levant Front<br />
			The Front for the Liberation of al Sham<br />
			Front for the Conquest of Syria/the Levant<br />
			Front for the Liberation of the Levant<br />
			Front for the Conquest of Syria</td>
			<td>&nbsp;</td>
			<td>Syrian Arab Republic</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Associated with Al-Qaida (QDe.004). Brought Syrian and foreign Al-Qaida in Iraq (QDe.115) and Asbat al-Ansar (QDe.007) fighters, along with other foreign Al-Qaida operatives, to join local elements in Syrian Arab Republic to carry out terrorist and guerrilla operations there. Previously associated with the Islamic State in Iraq and the Levant (ISIL), listed as Al-Qaida in Iraq (QDe.115), and its leader Ibrahim Awwad Ibrahim Ali al-Badri al-Samarrai (QDi.299) but separated from that group in 2013. In Jul. 2016, Abu Mohammed Al-Jawlani (QDi.317), the leader of Al-Nusrah Front for the People of the Levant, announced the group had changed its name to Jabhat Fath al-Sham and was no longer affiliated with any external entity. Despite the announcement and attempts to distinguish itself from Al-Nusrah Front for the People of the Levant, the group remains aligned with Al-Qaida and continues to carry out terrorist operations under this new name. In January 2017, Al-Nusrah Front created Hay&rsquo;at Tahrir al-Sham (HTS) as a vehicle to advance its position in the Syrian insurgency and further its own goals as Al-Qaida&rsquo;s affiliate in Syria. Previously listed between 30 May 2013 and 13 May 2014 as an aka of Al-Qaida in Iraq (QDe.115). Review pursuant to Security Council resolution 2368 (2017) was concluded on 15 November 2021. INTERPOL-UN Security Council Special Notice web link: https://www.interpol.int/en/How-we-work/Notices/View-UN-Notices-Entities click here</td>
		</tr>
		<tr>
			<td>122</td>
			<td>MUHAMMAD JAMAL NETWORK (MJN)</td>
			<td>Muhammad Jamal Group<br />
			Jamal Network<br />
			Abu Ahmed Group<br />
			Al-Qaida in Egypt (AQE)</td>
			<td>&nbsp;</td>
			<td>Egypt, Libya and Mali</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Terrorist and paramilitary group established by Muhammad Jamal al Kashif (QDi.318) in 2011 and linked to Al-Qaida (QDe.004), Aiman al-Zawahiri (QDi.006), and the leadership of Al-Qaida in the Arabian Peninsula (AQAP) (QDe.129) and the Organization of Al-Qaida in the Islamic Maghreb (AQIM) (QDe.014). Funded and supported by AQAP. Multiple terrorist training camps in Egypt and Libya. Reportedly acquiring weapons, conducting training and establishing terrorist groups in the Sinai, Egypt. Training suicide bombers, foreign fighters and planning terrorist attacks in Egypt, Libya and elsewhere as of Sep. 2013. MJN members were reported to be involved in the attack on the United States Mission in Benghazi, Libya, on 11 Sep. 2012. Review pursuant to Security Council resolution 2253 (2015) was concluded on 21 Feb. 2019. INTERPOL-UN Security Council Special Notice web link: https://www.interpol.int/en/How-we-work/Notices/View-UN-Notices-Entities click here</td>
		</tr>
		<tr>
			<td>123</td>
			<td>AL RASHID TRUST</td>
			<td>Al-Rasheed Trust<br />
			Al Rasheed Trust<br />
			Al-Rashid Trust<br />
			Aid Organization of the Ulema, Pakistan<br />
			Al Amin Welfare Trust<br />
			Al Amin Trust<br />
			Al Ameen Trust<br />
			Al-Ameen Trust<br />
			Al Madina Trust<br />
			Al-Madina Trust</td>
			<td>&nbsp;</td>
			<td>Pakistan</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Headquarters are in Pakistan. Operations in Afghanistan: Herat Jalalabad, Kabul, Kandahar, Mazar Sherif. Also operations in Kosovo, Chechnya. Involved in the financing of Al-Qaida and the Taliban. Until 21 Oct. 2008, this entity appeared also as &quot;Aid Organization of the Ulema, Pakistan&quot; (QDe.073), listed on 24 Apr. 2002 and amended on 25 Jul. 2006. The two entries Al Rashid Trust (QDe.005) and Aid Organization of the Ulema, Pakistan (QDe.073) were consolidated into this entity on 21 Oct. 2008. Founded by Mufti Rashid Ahmad Ledahyanoy (deceased). Associated with Jaish-i-Mohammed (QDe.019). Banned in Pakistan since Oct. 2001. Despite the closure of its offices in Pakistan in February 2007 it has continued its activities. Review pursuant to Security Council resolution 1822 (2008) was concluded on 6 May 2010. Review pursuant to Security Council resolution 2368 (2017) was concluded on 4 Dec. 2019. INTERPOL-UN Security Council Special Notice web link: https://www.interpol.int/en/How-we-work/Notices/View-UN-Notices-Entities click here</td>
		</tr>
		<tr>
			<td>124</td>
			<td>AMROGGANG DEVELOPMENT BANKING CORPORATION</td>
			<td>AMROGGANG Development Bank<br />
			Amnokkang Development Bank</td>
			<td>&nbsp;</td>
			<td>Korea</td>
			<td>&nbsp;</td>
			<td>HDBALHQCD</td>
			<td>Amroggang, which was established in 2006, is a Tanchon Commercial Bank-related company managed by Tanchon officials. Tanchon plays a role in financing KOMID&rsquo;s sales of ballistic missiles and has also been involved in ballistic missile transactions from KOMID to Iran&rsquo;s Shahid Hemmat Industrial Group (SHIG). Tanchon Commercial Bank was designated by the Committee in April 2009 and is the main DPRK financial entity for sales of conventional arms, ballistic missiles, and goods related to the assembly and manufacture of such weapons. KOMID was designated by the Committee in April 2009 and is the DPRK&rsquo;s primary arms dealer and main exporter of goods and equipment related to ballistic missiles and conventional weapons. The Security Council designated SHIG in resolution 1737 (2006) as an entity involved in Iran&rsquo;s ballistic missile programme.</td>
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
