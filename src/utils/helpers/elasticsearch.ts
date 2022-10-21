import slugify from 'slugify';

const handleConvertString = (char: string) => {
  return slugify(char, {
    replacement: ' ',
    remove: undefined,
    lower: true,
    strict: false,
    locale: 'vi',
    trim: true,
  });
};

export const handleSearchCharacter = (subString: string, str: string) => {
  let i = -1;
  while ((i = str.indexOf(subString, i + 1)) >= 0) {
    if (str[i - 1] === ' ' || i === 0) {
      return true;
    }
  }
  return false;
};
export const handleConvertSearch = (listLocation: any, keyword: string) => {
  let data: any = [];
  listLocation?.forEach((item: any) => {
    const charConvert: string = handleConvertString(item?.title);
    const indexAccented: number = item?.title.toLowerCase().indexOf(keyword);
    if (indexAccented !== -1) {
      if (handleSearchCharacter(keyword, item?.title.toLowerCase())) {
        data.push(item);
      }
    } else {
      const indexUnsigned = charConvert.indexOf(keyword.toLowerCase());
      if (indexUnsigned !== -1) {
        if (handleSearchCharacter(keyword, charConvert)) {
          data.push(item);
        }
      }
    }
  });
  return data;
};
